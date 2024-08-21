import type {
  Interaction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from 'discord.js'
import type { PathLike } from 'node:fs'
import type { IAudioMetadata } from 'music-metadata'

export type CommandCallback = (interaction: Interaction) => Promise<void>

export type CommandInfo = {
  readonly data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder
  readonly execute: CommandCallback
}

export type MediaInfo = {
  readonly path: PathLike
  readonly metadata: Omit<IAudioMetadata, 'native' | 'quality'>
}

export type MediaInfoStored = {
  readonly path: string
  readonly filename: string
  readonly album?: string
  readonly albumArtist?: string
  readonly artist?: string
  readonly duration?: number
  readonly genre?: ReadonlyArray<string>
  readonly title?: string
  readonly year?: number
}
