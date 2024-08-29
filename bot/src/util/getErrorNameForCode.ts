import { errorNameCodeMap } from '~/bot/errors/index.js'
import type { DrBotErrorName } from '~/bot/types/error.types.js'

// create a reverse lookup record, so we're not looping so much.
// each error name has a unique code value, so we can do this.
const reverseLookup: Readonly<Record<number, DrBotErrorName>> = Object.keys(
  errorNameCodeMap,
).reduce(
  (previousValue, currentValue) => ({
    ...previousValue,
    // this is what reverses the error code map object
    [errorNameCodeMap[currentValue]]: currentValue,
  }),
  {},
)

/**
 *
 * @param code
 */
export const getErrorNameForCode = (code: number): DrBotErrorName => {
  // default to UNKNOWN
  return reverseLookup[code] ?? 'UNKNOWN'
}
