import { SlashCommandBuilder } from 'discord.js'
import type { CommandInfo } from '~/bot/types/types.js'
import { buildIndex, replyOrFollowUp } from '~/bot/util/index.js'

export default {
  data: new SlashCommandBuilder()
    .setName('scan')
    .setDescription('Scans the media library for new files'),
  async execute(interaction): Promise<void> {
    const startTime = Date.now()

    if (interaction.isRepliable()) {
      await replyOrFollowUp(interaction, 'Scanning library... hang on 📚')
    }

    await buildIndex()

    if (interaction.isRepliable()) {
      await replyOrFollowUp(
        interaction,
        `Finished scanning library in **${(Date.now() - startTime) / 1000} seconds** 🎉`,
      )
    }
  },
} satisfies CommandInfo
