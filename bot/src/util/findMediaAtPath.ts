import type { PathLike } from 'node:fs'
import type { MediaInfo } from '~/bot/types/types.js'
import { parseFile } from 'music-metadata'

export const findMediaAtPath = (
  path: PathLike,
): Promise<MediaInfo | undefined> => {
  return new Promise((resolve) => {
    parseFile(path.toString())
      // strip `native` and `quality` out of parsed result. note this throws @typescript-eslint/no-unused-vars
      .then(({ native, quality, ...parsed }) =>
        resolve({
          path,
          metadata: parsed,
        }),
      )
      .catch(() => {
        // console.error(err)
        resolve(undefined)
      })
  })
}
