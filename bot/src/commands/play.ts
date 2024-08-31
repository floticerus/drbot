import { SlashCommandBuilder } from 'discord.js'
import type { CommandInfo } from '~/bot/types/types.js'
import redisClient from '~/bot/db/index.js'
import { isMediaInfoStored } from '~/bot/types/predicates.js'
import { VoiceAdapter } from '~/bot/discord/VoiceAdapter.js'
import {
  deleteMessageAfterTimeout,
  getDisplayStringForMedia,
  getVoiceChannelForInteraction,
} from '~/bot/util/index.js'

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays or queues the first track returned in voice chat')
    .addStringOption((option) =>
      option
        .setName('query')
        .setDescription('Search query used to find a track to play')
        .setMinLength(1),
    ),
  // TODO this interaction should be combined with /query and /playall, probably with a call in VoiceAdapter
  async execute(interaction): Promise<void> {
    if (interaction.isRepliable() && interaction.isChatInputCommand()) {
      const voiceChannel = await getVoiceChannelForInteraction(interaction)

      if (voiceChannel) {
        if (voiceChannel.joinable) {
          try {
            const query = interaction.options.getString('query')
            const {
              documents: [result],
            } = await redisClient.ft.search('idx:media', query, {
              LIMIT: { from: 0, size: 1 },
            })

            if (result) {
              if (isMediaInfoStored(result.value)) {
                const { connection, status, index } =
                  await VoiceAdapter.playOnChannel(voiceChannel, result.value)

                switch (status) {
                  case 'queued':
                    deleteMessageAfterTimeout({
                      duration: 1000 * 60 * 10, // 10 minutes
                      message: await interaction.reply(
                        `**Queued**: ${getDisplayStringForMedia(connection.queue[index])}`,
                      ),
                    })

                    break
                  case 'played':
                    await connection.displayNowPlayingReply(interaction)
                    break
                  default:
                    console.error(
                      'VoiceAdapter.playOnChannel() responded with invalid status:',
                      status,
                    )
                    deleteMessageAfterTimeout({
                      message: await interaction.reply({
                        content: 'Server error',
                        ephemeral: true,
                      }),
                    })
                    break
                }
              } else {
                deleteMessageAfterTimeout({
                  message: await interaction.reply({
                    content: 'Invalid MediaInfo response 🤯',
                    ephemeral: true,
                  }),
                })
              }
            } else {
              // don't use an ephemeral reply here - it might be nice for everyone to see what didn't work
              deleteMessageAfterTimeout({
                message: await interaction.reply(
                  `No result for query: **${query}**`,
                ),
              })
            }
          } catch (err) {
            console.error(err)
          }
        } else {
          deleteMessageAfterTimeout({
            message: await interaction.reply({
              content: 'Voice channel is not joinable 😒',
              ephemeral: true,
            }),
          })
        }
      } else {
        deleteMessageAfterTimeout({
          message: await interaction.reply({
            content: 'Must be in a voice channel to use this command 😱',
            ephemeral: true,
          }),
        })
      }
    }
  },
} satisfies CommandInfo
