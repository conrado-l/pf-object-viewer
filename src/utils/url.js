/**
 * Generates a URL query based on the object properties
 * Example: {value: 1, name: 'George'} --> '?value=1&name=George'
 * @param {object} paramsObject
 */
export function generateURLQueryFromObject (paramsObject) {
  const query = new URLSearchParams(paramsObject).toString()
  return `?${query}`
}
