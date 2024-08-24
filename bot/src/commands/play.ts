import { SlashCommandBuilder } from 'discord.js'
import type { CommandInfo } from '~/bot/types/types.js'
import redisClient from '~/bot/db/index.js'
import { isMediaInfoStored } from '~/bot/types/predicates.js'
import { connections } from '~/bot/discord/voice.js'
import { VoiceConnectionState } from '~/bot/discord/VoiceConnectionState.js'
import {
  getDisplayStringForMedia,
  getVoiceChannelForInteraction,
} from '~/bot/util/index.js'

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays audio in voice chat')
    .addStringOption((option) =>
      option
        .setName('query')
        .setDescription('Search query used to find a file to play')
        .setMinLength(1),
    )
    .addNumberOption((option) =>
      option
        .setName('limit')
        .setDescription('Limits the number of results that will play')
        .setMinValue(1),
    ),
  async execute(interaction): Promise<void> {
    if (interaction.isRepliable() && interaction.isCommand()) {
      console.log(
        `${interaction.user.globalName} (${interaction.user.username}) is attempting to play a song`,
      )

      const voiceChannel = await getVoiceChannelForInteraction(interaction)

      if (voiceChannel) {
        if (voiceChannel.joinable) {
          try {
            // @ts-expect-error options isn't finding getString on type
            const query = interaction.options.getString('query')
            // @ts-expect-error options isn't finding getNumber on type
            const limit = interaction.options.getNumber('limit') ?? 1
            const { documents } = await redisClient.ft.search(
              'idx:media',
              query,
              {
                LIMIT: { from: 0, size: limit },
              },
            )

            if (documents && documents.length !== 0) {
              const lines: Array<string> = []

              for (const result of documents) {
                if (isMediaInfoStored(result.value)) {
                  if (!connections[voiceChannel.id]) {
                    await VoiceConnectionState.fromVoiceChannel(
                      voiceChannel,
                    ).start()
                    connections[voiceChannel.id].play(result.value)
                    lines.push(
                      `**Playing**: ${getDisplayStringForMedia(result.value)}`,
                    )
                  } else {
                    const index = await connections[voiceChannel.id].addToQueue(
                      result.value,
                    )
                    lines.push(
                      `**Queued**: ${getDisplayStringForMedia(connections[voiceChannel.id].queue[index])}`,
                    )
                  }
                } else {
                  lines.push('Invalid MediaInfo response 🤯')
                }
              }

              await interaction.reply(
                `${lines.join('\n').substring(0, 420)}...`,
              )
            } else {
              // don't use an ephemeral reply here - it might be nice for everyone to see what didn't work
              await interaction.reply(`No results for query: **${query}**`)
            }
          } catch (err) {
            console.error(err)
          }
        } else {
          await interaction.reply({
            content: 'Voice channel is not joinable 😒',
            ephemeral: true,
          })
        }
      } else {
        await interaction.reply({
          content: 'Must be in a voice channel to use this command 😱',
          ephemeral: true,
        })
      }
    }
  },
} satisfies CommandInfo
