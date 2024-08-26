import type { InteractionResponse, Message } from 'discord.js'

export type DeleteMessageAfterTimeoutOptions = {
  message: InteractionResponse | Message
  duration?: number
  onDeleted?: () => void
  onError?: (err: Error) => void
}

export type DeleteMessageAfterTimeoutResponse = {
  readonly cancel: () => void
}

export const deleteMessageAfterTimeout = ({
  message,
  // default to 10 minutes - less than the usual discord token lifetime
  duration = 1000 * 60 * 10,
  onDeleted,
  onError = console.error,
}: DeleteMessageAfterTimeoutOptions): DeleteMessageAfterTimeoutResponse => {
  const timeout = setTimeout(() => {
    message
      .delete()
      .then(() => onDeleted && onDeleted())
      .catch(onError)
  }, duration)

  return {
    cancel: () => clearTimeout(timeout),
  }
}
