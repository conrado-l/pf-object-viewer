import store from '@/store/modules/object-detail/object-detail'
import types from '@/store/modules/object-detail/object-detail.mutations'
import APIService from '@/api/api-service'

jest.mock('@/api/api-service.js')

describe('fetchObject', () => {
  it('should fetch the object data from the API and run the correct mutation', async () => {
    const commit = jest.fn()
    const dispatch = jest.fn()
    const objectId = '125'

    await store.actions.fetchObject({ commit, dispatch }, objectId)

    expect(APIService.get).toHaveBeenCalledTimes(1)
    expect(APIService.get).toHaveBeenCalledWith('/objects/125')
    expect(commit).toHaveBeenCalledWith(types.SET_OBJECT, 'mockData')
  })
})
