import { SlashCommandBuilder } from 'discord.js'
import type { CommandInfo } from '~/bot/types/types.js'
import { connections } from '~/bot/discord/voice.js'
import { getVoiceChannelForInteraction, pluralize } from '~/bot/util/index.js'
import { getDisplayStringForMedia } from '~/bot/util/getDisplayStringForMedia.js'
import formatDuration from 'format-duration'

export default {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Displays the queue'),
  async execute(interaction): Promise<void> {
    if (interaction.isRepliable()) {
      const voice = await getVoiceChannelForInteraction(interaction)

      if (voice) {
        const connection = connections[voice.id]

        if (connection) {
          await interaction.reply(
            `**Queue**: ${connection.queue.length} ${pluralize(connection.queue.length, 'track', 'tracks')}} [${formatDuration(
              connection.queue.reduce((previousValue, currentValue) => {
                return previousValue + Number(currentValue.duration)
              }, 0) * 1000,
            )}]\r\n` +
              connection.queue
                .filter((_, index) => index < 10)
                .map(
                  (media, index, array) =>
                    `- ${getDisplayStringForMedia(media)}${index < array.length - 1 ? '\r\n' : ''}`,
                )
                .join(''),
          )
        } else {
          await interaction.reply({
            content: 'Not in voice channel',
            ephemeral: true,
          })
        }
      } else {
        if (interaction.isRepliable()) {
          await interaction.reply({
            content: 'Must be in a voice channel to use this command 😒',
            ephemeral: true,
          })
        }
      }
    }
  },
} satisfies CommandInfo
