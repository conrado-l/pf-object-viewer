import Vue from 'vue'
import Vuex from 'vuex'
import objectsList from './modules/objects-list/objects-list'
import objectDetail from './modules/object-detail/object-detail'

Vue.use(Vuex)

const modules = {
  objectsList,
  objectDetail
}

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules
})
