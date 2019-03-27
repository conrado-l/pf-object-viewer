import types from './objects-list.mutations'
import { get } from '@/api/api-service'
import loaders from '@/consts/loaders'
import { generateURLQueryFromObject } from '@/utils/url'

// Keep the initial state in case we need to reset the store, when a component is destroyed for example.
const initialState = () => ({ // TODO: improve state structure and refactor
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
        { value: 'true', description: 'Yes' },
        { value: 'false', description: 'No' }
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
    totalObjects: 1,
    totalPages: 3,
    limit: 10 // TODO: set by the user
  },
  pollingInterval: 10000
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
   * Gets the polling interval
   * @param state
   * @returns {number}
   */
  getPollingInterval (state) {
    return state.pollingInterval
  },
  /**
   * Generates an object containing the current pagination and the enabled sorting/filter settings.
   * @param {object} state
   */
  APIRequestsSettings (state) { // TODO: improve it by not using a getter for this
    let params = {}

    params._page = state.pagination.current
    params._limit = state.pagination.limit

    if (state.sorting.selected) {
      params._sort = state.sorting.selected
    }

    if (state.filters.byTerm.selected) {
      params.filterBy = state.filters.byTerm.selected.join(',')
    }

    if (state.filters.byTerm.search) {
      params.q = state.filters.byTerm.search
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
  [types.RESET] (state) {
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
   * Consideration: add a mutation for every object property assignment
   */
  [types.SET_SETTINGS] (state, { search, page, filterType, sortBy, available }) { // TODO: check if URL filter/sort is valid
    state.filters.byTerm.search = search || ''
    state.filters.byTerm.selected = filterType ? filterType.toString().split(',') : '' // TODO: improve
    state.filters.byAvailability.selected = available || ''
    state.pagination.current = page ? Number(page) : state.pagination.current
    state.sorting.selected = sortBy ? sortBy.toString().split(',') : '' // TODO: improve
  },
  /**
   * Sets the total pages for pagination.
   * @param {object} state - Vuex state.
   * @param {string} totalPages - Total page count.
   * @param {string} totalObjects - Total objects count.
   */
  [types.SET_PAGINATION_SETTINGS] (state, { totalPages, totalObjects }) {
    state.pagination.totalPages = Math.ceil(totalPages / state.pagination.limit) // Should be provided by the API
    state.pagination.totalObjects = totalObjects ? Number(totalObjects) : state.totalObjects // Should be provided by the API
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

    return new Promise((resolve, reject) => {
      dispatch('wait/start', loaderName, { root: true }) // vue-wait plugin

      const serializedQuery = generateURLQueryFromObject(getters.APIRequestsSettings) // TODO: improve

      const URL = `/objects${serializedQuery}`

      get(URL)
        .then((res) => {
          commit(types.SET_OBJECTS, res.data)
          commit(types.SET_PAGINATION_SETTINGS, {
            totalObjects: res.data.length,
            totalPages: res.headers['x-total-count']
          })
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
   * @param {object} settings - Settings
   * @param {string} [settings.search] - Filter term
   * @param {string} [settings.filterType] - Filter type
   * @param {string} [settings.sortBy] - Sorting type
   * @param {string} [settings.available] - Availability filter
   * @param {string} [settings.page] - Page number
   * Consideration: the mutation/s could be called without an action, depends on the person.
   */
  applySettings ({ commit }, settings) {
    commit(types.SET_SETTINGS, settings)
  },
  /**
   * Resets the store's state.
   * @param commit
   */
  resetStore ({ commit }) {
    commit(types.RESET)
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
