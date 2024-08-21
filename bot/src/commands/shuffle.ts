import { SlashCommandBuilder } from 'discord.js'
import type { CommandInfo } from '~/bot/types/types.js'
import { connections } from '~/bot/discord/voice.js'
import {
  getVoiceChannelForInteraction,
  mapNumber,
  randomizeString,
} from '~/bot/util/index.js'

const shuffledResponse = 'Shuffled queue'
const shuffleIterations = 4
const shuffleMinDuration = 666
const shuffleRandomizeCharMin = 0
const shuffleRandomizeCharMax = 0.5

export default {
  data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Shuffles the queue'),
  async execute(interaction): Promise<void> {
    const voice = await getVoiceChannelForInteraction(interaction)

    if (voice) {
      const connection = connections[voice.id]

      if (connection) {
        connection.shuffle()

        if (interaction.isRepliable()) {
          const response = await interaction.reply(
            randomizeString(shuffledResponse, {
              randomizeCharactersChance: shuffleRandomizeCharMax,
            }),
          )

          // add a little character... shuffle the response a few times before settling on the final value
          for (let i = 0; i < shuffleIterations; i++) {
            await Promise.all([
              new Promise((done) =>
                setTimeout(done, shuffleMinDuration / shuffleIterations),
              ),
              response.edit(
                i === shuffleIterations - 1
                  ? shuffledResponse
                  : `${randomizeString(shuffledResponse, {
                      randomizeCharactersChance: mapNumber(
                        i / shuffleIterations,
                        0,
                        1,
                        shuffleRandomizeCharMax,
                        shuffleRandomizeCharMin,
                      ),
                    })}${i === shuffleIterations - 2 ? ' 🤪' : ''}`,
              ),
            ])
          }
        }
      } else {
        console.error(`No connection for channel ${voice.id}`)
      }
    } else {
      if (interaction.isRepliable()) {
        await interaction.reply({
          content: 'Must be in a voice channel to use this command',
          ephemeral: true,
        })
      }
    }
  },
} satisfies CommandInfo
