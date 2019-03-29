import types from './objects-list.mutations'
import { get } from '@/api/api-service'
import loaders from '@/consts/loaders'
import { arrayIncludesArrayByProperty, hasPropertyValueInArray } from '@/utils/arrays'

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
        { value: 'type', description: 'Type' },
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
    totalObjects: 0,
    totalPages: 0,
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
   * Sets the total pages for pagination.
   * @param {object} state - Vuex state.
   * @param {string} totalPages - Total page count.
   * @param {string} totalObjects - Total objects count.
   */
  [types.SET_PAGINATION_SETTINGS] (state, { totalPages, totalObjects }) {
    state.pagination.totalPages = totalPages
    state.pagination.totalObjects = totalObjects
  },
  /**
   * Validates and sets the search filter.
   * @param {object} state - Vuex state.
   * @param {string} filter - Filter type
   */
  [types.SET_FILTER_BY] (state, filter = '') {
    state.filters.byTerm.selected = hasPropertyValueInArray(filter, state.filters.byTerm.options, 'value')
      ? filter
      : ''
  },
  /**
   * Validates and sets the availability filter.
   * @param {object} state - Vuex state.
   * @param {string} available - Availability
   */
  [types.SET_AVAILABILITY_FILTER] (state, available = '') {
    state.filters.byAvailability.selected = hasPropertyValueInArray(available, state.filters.byAvailability.options, 'value')
      ? available
      : ''
  },
  /**
   * Validates and sets the current page.
   * @param {object} state - Vuex state.
   * @param {string|number} page - Current page
   */
  [types.SET_CURRENT_PAGE] (state, page = '') {
    const parsedValue = Number(page)

    state.pagination.current = parsedValue > 0 ? parsedValue : state.pagination.current
  },
  /**
   * Validates and sets the sorting.
   * @param {object} state - Vuex state.
   * @param {string} sorting - Sorting
   */
  [types.SET_SORT_BY] (state, sorting = '') {
    const rawArrayValues = sorting.toString().split(',')

    state.sorting.selected = arrayIncludesArrayByProperty(rawArrayValues, state.sorting.options, 'value')
  },
  /**
   * Sets current filter.
   * @param {object} state - Vuex state.
   * @param {string} search - Search term
   */
  [types.SET_SEARCH_TERM] (state, search = '') {
    state.filters.byTerm.search = search
  }
}

const actions = {
  /**
   * Fetches the objects
   * @param state
   * @param commit
   * @param dispatch
   * @param getters
   */
  fetchObjects ({ state, commit, dispatch, getters }) {
    const loaderName = loaders.objectsList.FETCH_OBJECTS

    return new Promise((resolve, reject) => {
      // Indicates the start of the fetching operation to the whole application (vue-wait plugin)
      dispatch('wait/start', loaderName, { root: true })

      // API request settings
      let settings = {}

      // Page
      settings._page = state.pagination.current

      // Limit
      settings._limit = state.pagination.limit

      // Sorting
      if (state.sorting.selected.length) {
        settings._sort = state.sorting.selected.join(',') // TODO: create axios serializer to convert arrays to joined strings
      }

      // Filter is selected, search by filter
      if (state.filters.byTerm.selected && state.filters.byTerm.search) {
        settings[`${state.filters.byTerm.selected}_like`] = state.filters.byTerm.search
      }

      // No filter is selected, full-text search
      if (!state.filters.byTerm.selected && state.filters.byTerm.search) {
        settings.q = state.filters.byTerm.search
      }

      // Availability filter
      if (state.filters.byAvailability.selected) {
        settings.available = state.filters.byAvailability.selected
      }

      get('/objects', settings)
        .then((res) => {
          commit(types.SET_OBJECTS, res.data)
          commit(types.SET_PAGINATION_SETTINGS, {
            totalObjects: res.headers['x-total-count'],
            totalPages: Math.ceil(res.headers['x-total-count'] / state.pagination.limit) // Should be provided by the API
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
   * @param {string} search - Filter term
   * @param {string} filterBy - Filter type
   * @param {string} sortBy- Sorting type
   * @param {string} available - Availability filter
   * @param {string} page - Page number
   * Consideration: the mutation/s could be called without an action, depends on the person.
   */
  applySettings ({ commit }, { search, filterBy, sortBy, available, page }) {
    commit(types.SET_SEARCH_TERM, search)
    commit(types.SET_FILTER_BY, filterBy)
    commit(types.SET_SORT_BY, sortBy)
    commit(types.SET_AVAILABILITY_FILTER, available)
    commit(types.SET_CURRENT_PAGE, page)
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
