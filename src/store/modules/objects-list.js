import types from './objects-list.mutations'
import filterTypes from '@/consts/filter-types'
import sortTypes from '@/consts/sort-types'
import { get } from '@/api/api-service'
import loaders from '@/consts/loaders'
import { generateURLQueryFromObject } from '@/utils/url'

// Keep the initial state in case we need to reset the store, when a component destroys for example.
const initialState = () => ({
  objects: [],
  filtering: {
    term: '',
    type: {
      selected: filterTypes.types.NAME,
      options: [
        { value: filterTypes.types.NAME, description: 'Name' },
        { value: filterTypes.types.DESCRIPTION, description: 'Description' },
        { value: filterTypes.types.ID, description: 'ID' }
      ]
    },
    available: {
      selected: filterTypes.available.ALL,
      options: [
        { value: filterTypes.available.ALL, description: 'All' },
        { value: filterTypes.available.AVAILABLE, description: 'Yes' },
        { value: filterTypes.available.NOT_AVAILABLE, description: 'No' }]
    }
  },
  sorting: {
    selected: sortTypes.CREATION_DATE,
    options: [
      { value: sortTypes.CREATION_DATE, description: 'Creation date' },
      { value: sortTypes.ID, description: 'ID' }
    ]
  },
  pagination: {
    current: 1,
    total: 5, // TODO: set by the API response
    limit: 5 // TODO: set by the user?
  }
})

const state = initialState()

const getters = {
  /**
   * Generates an object containing the current pagination, sorting and filter settings.
   * @param {object} state
   */
  getSettingsObjectParams (state) {
    let params = {}

    params.page = state.pagination.current
    params.limit = state.pagination.limit
    params.sortBy = state.sorting.selected
    params.filterType = state.filtering.type.selected
    params.available = state.filtering.available.selected

    if (state.filtering.term) {
      params.search = state.filtering.term
    }

    return params
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
   * Sets the current page
   * @param state
   * @param {string} page
   */
  [types.SET_CURRENT_PAGE] (state, page) {
    state.pagination.current = page
  },
  /**
   * Sets the filter term
   * @param state
   * @param {string} term
   */
  [types.SET_FILTER_TERM] (state, term) {
    state.filtering.term = term
  },
  /**
   * Sets the type filter
   * @param state
   * @param {string} filter
   */
  [types.SET_FILTER_TYPE] (state, filter) {
    state.filtering.type.selected = filter
  },
  /**
   * Sets the available filter
   * @param state
   * @param {string} filter
   */
  [types.SET_FILTER_AVAILABLE] (state, filter) {
    state.filtering.available.selected = filter
  },
  /**
   * Sets the sorting
   * @param state
   * @param {string} sortBy
   */
  [types.SET_SORT_BY] (state, sortBy) {
    state.sorting.selected = sortBy
  },
  /**
   * Sets the pagination, sorting and filter settings.
   * @param {object} state - Vuex state object.
   * @param {object} payload - Settings
   * @param {string} [payload.search] - Filter term
   * @param {string} [payload.filterType] - Filter type
   * @param {string} [payload.sortBy] - Sorting type
   * @param {string} [payload.page] - Page number
   */
  [types.SET_SETTINGS] (state, { search, filterType, available, sortBy, page }) {
    state.filtering.term = search || state.filtering.term
    state.filtering.type.selected = filterType || state.filtering.type.selected // TODO: check if the filter is valid
    state.filtering.available.selected = available || state.filtering.available.selected // TODO: check if the filter is valid
    state.sorting.selected = sortBy || state.sorting.selected // TODO: check if the sort is valid
    state.pagination.selected = page ? Number(page) : state.pagination.selected
  },
  /**
   * Sets the pagination settings.
   * @param {object} state - Vuex state object.
   * @param {string} total - Total page count.
   */
  [types.SET_PAGINATION_SETTINGS] (state, { total }) {
    state.pagination.total = total ? Number(total) : state.pagination.total
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

      const URL = `/objects${generateURLQueryFromObject(getters.getSettingsObjectParams)}` // TODO: improve

      get(URL)
        .then((res) => {
          commit(types.SET_OBJECTS, res.data.objects)
          // commit('setPaginationData', res.data.pagination)
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
