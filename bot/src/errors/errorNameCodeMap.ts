import type { DrBotErrorName } from '~/bot/types/error.types.js'

/** error codes start at 30000 for no reason at all */
export const errorNameCodeMap: Readonly<Record<DrBotErrorName, number>> = {
  UNKNOWN: 30000,
  NOT_REPLIABLE: 30001,
  VOICE_CONNECTION_EXISTS: 30002,
}
