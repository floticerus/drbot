import { basename } from 'node:path'
import { default as redisClient } from '~/bot/db/index.js'
import { events } from '~/bot/events/index.js'
import type { Dirent } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { parseFile } from 'music-metadata'
import { join as joinPath } from 'path'
import PQueue from 'p-queue'

const queue = new PQueue({
  concurrency: Number(process.env.SCAN_MEDIA_CONCURRENCY ?? 100),
})

export const buildIndex = async (): Promise<void> => {
  events.emit('index:start')

  const startTime = Date.now()

  const query = redisClient.multi()
  let numResults = 0

  const files: Dirent[] = await readdir(process.env.MEDIA_PATH, {
    withFileTypes: true,
    recursive: true,
  })

  await Promise.all(
    files.map((file) =>
      file.isFile() || file.isSymbolicLink()
        ? new Promise((resolve) => {
            queue.add(async () => {
              const path = joinPath(file.path, file.name)
              return parseFile(path)
                .then(
                  ({
                    format: { duration },
                    common: {
                      album,
                      albumartist,
                      artist,
                      genre,
                      title,
                      track: { no: track },
                      year,
                    },
                  }) => {
                    const key = `media:${path}`

                    query.hSet(key, 'path', path)
                    query.hSet(key, 'filename', basename(path))

                    album && query.hSet(key, 'album', album)
                    albumartist && query.hSet(key, 'albumartist', albumartist)
                    artist && query.hSet(key, 'artist', artist)
                    duration && query.hSet(key, 'duration', Number(duration))
                    genre && query.hSet(key, 'genre', JSON.stringify(genre))
                    title && query.hSet(key, 'title', title)
                    track !== undefined &&
                      query.hSet(key, 'track', Number(track))
                    year && query.hSet(key, 'year', Number(year))

                    numResults++
                    resolve(undefined)
                  },
                )
                .catch(() => {
                  // fail silently - it most likely means the file wasn't an audio file.
                  // we could check the error if we really wanted to.
                  // console.error(err)
                  resolve(undefined)
                })
            })
          })
        : Promise.resolve(undefined),
    ),
  )

  await query.exec()

  events.emit('index:complete', {
    duration: Date.now() - startTime,
    numResults,
  })
}
