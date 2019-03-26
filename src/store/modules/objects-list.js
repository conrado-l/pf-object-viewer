import types from './objects-list.mutations'
import { get } from '@/api/api-service'
import loaders from '@/consts/loaders'
import { generateURLQueryFromObject } from '@/utils/url'

// Keep the initial state in case we need to reset the store, when a component destroys for example.
const initialState = () => ({
  objects: [],
  filters: {
    byTerm: {
      search: '', // Search term filter
      selected: '',
      options: [
        { value: 'name', description: 'Name' },
        { value: 'description', description: 'Description' },
        { value: 'id', description: 'ID' }
      ]
    },
    byAvailability: {
      selected: '',
      options: [
        { value: 'yes', description: 'Yes' },
        { value: 'no', description: 'No' }
      ]
    }
  },
  sorting: {
    selected: '',
    options: [
      { value: 'name', description: 'Name' },
      { value: 'description', description: 'Description' },
      { value: 'id', description: 'ID' }
    ]
  },
  pagination: {
    current: 1,
    totalObjects: 5, // TODO: set by the API response
    totalPages: 5, // TODO: set by the API response
    limit: 5 // TODO: set by the user?
  }
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
   * Gets the pagination settings
   * @param state
   * @returns {number}
   */
  getPagination (state) {
    return state.pagination
  },
  /**
   * Gets the filters settings
   * @param state
   * @returns {number}
   */
  getFilters (state) {
    return state.filters
  },
  /**
   * Gets the filters settings
   * @param state
   * @returns {number}
   */
  getSorting (state) {
    return state.sorting
  },
  /**
   * Generates an object containing the current pagination and the enabled sorting/filter settings.
   * @param {object} state
   */
  getCurrentSettings (state) {
    let params = {}

    params.page = state.pagination.current
    params.limit = state.pagination.limit

    if (state.sorting.selected) {
      params.sortBy = state.sorting.selected
    }

    if (state.filters.byTerm.selected) {
      params.filterBy = state.filters.byTerm.selected
    }

    if (state.filters.byTerm.search) {
      params.search = state.filters.byTerm.search
    }

    if (state.filters.byAvailability.selected) {
      params.available = state.filters.byAvailability.selected
    }

    return params
  }
}

const mutations = {
  /**
   * Resets the store's state
   * @param state Vuex state
   */
  reset (state) {
    const init = initialState()
    Object.keys(init).forEach(key => {
      state[key] = init[key]
    })
  },
  /**
   * Sets the objects
   * @param state Vuex state
   * @param objects
   */
  [types.SET_OBJECTS] (state, objects) {
    state.objects = objects
  },
  /**
   * Sets the pagination, sorting and filter settings.
   * @param {object} state - Vuex state.
   * @param {object} settings - Settings
   * @param {string} [settings.search] - Filter term
   * @param {string} [settings.filterType] - Filter type
   * @param {string} [settings.sortBy] - Sorting type
   * @param {string} [settings.available] - Availability filter
   * @param {string} [settings.page] - Page number
   * TODO: can be refactored into an action that fires a different mutation for every state property
   */
  [types.SET_SETTINGS] (state, { search, page, filterType, sortBy, available }) { // TODO: check if URL filter/sort is valid
    state.filters.byTerm.search = search || ''
    state.filters.byTerm.selected = filterType || ''
    state.filters.byAvailability.selected = available || ''
    state.sorting.selected = sortBy || ''
    state.pagination.current = page ? Number(page) : state.pagination.current
  },
  /**
   * Sets the total pages for pagination.
   * @param {object} state - Vuex state.
   * @param {string} totalPages - Total page count.
   * @param {string} totalObjects - Total objects count.
   */
  [types.SET_PAGINATION_SETTINGS] (state, { totalPages, totalObjects }) {
    state.pagination.totalPages = totalPages ? Number(totalPages) : state.totalPages
    state.pagination.totalObjects = totalObjects ? Number(totalObjects) : state.totalObjects
  }
}

const actions = {
  /**
   * Fetches the objects
   * @param commit
   * @param dispatch
   * @param getters
   */
  fetchObjects ({ commit, dispatch, getters }) {
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

      const serializedQuery = generateURLQueryFromObject(getters.getCurrentSettings)

      const URL = `/objects${serializedQuery}`

      get(URL)
        .then((res) => {
          commit(types.SET_OBJECTS, res.data.objects)
          // commit(types.SET_PAGINATION_SETTINGS, {totalPages: res.data.totalPages, totalObjects: res.data.totalObjects})
          resolve()
        })
        .catch((err) => {
          console.error('An error has occured while fetching the objects', err)
          reject(err)
        })
        .finally(() => dispatch('wait/end', loaderName, { root: true }))
    })
  },
  /**
   * Sets the settings for pagination, sorting and filtering.
   * @param commit
   * @param {object} settings
   * Consideration: the mutation could be called without an action, depending on the person.
   */
  applySettings ({ commit }, settings) {
    commit(types.SET_SETTINGS, settings)
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
