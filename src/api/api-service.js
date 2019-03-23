/**
 * Abstract API call handling
 */

const HTTPService = window.axios // Can be easily replaced in the future

/**
 * Sends a GET request
 * @param {string} url
 * @returns {Promise<any>}
 */
export function get (url) {
  return window.axios.get(url)
}

/**
 * Sends a POST request with the proper params
 * @param {string} url
 * @param {object} params
 * @returns {Promise<any>}
 */
export function post (url, params) {
  return HTTPService.get(url, params)
}