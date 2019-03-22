import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import ObjectsList from './components/TheObjectList.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    { // TODO: create a father route and /list, /:id as children maybe
      path: '/list',
      name: 'objects-list',
      component: ObjectsList
    },
    {
      path: '/:id',
      name: 'object-detail',
      component: () => import(/* webpackChunkName: "object-detail" */ './views/ObjectDetail.vue')
    }
  ]
})
