import actions from './object-detail.actions'

let url = ''

jest.mock('@/api/api-service.js', () => ({
  get: (_url) => {
    return new Promise((resolve) => {
      url = _url
      resolve(true)
    })
  }
}))

describe('fetchObject', () => {
  it('should fetch the object data from the API and run the correct mutation', async () => {
    const commit = jest.fn()
    const objectId = '125'

    await actions.fetchObject({ commit }, objectId)

    expect(url).toBe(`${process.env.VUE_APP_BASE_API_URL}/objects/${objectId}`)
    expect(commit).toHaveBeenCalledWith('SET_OBJECT', true)
  })
})
