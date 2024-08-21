import { SlashCommandBuilder } from 'discord.js'
import type { CommandInfo } from '~/bot/types/types.js'

export default {
  data: new SlashCommandBuilder()
    .setName('playall')
    .setDescription('Plays all tracks returned by a search query'),
  async execute(interaction): Promise<void> {
    if (interaction.isRepliable()) {
      await interaction.reply('TODO: playall - or not?')
    }
  },
} satisfies CommandInfo
