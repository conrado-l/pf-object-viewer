import { get } from '@/api/api-service'

export default {
  async fetchObject ({ commit }, objectId) {
    const objectData = await get(`${process.env.VUE_APP_BASE_API_URL}/objects/${objectId}`)

    commit('SET_OBJECT', objectData)
  }
}
