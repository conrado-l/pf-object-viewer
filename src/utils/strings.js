/**
 * Checks if the string has comma delimitators.
 * @param {string} string String to be parsed
 */
export function hasCommaDelimitator (string) {
  if (typeof string === 'string' || string instanceof String) {
    return string.indexOf(',') !== -1
  } else {
    return false
  }
}
