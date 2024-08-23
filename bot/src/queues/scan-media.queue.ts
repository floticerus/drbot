import PQueue from 'p-queue'

export const scanMediaQueue = new PQueue({
  concurrency: Number(process.env.DISK_ACCESS_CONCURRENCY ?? 50),
})
