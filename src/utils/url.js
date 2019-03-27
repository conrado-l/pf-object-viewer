/**
 * Generates a URL query based on the object properties
 * Example: {value: 1, name: 'George'} --> '?value=1&name=George'
 * @param {object} paramsObject
 */
import { hasCommaDelimitator } from '@/utils/strings'

export function generateURLQueryFromObject (paramsObject) {
  const query = new URLSearchParams(paramsObject).toString()
  return `?${query}`
}

/**
 * Returns an object in which every property with multiple values separated by a comma, become a split array.
 * @param {object} query
 * @returns {object}
 */
export function parseRouteQuery (query) {
  if (!query || !Object.keys(query).length) {
    return {}
  }

  let parsedQuery = {}

  Object.keys(query).forEach((key) => { // Object.Keys already checks for hasOwnProperty
    const value = query[key]

    if (value) {
      parsedQuery[key] = hasCommaDelimitator(value) ? value.split(',') : value // TODO: case "search=text,"
    }
  })

  return parsedQuery
}
