/**
 * Checks if the value is contained in the array looking by a property in the array.
 * @param {number|string} findValue
 * @param {array} searchArray
 * @param {string} propertyName
 * @returns {boolean|null}
 */
export function hasPropertyValueInArray (findValue, searchArray, propertyName) {
  if (!findValue || !searchArray || !propertyName) {
    return null
  }

  return searchArray.find(element => element[propertyName] === findValue) !== undefined
}

/**
 * Returns an array with the values that matches another array by a property.
 * @param {array} arrayA // TODO: rename param
 * @param {array} arrayB // TODO: rename param
 * @param {string} propertyName
 * @returns {array}
 */
export function arrayIncludesArrayByProperty (arrayA, arrayB, propertyName) {
  if (!arrayA || !arrayB || !propertyName) {
    return null
  }

  return arrayA.filter(rawValue =>
    arrayB.find(element => element[propertyName] === rawValue) !== undefined
  )
}
