import type { DrBotErrorName } from '~/bot/types/error.types.js'
import { getErrorCodeForName } from '~/bot/util/getErrorCodeForName.js'

export class DrBotError extends Error {
  constructor(
    message: string,
    name: DrBotErrorName = 'UNKNOWN',
    options?: ErrorOptions,
  ) {
    super(message, options)

    this.name = name
    this.code = getErrorCodeForName(name)
  }

  public readonly name: DrBotErrorName
  public readonly code: number
}
