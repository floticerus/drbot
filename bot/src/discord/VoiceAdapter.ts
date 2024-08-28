import {
  DiscordAPIError,
  type Interaction,
  type InteractionResponse,
  type InternalDiscordGatewayAdapterCreator,
  type Message,
  type VoiceBasedChannel,
} from 'discord.js'
import {
  AudioPlayer,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  NoSubscriberBehavior,
  VoiceConnection,
} from '@discordjs/voice'
import type { MediaInfoStored } from '~/bot/types/types.js'
import { EventEmitter } from 'node:events'
import {
  deleteMessageAfterTimeout,
  getDisplayStringForMedia,
  replyOrFollowUp,
  shuffleInPlace,
} from '~/bot/util/index.js'

export type VoiceAdapterOptions = {
  readonly channelId: string
  readonly guildId: string
  readonly adapterCreator: InternalDiscordGatewayAdapterCreator
}

export class VoiceAdapter extends EventEmitter {
  constructor({ channelId, guildId, adapterCreator }: VoiceAdapterOptions) {
    super()
    this.setMaxListeners(100)
    this.channelId = channelId
    this.guildId = guildId
    this.adapterCreator = adapterCreator
    this._boundPlayNext = this.playNextOrStop.bind(this)
  }

  public readonly channelId: string
  public readonly guildId: string
  public readonly adapterCreator: InternalDiscordGatewayAdapterCreator

  protected _npReply?: InteractionResponse | Message

  protected _boundPlayNext?: () => Promise<void>

  protected _connection?: VoiceConnection
  public get connection(): VoiceConnection {
    return this._connection
  }

  protected _player?: AudioPlayer
  public get player(): AudioPlayer {
    return this._player
  }

  protected _nowPlaying?: MediaInfoStored
  public get nowPlaying(): MediaInfoStored {
    return this._nowPlaying
  }

  protected _queue: MediaInfoStored[] = []
  public get queue(): MediaInfoStored[] {
    return this._queue
  }

  protected _paused: boolean = false
  public get paused(): boolean {
    return this._paused
  }

  /**
   *
   * @param channelId
   * @param guildId
   * @param adapterCreator
   */
  static fromVoiceChannel({
    id: channelId,
    guild: { id: guildId, voiceAdapterCreator: adapterCreator },
  }: VoiceBasedChannel): VoiceAdapter {
    return new VoiceAdapter({
      channelId,
      guildId,
      adapterCreator,
    })
  }

  static async playOnChannel(
    voiceChannel: VoiceBasedChannel,
    media: MediaInfoStored,
  ): Promise<{ status: 'played' | 'queued'; index: number }> {
    const { connections } = await import('./voice.js')
    if (connections[voiceChannel.id]) {
      const index = await connections[voiceChannel.id].addToQueue(media)
      return { status: 'queued', index }
    }
    await VoiceAdapter.fromVoiceChannel(voiceChannel).start()
    connections[voiceChannel.id].play(media)
    return { status: 'played', index: 0 }
  }

  /**
   *
   */
  async start(): Promise<void> {
    // we're importing this way to avoid circular deps.
    // it's currently the only reason this function is async,
    // which is unfortunate.
    const { connections } = await import('./voice.js')
    if (connections[this.channelId]) {
      throw new Error('ALREADY_EXISTS')
    }
    connections[this.channelId] = this
    this._connection = joinVoiceChannel({
      guildId: this.guildId,
      channelId: this.channelId,
      adapterCreator: this.adapterCreator,
    })
    this._connection.once('disconnected', async () => {
      // specify that we don't need to destroy the connection, because it's already being destroyed
      await this.stop({ destroyConnection: false })
    })

    this._player = createAudioPlayer({
      behaviors: {
        // this noSubscriber behaviour seems very wonky. not sure why it's needed.
        // sometimes gets stuck in play/idle loop, where a playing track immediately
        // goes idle, which causes it to skip to the next track.
        // possibly exacerbated by cpu load? unsure.
        noSubscriber: NoSubscriberBehavior.Play,
        // both of these options seem to cause big problems and aren't respected by
        // the discord.js module or something, idk. seems wacky AF.
        // set it to infinity to make it fuck off, hopefully.
        maxMissedFrames: Infinity,
      },
      // not even sure what this does. nothing from the looks of it.
      debug: true,
    })
    this._player.on('stateChange', ({ status }) => {
      this._paused = status === 'paused'
      this._connection.setSpeaking(status === 'playing')
    })
    this._player.on('error', async (err) => {
      console.error('PLAYER ERROR', err)
      // await this.playNextOrStop()
    })
    this._connection.subscribe(this._player)

    this.emit('start', { channelId: this.channelId })
  }

  /**
   *
   * @param destroyConnection
   */
  async stop({
    destroyConnection = true,
  }: { destroyConnection?: boolean } = {}): Promise<void> {
    // we're importing this way to avoid circular deps.
    // it's currently the only reason this function is async,
    // which is unfortunate.
    const { connections } = await import('./voice.js')
    this._nowPlaying = undefined
    this._queue = []
    if (destroyConnection && this._connection) {
      this._connection.destroy()
    } else {
      this._player?.stop(true)
    }
    const { channelId } = this
    delete connections[channelId]
    this.emit('stop', { channelId })
  }

  /**
   * adds `MediaInfoStored` data to the queue.
   * if nothing is playing, it gets played immediately.
   *
   * @param media
   * @returns a `Promise` which resolves with the index of `media` in the queue.
   *          resolves with `-1` if the queue is empty, resulting in immediate playback.
   */
  async addToQueue(media: MediaInfoStored): Promise<number> {
    const position = this._queue.push(media) - 1
    this.emit('queued', { position, media })
    if (!this._nowPlaying) {
      await this.playNextOrStop()
      return position - 1
    }
    return position
  }

  /**
   * plays `MediaInfoStored` data over the voice channel.
   *
   * @param media
   */
  play(media: MediaInfoStored): void {
    // make note of the nowPlaying value now, however due to the
    // async nature it could get overwritten after playback begins.
    this._nowPlaying = media
    // create the audio resource
    const resource = createAudioResource(media.path, {
      // make note of some metadata, but we're not even using this anywhere.
      metadata: {
        path: media.path,
        album: media.album ?? 'Unknown album',
        artist: media.artist ?? media.albumArtist ?? 'Unknown artist',
        title: media.title ?? media.filename ?? 'Unknown',
      },
    })
    // this part looks a little messy but i'm having big problems
    // with the player immediately going into 'idle' state and causing
    // it to get stuck in a loop of play/idle/play/idle/etc.
    // UPDATE: it turns out, this was caused by the index getting
    // duplicates and some files being unplayable. attempted to
    // make the index pruning more aggressive to solve, but this
    // part should do something more obvious when it detects problems.
    this._player.off('idle', this._boundPlayNext)
    // .stop() probably isn't necessary, but it doesn't seem to hurt anything.
    this._player.stop()
    // listen for the `playing` event one time
    this._player.once('playing', () => {
      // make sure we know which media is playing currently
      this._nowPlaying = media
      // send out a `nowplaying` event with the media
      this.emit('nowplaying', { media })
      // when the audio player goes idle, attempt to play the next queued track
      this._player.once('idle', this._boundPlayNext)
    })
    // play the new audio resource after events are set up
    this._player.play(resource)
  }

  /**
   * either plays the next track in the queue, or stops the connection if the queue is empty.
   * this is used when a track ends or is skipped.
   */
  async playNextOrStop(): Promise<void> {
    const mediaInfo = this._queue.shift()

    if (mediaInfo) {
      this.play(mediaInfo)
    } else {
      await this.stop()
    }
  }

  /**
   * pauses playback
   */
  pause(): void {
    this._player?.pause(true)
  }

  /**
   * resumes playback when paused
   */
  unpause(): void {
    this._player?.unpause()
  }

  /**
   * shuffles the queue
   */
  shuffle(): void {
    shuffleInPlace(this._queue)
  }

  async displayNowPlayingReply(
    interaction: Interaction,
  ): Promise<InteractionResponse<boolean> | Message<boolean>> {
    const previousNpReply = this._npReply

    await Promise.all([
      (async () => {
        if (previousNpReply) {
          try {
            // this will throw if it can't be deleted - probably expired token
            await previousNpReply.delete()
          } catch (err) {
            console.error(err)
          }
        }
      })(),
      (async () => {
        this._npReply = undefined

        if (interaction.isRepliable()) {
          if (this._nowPlaying) {
            const response = await replyOrFollowUp(
              interaction,
              `**Now Playing**: ${getDisplayStringForMedia(this._nowPlaying)}`,
            )
            this._npReply = response

            // perhaps we'll need to unbind this eventually, but for now it's ok i guess?
            // when the bot leaves voice chat, the connection is destroyed and stops firing events.
            // maybe if someone else calls `np` - it should unbind the previous call?
            // strange crash when i had 2 `np` calls running - coincidence or something we need to solve
            const onNowPlaying = async ({
              media,
            }: {
              media: MediaInfoStored
            }): Promise<void> => {
              if (media) {
                try {
                  await response.edit(
                    `**Now Playing**: ${getDisplayStringForMedia(media)}`,
                  )
                } catch (err) {
                  // unsubscribe this event for any error, but don't log specific error codes
                  if (err instanceof DiscordAPIError) {
                    switch (err.code) {
                      case 50027: // Invalid Webhook Token (making requests on old message, ~15m or so)
                      case 10008: // Unknown Message (probably just an already deleted message? should fix tho...)
                        break
                      default:
                        console.error(err)
                        break
                    }
                  } else {
                    console.error(err)
                  }

                  this.off('nowplaying', onNowPlaying)
                }
              }
            }

            this.on('nowplaying', onNowPlaying)

            deleteMessageAfterTimeout({
              message: response,
              duration: 1000 * 60 * 10, // 10 minutes
              onDeleted: () => {
                this.off('nowplaying', onNowPlaying)
              },
              onError: (err) => {
                console.error(err)
                this.off('nowplaying', onNowPlaying)
              },
            })
          } else {
            await replyOrFollowUp(interaction, {
              content: 'Not playing 😿',
              ephemeral: true,
            })
          }
        }
      })(),
    ])

    return this._npReply
  }
}
