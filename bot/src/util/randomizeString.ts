export type RandomizeStringOptions = {
  randomCharacters?: string
  randomizeCharactersChance?: number
}

export const randomizeString = (
  inString: string,
  {
    randomCharacters = 'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789 !@#$%^&*()_+,./;\'[]\\<>?:"~`',
    randomizeCharactersChance = 0.5,
  }: RandomizeStringOptions = {},
) => {
  return inString
    .split('')
    .map((char) =>
      Math.random() <= randomizeCharactersChance
        ? randomCharacters[Math.floor(Math.random() * randomCharacters.length)]
        : char,
    )
    .join('')
}
