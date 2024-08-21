import {
  Interaction,
  InteractionReplyOptions,
  MessagePayload,
} from 'discord.js'

export const replyOrFollowUp = async (
  interaction: Interaction,
  options: string | MessagePayload | InteractionReplyOptions,
) => {
  if (interaction.isRepliable()) {
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(options)
    } else {
      await interaction.reply(options)
    }
  } else {
    throw new Error('NOT_REPLIABLE')
  }
}
