import { SlashCommandBuilder } from 'discord.js'
import type { CommandInfo } from '~/bot/types/types.js'

export default {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('Searches library with a given query')
    .addStringOption((option) =>
      option
        .setName('query')
        .setDescription('Search query used to find tracks')
        .setMinLength(1),
    ),
  async execute(interaction): Promise<void> {
    if (interaction.isRepliable()) {
      await interaction.reply('TODO: search')
    }
  },
} satisfies CommandInfo
