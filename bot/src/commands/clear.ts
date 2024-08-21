import { SlashCommandBuilder } from 'discord.js'
import type { CommandInfo } from '~/bot/types/types.js'

export default {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clears all queued tracks'),
  async execute(interaction): Promise<void> {
    if (interaction.isRepliable()) {
      await interaction.reply('TODO: clear')
    }
  },
} satisfies CommandInfo
