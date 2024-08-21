import 'dotenv/config'
import 'web-streams-polyfill/polyfill'
import '~/bot/discord/commands.setup.js'
import '~/bot/discord/client.js'
import { buildIndex, watchForMedia } from '~/bot/util/index.js'
import { boolean } from 'boolean'

const startupFunctions: Array<Promise<unknown>> = []

// full rebuild of media db - default to true
if (boolean(process.env.SCAN_MEDIA_ON_START ?? true)) {
  startupFunctions.push(buildIndex())
}

// watch for changes in media path - default to true
if (boolean(process.env.WATCH_MEDIA ?? true)) {
  startupFunctions.push(watchForMedia())
}

await Promise.all(startupFunctions)
