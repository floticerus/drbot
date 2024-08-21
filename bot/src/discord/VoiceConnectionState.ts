import {
  type InternalDiscordGatewayAdapterCreator,
  type VoiceBasedChannel,
} from 'discord.js'
import {
  AudioPlayer,
  VoiceConnection,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from '@discordjs/voice'
import type { MediaInfoStored } from '~/bot/types/types.js'
import { EventEmitter } from 'node:events'
import { shuffleInPlace } from '~/bot/util/index.js'

export type VoiceConnectionStateOptions = {
  readonly channelId: string
  readonly guildId: string
  readonly adapterCreator: InternalDiscordGatewayAdapterCreator
}

export class VoiceConnectionState extends EventEmitter {
  constructor({
    channelId,
    guildId,
    adapterCreator,
  }: VoiceConnectionStateOptions) {
    super()
    this.setMaxListeners(100)
    this.channelId = channelId
    this.guildId = guildId
    this.adapterCreator = adapterCreator
  }

  public readonly channelId: string
  public readonly guildId: string
  public readonly adapterCreator: InternalDiscordGatewayAdapterCreator

  protected _connection?: VoiceConnection
  public get connection() {
    return this._connection
  }

  protected _player?: AudioPlayer
  public get player() {
    return this._player
  }

  protected _nowPlaying?: MediaInfoStored
  public get nowPlaying() {
    return this._nowPlaying
  }

  protected _queue: MediaInfoStored[] = []
  public get queue() {
    return this._queue
  }

  protected _paused: boolean = false
  public get paused() {
    return this._paused
  }

  static fromVoiceChannel({
    id: channelId,
    guild: { id: guildId, voiceAdapterCreator: adapterCreator },
  }: VoiceBasedChannel) {
    return new VoiceConnectionState({
      channelId,
      guildId,
      adapterCreator,
    })
  }

  async start() {
    // we're importing this way to avoid circular deps
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

    this.emit('start', { channelId: this.channelId })
  }

  async stop({
    destroyConnection = true,
  }: { destroyConnection?: boolean } = {}) {
    // we're importing this way to avoid circular deps
    const { connections } = await import('./voice.js')
    this._nowPlaying = undefined
    this._queue = []
    this._player?.stop(true)
    destroyConnection && this._connection?.destroy()
    const { channelId } = this
    delete connections[channelId]
    this.emit('stop', { channelId })
  }

  async addToQueue(media: MediaInfoStored) {
    const position = this._queue.push(media) - 1
    this.emit('queued', { position, media })
    if (!this._nowPlaying) {
      await this.playNextOrStop()
      return position - 1
    }
    return position
  }

  play(media: MediaInfoStored) {
    this._nowPlaying = media
    this.emit('nowplaying', { media })
    this._player = createAudioPlayer({})
    this._connection.subscribe(this._player)
    const resource = createAudioResource(media.path, {
      metadata: {
        path: media.path,
        album: media.album ?? 'Unknown album',
        artist: media.artist ?? media.albumArtist ?? 'Unknown artist',
        title: media.title ?? media.filename ?? 'Unknown',
      },
    })
    this._player.once('error', async (err) => {
      console.error(err)
      await this.playNextOrStop()
    })
    this._player.once('idle', async () => {
      await this.playNextOrStop()
    })
    this._player.on('stateChange', ({ status }) => {
      this._paused = status === 'paused'
      this._connection.setSpeaking(status === 'playing')
    })
    this._player.play(resource)
  }

  async playNextOrStop() {
    const mediaInfo = this._queue.shift()

    if (mediaInfo) {
      this.play(mediaInfo)
    } else {
      await this.stop()
    }
  }

  pause() {
    if (this._player) {
      this._player.pause(true)
    }
  }

  resume() {
    if (this._player) {
      this._player.unpause()
    }
  }

  shuffle() {
    shuffleInPlace(this._queue)
  }
}
