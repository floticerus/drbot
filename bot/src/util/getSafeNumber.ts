export const getSafeNumber = (value: number, defaultValue = 0): number => {
  const maybeNumber = Number(value ?? defaultValue)
  return !isNaN(maybeNumber) && isFinite(maybeNumber)
    ? maybeNumber
    : defaultValue
}
