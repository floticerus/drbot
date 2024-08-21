import type { Dirent, PathLike } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { join as joinPath } from 'node:path'
import { parseFile } from 'music-metadata'
import type { MediaInfo } from '~/bot/types/types.js'

export type FindMediaInFolderOptions = {
  path: PathLike
}

export const findMediaInFolder = async ({
  path,
}: FindMediaInFolderOptions): Promise<ReadonlyArray<MediaInfo>> => {
  const files: Dirent[] = await readdir(path, {
    withFileTypes: true,
    recursive: true,
  })

  // NOTE we might need to process this in chunks on very large libraries
  const metadatas = await Promise.all(
    files.map((file) =>
      file.isFile() || file.isSymbolicLink()
        ? new Promise((resolve) => {
            parseFile(joinPath(file.path, file.name))
              // strip `native` and `quality` out of parsed result. note this throws @typescript-eslint/no-unused-vars
              .then(({ native, quality, ...parsed }) => resolve(parsed))
              .catch(() => {
                // console.error(err)
                resolve(undefined)
              })
          })
        : Promise.resolve(undefined),
    ),
  )

  return files
    .map((file, index) => ({
      path: joinPath(file.path, file.name),
      metadata: metadatas[index],
    }))
    .filter(({ metadata }) => !!metadata)
}
