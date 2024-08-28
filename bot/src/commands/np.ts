import { SlashCommandBuilder } from 'discord.js'
import type { CommandInfo } from '~/bot/types/types.js'
import { connections } from '~/bot/discord/voice.js'
import {
  deleteMessageAfterTimeout,
  getVoiceChannelForInteraction,
} from '~/bot/util/index.js'

export default {
  data: new SlashCommandBuilder()
    .setName('np')
    .setDescription('(n)ow (p)laying: Displays the currently playing track'),
  async execute(interaction): Promise<void> {
    const voice = await getVoiceChannelForInteraction(interaction)

    if (voice) {
      if (connections[voice.id]) {
        await connections[voice.id].displayNowPlayingReply(interaction)
      } else {
        console.error(`No connection for channel ${voice.id} 🙄`)
      }
    } else {
      if (interaction.isRepliable()) {
        deleteMessageAfterTimeout({
          message: await interaction.reply({
            content: 'Must be in a voice channel to use this command 😤',
            ephemeral: true,
          }),
        })
      }
    }
  },
} satisfies CommandInfo
