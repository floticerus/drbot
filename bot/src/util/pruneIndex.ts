import { access } from 'node:fs/promises'
import redisClient from '~/bot/db/index.js'
import { scanMediaQueue } from '~/bot/queues/index.js'
import { events } from '~/bot/events/index.js'

/**
 * removes entries from db if we no longer have access
 */
export const pruneIndex = async () => {
  events.emit('index:prune:start')

  const startTime = Date.now()

  const { documents } = await redisClient.ft.search('idx:media', '*', {
    // only return the attribute we need
    RETURN: ['path'],
  })

  const query = redisClient.multi()
  let numDeleted = 0

  await Promise.all(
    documents.map(async ({ id, value: { path } }) => {
      await scanMediaQueue.add(async () => {
        let hasAccess: boolean
        try {
          await access(path.toString())
          hasAccess = true
        } catch (_err) {
          hasAccess = false
        }
        if (!hasAccess) {
          query.del(id)
          // this doesn't -really- work to keep track of num deleted,
          // but should usually.
          // TODO process replies for actual result?
          numDeleted++
        }
      })
    }),
  )

  if (numDeleted !== 0) {
    await query.exec()
  }

  const endTime = Date.now()

  events.emit('index:prune:complete', {
    duration: endTime - startTime,
    endTime,
    numDeleted,
  })
}
