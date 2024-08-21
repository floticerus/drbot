// import discordClient from '~/bot//discord/client.js'
import type { Interaction, VoiceBasedChannel } from 'discord.js'

export const getVoiceChannelForInteraction = async (
  interaction: Interaction,
): Promise<VoiceBasedChannel | undefined> => {
  const { default: discordClient } = await import('~/bot/discord/client.js')
  const guild = discordClient.guilds.cache.get(interaction.guildId)
  const member = guild.members.cache.get(interaction.member.user.id)
  return member.voice.channel
}
