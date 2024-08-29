import type { InteractionResponse, Message } from 'discord.js'

export type DeleteMessageAfterTimeoutOptions = {
  /** the message we want to delete */
  message: InteractionResponse | Message
  /** timeout duration in milliseconds */
  duration?: number
  /** callback for when a message is successfully deleted */
  onDeleted?: () => void
  /** callback for when there is an error deleting a message */
  onError?: (err: Error) => void
}

export type DeleteMessageAfterTimeoutResponse = {
  /** exposes a way to cancel the deletion timeout */
  readonly cancel: () => void
}

/** deletes a discord message after timeout duration */
export const deleteMessageAfterTimeout = ({
  message,
  // default to 1 minute - note that the discord token lifetime for updating is around 15 minutes
  duration = 1000 * 60,
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
