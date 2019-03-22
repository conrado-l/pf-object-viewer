import Vue from 'vue'
import Vuex from 'vuex'
import objectsList from './modules/objects-list'

Vue.use(Vuex)

const modules = {
  objectsList
}

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules
})
