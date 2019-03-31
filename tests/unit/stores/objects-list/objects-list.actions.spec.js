import store from '@/store/modules/objects-list/objects-list'
import types from '@/store/modules/objects-list/objects-list.mutations'
import APIService from '@/api/api-service'

jest.mock('@/api/api-service')

describe('fetchObjects', () => {
  it('should fetch the objects data from the API and run the correct mutation', async () => {
    const state = {
      filters: {
        byTerm: {
          selected: '15'
        },
        byAvailability: {
          selected: ''
        }
      },
      sorting: {
        selected: []
      },
      pagination: {
        current: 1,
        limit: 5
      }
    }
    const commit = jest.fn()
    const dispatch = jest.fn()
    const response = {
      data: ['objects'],
      headers: {
        'x-total-count': 10
      }
    }
    const requestParams = {
      _limit: 5,
      _page: 1
    }

    APIService.get = jest.fn().mockImplementationOnce(() => Promise.resolve(response))

    await store.actions.fetchObjects({ state, commit, dispatch })

    expect(APIService.get).toHaveBeenCalledTimes(1)
    expect(APIService.get).toHaveBeenCalledWith('/objects', requestParams)
    expect(commit).toHaveBeenNthCalledWith(1, types.SET_OBJECTS, response.data)
    expect(commit).toHaveBeenNthCalledWith(2, types.SET_PAGINATION_SETTINGS, { totalObjects: 10, totalPages: 2 })
  })
})

describe('applySettings', () => {
  it('should apply the settings by calling the SET_SETTINGS mutation', async () => {
    const commit = jest.fn()
    const settings = {
      page: 1,
      limit: 5,
      search: 'pf',
      filterBy: 'description',
      sortBy: 'id',
      available: 'no'
    }

    store.actions.applySettings({ commit }, settings) // Synchronous action, no need for await

    expect(commit).toHaveBeenNthCalledWith(1, types.SET_SEARCH_TERM, settings.search)
    expect(commit).toHaveBeenNthCalledWith(2, types.SET_FILTER_BY, settings.filterBy)
    expect(commit).toHaveBeenNthCalledWith(3, types.SET_SORT_BY, settings.sortBy)
    expect(commit).toHaveBeenNthCalledWith(4, types.SET_AVAILABILITY_FILTER, settings.available)
    expect(commit).toHaveBeenNthCalledWith(5, types.SET_CURRENT_PAGE, settings.page)
  })
})
//
