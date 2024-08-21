import { SlashCommandBuilder } from 'discord.js'
import type { CommandInfo } from '~/bot/types/types.js'

export default {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Responds with stats about the bot'),
  async execute(interaction): Promise<void> {
    if (interaction.isRepliable()) {
      await interaction.reply('TODO: stats')
    }
  },
} satisfies CommandInfo
