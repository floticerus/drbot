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
  duration = 10000,
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
