export const shuffleInPlace = <ArrayType = unknown>(input: ArrayType[]) => {
  // Here's a JavaScript implementation of the Durstenfeld shuffle, an optimized version of Fisher-Yates
  // https://stackoverflow.com/a/12646864
  for (let i = input.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[input[i], input[j]] = [input[j], input[i]]
  }

  return input
}
