/* eslint-disable @typescript-eslint/no-explicit-any */

import type { MediaInfoStored } from '~/bot/types/types.js'

export function isMediaInfoStored(obj: any): obj is MediaInfoStored {
  return obj ? obj.path && obj.filename : false
}
