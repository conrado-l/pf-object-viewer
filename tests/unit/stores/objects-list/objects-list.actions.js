import { get } from '@/api/api-service'
import { generateURLQueryFromObject } from '@/utils/url'

export default {
  async fetchObjects ({ commit }, query) {
    const serializedQuery = generateURLQueryFromObject(query)
    const objectsData = await get(`${process.env.VUE_APP_BASE_API_URL}/objects${serializedQuery}`)

    commit('SET_OBJECTS', objectsData)
    commit('SET_TOTAL_PAGES', 3)
  },
  applySettings ({ commit }, settings) {
    commit('SET_SETTINGS', settings)
  }
}
