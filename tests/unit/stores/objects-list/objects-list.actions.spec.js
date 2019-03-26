import actions from './objects-list.actions'
import { generateURLQueryFromObject } from '@/utils/url'

let url = ''

jest.mock('@/api/api-service.js', () => ({
  get: (_url) => {
    return new Promise((resolve) => {
      url = _url
      resolve(true)
    })
  }
}))

describe('fetchObjects', () => {
  it('should fetch the objects data from the API and run the correct mutation', async () => {
    const commit = jest.fn()
    const query = {
      page: 1,
      limit: 5, // TODO: set it the store only?
      search: 'pf',
      filterBy: 'description',
      sortBy: 'id',
      available: 'no'
    }

    const serializedQuery = generateURLQueryFromObject(query)

    await actions.fetchObjects({ commit }, query)

    expect(url).toBe(`${process.env.VUE_APP_BASE_API_URL}/objects${serializedQuery}`)
    expect(commit).toHaveBeenCalledWith('SET_OBJECTS', true)
    expect(commit).toHaveBeenCalledWith('SET_TOTAL_PAGES', 3)
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

    actions.applySettings({ commit }, settings) // Synchronous action, no need for await

    expect(commit).toHaveBeenCalledWith('SET_SETTINGS', settings)
  })
})
