import types from './objects-list.mutations'
import commonTypes from '@/store/common/common.mutation'
import { get } from '@/api/api-service'
import loaders from '@/consts/loaders'
import { arrayIncludesArrayByProperty, hasPropertyValueInArray } from '@/utils/arrays'

// Keep the initial state in case we need to reset the store, when a component is destroyed for example.
const initialState = () => ({ // TODO: improve state structure and refactor
  objects: [],
  search: '',
  filters: {
    byTerm: {
      selected: [],
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
   * Gets the objects.
   * @param state
   * @returns {array}
   */
  getObjects (state) {
    return state.objects
  },
  /**
   * Gets the search term.
   * @param state
   * @returns {array}
   */
  getSearch (state) {
    return state.search
  },
  /**
   * Gets the total pages.
   * @param state
   * @returns {number}
   */
  getTotalPages (state) {
    return state.pagination.totalPages
  },
  /**
   * Gets the current pages.
   * @param state
   * @returns {number}
   */
  getCurrentPage (state) {
    return state.pagination.current
  },
  /**
   * Gets the filters options.
   * @param state
   * @returns {array}
   */
  getFiltersOptions (state) {
    return state.filters.byTerm.options
  },
  /**
   * Gets the selected filter.
   * @param state
   * @returns {string}
   */
  getFilterSelected (state) {
    return state.filters.byTerm.selected
  },
  /**
   * Gets the sorting options.
   * @param state
   * @returns {array}
   */
  getSortingOptions (state) {
    return state.sorting.options
  },
  /**
   * Gets the selected sorting.
   * @param state
   * @returns {array}
   */
  getSortingSelected (state) {
    return state.sorting.selected
  },
  /**
   * Gets the availability filter options.
   * @param state
   * @returns {array}
   */
  getAvailabilityFilterOptions (state) {
    return state.filters.byAvailability.options
  },
  /**
   * Gets the availability selected filter.
   * @param state
   * @returns {string}
   */
  getAvailabilityFilterSelected (state) {
    return state.filters.byAvailability.selected
  },
  /**
   * Gets the polling interval.
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
  [commonTypes.RESET_STORE] (state) {
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
   * Sets the total pages and total objects for pagination.
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
    const parsedPage = Number(page)

    state.pagination.current = parsedPage > 0 ? parsedPage : state.pagination.current
  },
  /**
   * Validates and sets the sorting.
   * @param {object} state - Vuex state.
   * @param {string} sorting - Sorting
   */
  [types.SET_SORT_BY] (state, sorting = '') {
    const rawSortingArray = sorting.toString().split(',')

    state.sorting.selected = arrayIncludesArrayByProperty(rawSortingArray, state.sorting.options, 'value')
  },
  /**
   * Sets current filter.
   * @param {object} state - Vuex state.
   * @param {string} search - Search term
   */
  [types.SET_SEARCH_TERM] (state, search = '') {
    state.search = search
  }
}
/**
 * Generates the object for fetching the objects based on the settings.
 * @param {object} settings
 * @param {number} settings.page
 * @param {number} settings.limit
 * @param {string} settings.filter
 * @param {array}  settings.sorting
 * @param {string} settings.available
 * @param {string} settings.search
 */
const generateFetchObjectsParams = ({ page, limit, filter, sorting, available, search }) => {
  let params = {}

  // Page
  params._page = page

  // Limit
  params._limit = state.limit

  // Sorting
  if (sorting.length) {
    params._sort = sorting.join(',') // TODO: create axios serializer to convert arrays to joined strings (json-server case)
  }

  // Filter is selected, search by filter
  if (filter && search) {
    params[`${filter}_like`] = search
  }

  // No filter is selected, full-text search
  if (!filter && search) {
    params.q = search
  }

  // Availability filter
  if (available) {
    params.available = available
  }

  return params
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

      const settings = {
        filter: state.filters.byTerm.selected,
        available: state.filters.byAvailability.selected,
        sorting: state.sorting.selected,
        search: state.search,
        page: state.pagination.current,
        limit: state.pagination.limit
      }

      const params = generateFetchObjectsParams(settings)

      get('/objects', params)
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
   * TODO: extract the action and mutation to a common file for reusability
   */
  resetStore ({ commit }) {
    commit(commonTypes.RESET_STORE)
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
