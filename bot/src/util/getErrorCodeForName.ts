import type { DrBotErrorName } from '~/bot/types/error.types.js'
import { errorNameCodeMap } from '~/bot/errors/index.js'

export const getErrorCodeForName = (name: DrBotErrorName) => {
  const code = errorNameCodeMap[name ?? 'UNKNOWN']
  return typeof code === 'number' ? code : errorNameCodeMap.UNKNOWN
}
