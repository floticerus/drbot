import { InteractionResponse, SlashCommandBuilder } from 'discord.js'
import type { CommandInfo } from '~/bot/types/types.js'
import { connections } from '~/bot/discord/voice.js'
import {
  deleteMessageAfterTimeout,
  getVoiceChannelForInteraction,
} from '~/bot/util/index.js'
import { getDisplayStringForMedia } from '~/bot/util/getDisplayStringForMedia.js'

export default {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips the currently playing track'),
  async execute(interaction): Promise<void> {
    const voice = await getVoiceChannelForInteraction(interaction)
    let response: InteractionResponse | undefined = undefined

    if (voice) {
      const connection = connections[voice.id]

      if (connection) {
        if (interaction.isRepliable()) {
          if (connection.nowPlaying) {
            response = await interaction.reply('Skipping current track... ⏱️')
            await connection.playNextOrStop()
            await response.edit(
              `**Now Playing**: ${getDisplayStringForMedia(connection.nowPlaying)}`,
            )
          } else {
            response = await interaction.reply({
              content: 'Not playing 🙄',
              ephemeral: true,
            })
          }
        }
      } else {
        if (interaction.isRepliable()) {
          response = await interaction.reply({
            content: 'Not in voice channel',
            ephemeral: true,
          })
        }
      }
    } else {
      if (interaction.isRepliable()) {
        response = await interaction.reply({
          content: 'Must be in a voice channel to use this command 😓',
          ephemeral: true,
        })
      }
    }

    if (response) {
      deleteMessageAfterTimeout({ message: response })
    }
  },
} satisfies CommandInfo
