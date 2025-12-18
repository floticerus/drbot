import { MessageFlags, SlashCommandBuilder } from 'discord.js'
import type { CommandInfo } from '~/bot/types/types.js'
import { connections } from '~/bot/discord/voice.js'
import {
  deleteMessageAfterTimeout,
  getVoiceChannelForInteraction,
} from '~/bot/util/index.js'

export default {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips the currently playing track'),
  async execute(interaction): Promise<void> {
    const voice = await getVoiceChannelForInteraction(interaction)
    if (voice) {
      const connection = connections[voice.id]

      if (connection) {
        if (interaction.isRepliable()) {
          if (connection.nowPlaying) {
            // play the next track, or stop
            await connection.playNextOrStop()
            // display new message
            await connection.displayNowPlayingReply(interaction)
          } else {
            deleteMessageAfterTimeout({
              message: await interaction.reply({
                content: 'Not playing 🙄',
                flags: MessageFlags.Ephemeral,
              }),
            })
          }
        }
      } else {
        if (interaction.isRepliable()) {
          deleteMessageAfterTimeout({
            message: await interaction.reply({
              content: 'Not in voice channel',
              flags: MessageFlags.Ephemeral,
            }),
          })
        }
      }
    } else {
      if (interaction.isRepliable()) {
        deleteMessageAfterTimeout({
          message: await interaction.reply({
            content: 'Must be in a voice channel to use this command 😓',
            flags: MessageFlags.Ephemeral,
          }),
        })
      }
    }
  },
} satisfies CommandInfo
