import { SlashCommandBuilder } from 'discord.js'
import type { CommandInfo } from '~/bot/types/types.js'
import {
  deleteMessageAfterTimeout,
  getDisplayStringForMedia,
  getVoiceChannelForInteraction,
} from '~/bot/util/index.js'
import redisClient from '~/bot/db/index.js'
import { isMediaInfoStored } from '~/bot/types/predicates.js'
import { VoiceAdapter } from '~/bot/discord/VoiceAdapter.js'
import { connections } from '~/bot/discord/voice.js'

export default {
  data: new SlashCommandBuilder()
    .setName('playall')
    .setDescription('Plays all tracks returned by a search query')
    .addStringOption((option) =>
      option
        .setName('query')
        .setDescription('Search query used to find tracks to play')
        .setMinLength(1),
    ),
  // TODO this interaction should be combined with /query and /play, probably with a call in VoiceAdapter
  async execute(interaction): Promise<void> {
    if (interaction.isRepliable() && interaction.isChatInputCommand()) {
      const voiceChannel = await getVoiceChannelForInteraction(interaction)

      if (voiceChannel) {
        if (voiceChannel.joinable) {
          try {
            const query = interaction.options.getString('query')
            const { documents } = await redisClient.ft.search(
              'idx:media',
              query,
              // redis seems to have a maximum of 10000. maybe it's adjustable, and this should be a var.
              { LIMIT: { from: 0, size: 10000 } },
            )

            if (documents && documents.length !== 0) {
              const lines: Array<string> = []

              for (const result of documents) {
                if (isMediaInfoStored(result.value)) {
                  const { status, index } = await VoiceAdapter.playOnChannel(
                    voiceChannel,
                    result.value,
                  )

                  switch (status) {
                    case 'queued':
                      lines.push(
                        `**Queued**: ${getDisplayStringForMedia(connections[voiceChannel.id].queue[index])}`,
                      )
                      break
                    case 'played':
                      lines.push(
                        `**Playing**: ${getDisplayStringForMedia(result.value)}`,
                      )
                      break
                    default:
                      console.error(
                        'VoiceAdapter.playOnChannel() responded with invalid status:',
                        status,
                      )
                      break
                  }
                } else {
                  lines.push('Invalid MediaInfo response 🤯')
                }
              }

              // don't delete this message?
              await interaction.reply(
                `${lines.join('\n').substring(0, 420)}...`,
              )
            } else {
              // don't use an ephemeral reply here - it might be nice for everyone to see what didn't work
              deleteMessageAfterTimeout({
                message: await interaction.reply(
                  `No results for query: **${query}**`,
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
