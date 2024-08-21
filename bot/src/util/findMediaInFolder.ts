import type { PathLike } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { join as joinPath } from 'node:path'
import { parseFile } from 'music-metadata'
import type { MediaInfo } from '~/bot/types/types.js'
import { scanMediaQueue } from '~/bot/queues/index.js'

export type FindMediaInFolderOptions = {
  path: PathLike
}

export const findMediaInFolder = async ({
  path,
}: FindMediaInFolderOptions): Promise<ReadonlyArray<MediaInfo>> => {
  return (
    await Promise.all(
      (
        await readdir(path, {
          withFileTypes: true,
          recursive: true,
        })
      ).map((file) =>
        file.isFile() || file.isSymbolicLink()
          ? scanMediaQueue.add(async () => {
              return new Promise<MediaInfo | undefined>((resolve) => {
                parseFile(joinPath(file.path, file.name))
                  // strip `native` and `quality` out of parsed result. note this throws @typescript-eslint/no-unused-vars
                  .then(({ native, quality, ...parsed }) =>
                    resolve({
                      ...parsed,
                      path: joinPath(file.path, file.name),
                      metadata: parsed,
                    }),
                  )
                  .catch(() => {
                    // console.error(err)
                    resolve(undefined)
                  })
              })
            })
          : Promise.resolve(undefined),
      ),
    )
  ).filter((result) => !!result)
}
