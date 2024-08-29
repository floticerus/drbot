import { DrBotError } from '~/bot/errors/DrBotError.js'

export class NotRepliableError extends DrBotError {
  constructor(
    message = 'The message cannot be replied to',
    options?: ErrorOptions,
  ) {
    super(message, 'NOT_REPLIABLE', options)
  }
}
