/**
 * Generates a URL queries based on the object properties
 * Example: Input {value: 1, name: 'George'} --> Output '?value=1&name=George'
 * @param {object} paramsObject
 */
export function generateURLQueryFromObject (paramsObject) {
  const query = new URLSearchParams(paramsObject).toString()
  return `?${query}`
}
