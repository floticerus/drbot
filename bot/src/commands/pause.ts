import { SlashCommandBuilder } from 'discord.js'
import type { CommandInfo } from '~/bot/types/types.js'
import { connections } from '~/bot/discord/voice.js'
import { getVoiceChannelForInteraction } from '~/bot/util/index.js'

export default {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses playback'),
  async execute(interaction): Promise<void> {
    const voice = await getVoiceChannelForInteraction(interaction)

    if (voice) {
      const connection = connections[voice.id]

      if (connection) {
        connection.pause()

        if (interaction.isRepliable()) {
          await interaction.reply('Paused playback 🙊')
        }
      } else {
        if (interaction.isRepliable()) {
          await interaction.reply('Not in voice channel')
        }
        console.error(`No connection for channel ${voice.id}`)
      }
    } else {
      if (interaction.isRepliable()) {
        await interaction.reply(
          'Must be in a voice channel to use this command 😒',
        )
      }
    }
  },
} satisfies CommandInfo
