import { DiscordAPIError, SlashCommandBuilder } from 'discord.js'
import type { CommandInfo, MediaInfoStored } from '~/bot/types/types.js'
import { connections } from '~/bot/discord/voice.js'
import {
  getDisplayStringForMedia,
  getVoiceChannelForInteraction,
} from '~/bot/util/index.js'

export default {
  data: new SlashCommandBuilder()
    .setName('np')
    .setDescription('(n)ow (p)laying: Displays the currently playing track'),
  async execute(interaction): Promise<void> {
    const voice = await getVoiceChannelForInteraction(interaction)

    if (voice) {
      const connection = connections[voice.id]

      if (connection) {
        if (interaction.isRepliable()) {
          const { nowPlaying } = connection
          if (nowPlaying) {
            const response = await interaction.reply(
              `**Now Playing**: ${getDisplayStringForMedia(nowPlaying)}`,
            )

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
                  // unsubscribe this event for any error, but don't log error code 50027: Invalid Webhook Token
                  // that just means the token is expired. maybe we can refresh it? or just forget about it.
                  // tokens seem to stop working after ~15 minutes.
                  if (err instanceof DiscordAPIError) {
                    if (err.code !== 50027) {
                      console.error(err)
                    }
                  } else {
                    console.error(err)
                  }

                  connection?.off('nowplaying', onNowPlaying)
                }
              }
            }

            connection.on('nowplaying', onNowPlaying)
          } else {
            await interaction.reply({
              content: 'Not playing 😿',
              ephemeral: true,
            })
          }
        }
      } else {
        console.error(`No connection for channel ${voice.id} 🙄`)
      }
    } else {
      if (interaction.isRepliable()) {
        await interaction.reply({
          content: 'Must be in a voice channel to use this command 😤',
          ephemeral: true,
        })
      }
    }
  },
} satisfies CommandInfo
