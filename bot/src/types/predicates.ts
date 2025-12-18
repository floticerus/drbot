/** biome-ignore-all lint/suspicious/noExplicitAny: any is the easiest way to use predicate functions */

import type { MediaInfoStored } from '~/bot/types/types.js'

export function isMediaInfoStored(obj: any): obj is MediaInfoStored {
  return obj ? obj.path && obj.filename : false
}
