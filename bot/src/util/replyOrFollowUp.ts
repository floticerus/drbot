import {
  Interaction,
  InteractionReplyOptions,
  InteractionResponse,
  Message,
  MessagePayload,
} from 'discord.js'

export const replyOrFollowUp = async (
  interaction: Interaction,
  options: string | MessagePayload | InteractionReplyOptions,
): Promise<InteractionResponse | Message> => {
  if (interaction.isRepliable()) {
    if (interaction.replied || interaction.deferred) {
      return await interaction.followUp(options)
    } else {
      return await interaction.reply(options)
    }
  } else {
    throw new Error('NOT_REPLIABLE')
  }
}
