import events from './events.js'
// import type { MediaInfoStored } from '~/bot/types/types.js'
import discordClient from '~/bot/discord/client.js'
import { ActivityType } from 'discord-api-types/v10'

events.on('media:nowplaying', (/* { media }: { media: MediaInfoStored } */) => {
  discordClient.user.setActivity('music', { type: ActivityType.Listening })
})

events.on('media:stop', () => {
  discordClient.user.setActivity('')
})
