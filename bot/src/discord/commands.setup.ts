import { REST, Routes } from 'discord.js'
import * as _commands from '~/bot/commands/index.js'

const commands = Object.values(_commands)

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN)

;(async () => {
  try {
    const commandsToRegister = commands.map(({ data }) => data.toJSON())

    console.log(
      'Refreshing application (/) commands:',
      JSON.stringify(commandsToRegister, null, 2),
    )

    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID),
      {
        body: commandsToRegister,
      },
    )

    console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.error(error)
  }
})()
