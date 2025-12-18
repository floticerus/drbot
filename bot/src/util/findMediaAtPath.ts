import type { PathLike } from 'node:fs'
import { basename } from 'node:path'
import mime from 'mime/lite'
import { parseFile } from 'music-metadata'
import type { MediaInfo } from '~/bot/types/types.js'

export const findMediaAtPath = (
  path: PathLike,
): Promise<MediaInfo | undefined> => {
  return new Promise((resolve) => {
    const pathString = path.toString()
    if (
      !basename(pathString).startsWith('.') &&
      mime.getType(pathString)?.startsWith('audio/')
    ) {
      parseFile(pathString)
        // strip `native` and `quality` out of parsed result. note this throws @typescript-eslint/no-unused-vars
        .then(({ native, quality, ...parsed }) =>
          resolve({
            path,
            metadata: parsed,
          }),
        )
        .catch((err) => {
          console.error(err)
          resolve(undefined)
        })
    } else {
      resolve(undefined)
    }
  })
}
