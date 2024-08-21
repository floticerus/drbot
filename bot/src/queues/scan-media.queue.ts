import PQueue from 'p-queue'

export const scanMediaQueue = new PQueue({
  concurrency: Number(process.env.SCAN_MEDIA_CONCURRENCY ?? 100),
})
