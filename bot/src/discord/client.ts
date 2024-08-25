import { Client } from 'discord.js'
import { GatewayIntentBits } from 'discord-api-types/v10'
import { events } from '~/bot/events/index.js'
import * as _commands from '~/bot/commands/index.js'
import { replyOrFollowUp } from '~/bot/util/index.js'

const commands = Object.values(_commands)

const client = new Client({
  // this should get all intents. old examples show a cleaner way of
  // getting all intents, but that doesn't seem to exist anymore.
  // intents: Object.values(GatewayIntentBits) as GatewayIntentBits[],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    // GatewayIntentBits.GuildMembers,
    // GatewayIntentBits.GuildPresences,
  ],
})

client.on('ready', () => {
  events.emit('discord:ready')
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  const command = commands.find(
    ({ data: { name } }) => name === interaction.commandName,
  )

  if (!command) {
    console.error(`No command matching "${interaction.commandName}" found`)
    return
  }

  try {
    await command.execute(interaction)
  } catch (err) {
    console.error(err)
    await replyOrFollowUp(interaction, {
      content: 'There was an error while executing this command!',
      ephemeral: true,
    })
  }
})

client.login(process.env.DISCORD_TOKEN).catch(console.error)

export default client
