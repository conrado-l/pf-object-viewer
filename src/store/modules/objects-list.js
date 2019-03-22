import types from './objects-list.mutations'
import { get } from '@/api/api-service'
import loaders from '@/consts/loaders'
import { generateURLQueryFromObject } from '@/utils/url'

// Keep the initial state in case we need to reset the store, when a component destroys for example.
const initialState = () => ({
  objects: [],
  filtering: {
    term: '',
    selected: 'name',
    options: [
      { value: 'name', description: 'Name' },
      { value: 'description', description: 'Description' },
      { value: 'id', description: 'ID' }
    ]
  },
  sorting: {
    selected: 'description',
    options: [
      { value: 'name', description: 'Name' },
      { value: 'description', description: 'Description' },
      { value: 'id', description: 'ID' }
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
    params.filterBy = state.filtering.selected

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
   * Sets the filter type
   * @param state
   * @param {string} filter
   */
  [types.SET_FILTER_TYPE] (state, filter) {
    state.filtering.selected = filter
  },
  /**
   * Sets the sorting
   * @param state
   * @param {string} sortBy
   */
  [types.SET_SORT_BY] (state, sortBy) {
    state.sortBy = sortBy
  },
  /**
   * Sets the pagination, sorting and filter settings.
   * @param {object} state - Vuex state object.
   * @param {object} payload - Settings
   * @param {string} [payload.search] - Filter term
   * @param {string} [payload.filterBy] - Filter type
   * @param {string} [payload.sortBy] - Sorting type
   * @param {string} [payload.page] - Page number
   */
  [types.SET_SETTINGS] (state, { search, filterBy, sortBy, page }) {
    state.filtering.term = search || state.filtering.term
    state.filtering.selected = filterBy || state.filtering.selected // TODO: check if the filter is valid
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
