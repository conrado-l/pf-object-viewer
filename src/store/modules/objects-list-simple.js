import types from './objects-list.mutations'
import { get } from '@/api/api-service'
import loaders from '@/consts/loaders'
import { generateURLQueryFromObject } from '@/utils/url'

// Keep the initial state in case we need to reset the store, when a component destroys for example.
const initialState = () => ({
  objects: [],
  totalPages: 0
})

const state = initialState()

const getters = {
  /**
   * Gets the objects
   * @param state
   * @returns {array}
   */
  getObjects (state) {
    return state.objects
  },
  /**
   * Gets the total pages
   * @param state
   * @returns {number}
   */
  getTotalPages (state) {
    return state.totalPages
  }
}

const mutations = {
  /**
   * Resets the store's state
   * @param state
   */
  reset (state) {
    const init = initialState()
    Object.keys(init).forEach(key => {
      state[key] = init[key]
    })
  },
  /**
   * Sets the objects
   * @param state
   * @param objects
   */
  [types.SET_OBJECTS] (state, objects) {
    state.objects = objects
  },
  /**
   * Sets the total pages for pagination.
   * @param {object} state - Vuex state object.
   * @param {string} totalPages - Total page count.
   */
  [types.SET_TOTAL_PAGES] (state, totalPages) {
    state.totalPages = totalPages ? Number(totalPages) : state.totalPages
  }
}

const actions = {
  /**
   * Fetches the objects
   * @param commit
   * @param dispatch
   * @param getters
   * @param query URL query object
   */
  fetchObjects ({ commit, dispatch }, query) {
    const loaderName = loaders.objectsList.FETCH_OBJECTS

    /* const mockupObjectList = new Promise((resolve => {
      const response = {
        objects: [
          {
            id: 1,
            name: 'Object 1',
            description: 'Im object 1 description!'
          },
          {
            id: 2,
            name: 'Object 2',
            description: 'Im object 2 description!'
          }
        ]
      }
      setTimeout(() => {
        resolve(response)
      }, 500)
    })) */

    return new Promise((resolve, reject) => {
      dispatch('wait/start', loaderName, { root: true })

      const serializedQuery = generateURLQueryFromObject(query)

      const URL = `/objects${serializedQuery}`

      get(URL)
        .then((res) => {
          commit(types.SET_OBJECTS, res.data.objects)
          // commit(types.SET_TOTAL_PAGES, res.data.totalPages)
          resolve()
        })
        .catch((err) => {
          console.error('An error has occured while fetching the objects', err)
          reject(err)
        })
        .finally(() => dispatch('wait/end', loaderName, { root: true }))
    })
  }
}

export default {
  namespaced: true,
  initialState,
  state,
  getters,
  mutations,
  actions
}
