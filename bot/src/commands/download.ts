import { MessageFlags, SlashCommandBuilder } from 'discord.js'
import { connections } from '~/bot/discord/voice.js'
import type { CommandInfo } from '~/bot/types/types.js'
import {
  deleteMessageAfterTimeout,
  getVoiceChannelForInteraction,
} from '~/bot/util/index.js'

export default {
  data: new SlashCommandBuilder()
    .setName('download')
    .setDescription('Attaches the currently playing track to the chat'),
  async execute(interaction): Promise<void> {
    if (interaction.isRepliable()) {
      const voice = await getVoiceChannelForInteraction(interaction)

      if (voice) {
        if (connections[voice.id]) {
          await connections[voice.id].download(interaction)
        } else {
          console.error(`No connection for channel ${voice.id} 🙄`)
        }
      } else {
        deleteMessageAfterTimeout({
          message: await interaction.reply({
            content: 'Must be in a voice channel to use this command 😤',
            flags: MessageFlags.Ephemeral,
          }),
        })
      }
    }
  },
} satisfies CommandInfo
