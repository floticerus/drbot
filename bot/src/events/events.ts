import { EventEmitter } from 'node:events'

const events = new EventEmitter()
events.setMaxListeners(1000)

export default events
