import { DrBotError } from '~/bot/errors/DrBotError.js'

export class VoiceConnectionExistsError extends DrBotError {
  constructor(
    message = 'Voice connection already exists',
    options?: ErrorOptions,
  ) {
    super(message, 'VOICE_CONNECTION_EXISTS', options)
  }
}
