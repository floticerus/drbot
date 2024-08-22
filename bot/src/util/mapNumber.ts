// https://stackoverflow.com/a/23202637
export const mapNumber = (
  number: number,
  inMin: number,
  inMax: number,
  outMin = 0,
  outMax = 1,
): number => {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}
