/**
 * Abstract API call handling
 */

/**
 * Sends a GET request
 * @param {string} url
 * @param {object} params
 * @returns {Promise<any>}
 */
export function get (url, params) {
  return window.axios.get(url, { params: { ...params } })
}

/**
 * Sends a POST request with the proper params
 * @param {string} url
 * @param {object} params
 * @returns {Promise<any>}
 */
export function post (url, params) {
  return window.axios.post(url, params)
}

export default {
  get,
  post
}
