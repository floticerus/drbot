import { watch } from 'chokidar'
import redisClient from '~/bot/db/index.js'
import { findMediaAtPath } from '~/bot/util/findMediaAtPath.js'
import { basename } from 'node:path'

export const watchForMedia = async () => {
  // TODO we might need to batch these and run all with multi
  const updateMediaAtPath = async (path: string) => {
    const media = await findMediaAtPath(path)

    if (media) {
      const {
        path: _path,
        metadata: {
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
        },
      } = media

      const key = `media:${path}`

      const query = redisClient.multi()
      query.hSet(key, 'path', path)
      query.hSet(key, 'filename', basename(path))

      album && query.hSet(key, 'album', album)
      albumartist && query.hSet(key, 'albumartist', albumartist)
      artist && query.hSet(key, 'artist', artist)
      duration && query.hSet(key, 'duration', Number(duration))
      genre && query.hSet(key, 'genre', JSON.stringify(genre))
      title && query.hSet(key, 'title', title)
      track !== undefined && query.hSet(key, 'track', Number(track))
      year && query.hSet(key, 'year', Number(year))

      await query.exec()

      console.log(`Updated media at ${path}`)
    }
  }

  watch(process.env.MEDIA_PATH, { ignoreInitial: true })
    //
    .on('add', (path) =>
      updateMediaAtPath(path).catch((err) => console.error(err)),
    )
    //
    .on('change', (path) =>
      updateMediaAtPath(path).catch((err) => console.error(err)),
    )
    //
    .on('unlink', async (path) => {
      try {
        // console.log(`File removed: ${path}`)
        await redisClient.del(`media:${path}`)
        // console.log(`Removed from index: ${path}`)
      } catch (err) {
        console.error(err)
      }
    })
}
