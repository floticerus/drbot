import { InteractionResponse, SlashCommandBuilder } from 'discord.js'
import type { CommandInfo } from '~/bot/types/types.js'
import { connections } from '~/bot/discord/voice.js'
import {
  deleteMessageAfterTimeout,
  getVoiceChannelForInteraction,
} from '~/bot/util/index.js'

export default {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses playback'),
  async execute(interaction): Promise<void> {
    const voice = await getVoiceChannelForInteraction(interaction)
    let response: InteractionResponse | undefined = undefined

    if (voice) {
      const connection = connections[voice.id]

      if (connection) {
        connection.pause()

        if (interaction.isRepliable()) {
          response = await interaction.reply('Paused playback 🙊')
        }
      } else {
        if (interaction.isRepliable()) {
          response = await interaction.reply({
            content: 'Not in voice channel',
            ephemeral: true,
          })
        }
        console.error(`No connection for channel ${voice.id}`)
      }
    } else {
      if (interaction.isRepliable()) {
        response = await interaction.reply({
          content: 'Must be in a voice channel to use this command 😒',
          ephemeral: true,
        })
      }
    }

    if (response) {
      deleteMessageAfterTimeout({ message: response })
    }
  },
} satisfies CommandInfo
