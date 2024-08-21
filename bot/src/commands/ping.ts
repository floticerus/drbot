import { SlashCommandBuilder } from 'discord.js'
import type { CommandInfo } from '~/bot/types/types.js'

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(interaction): Promise<void> {
    if (interaction.isRepliable()) {
      await interaction.reply('Pong :)')
    }
  },
} satisfies CommandInfo
