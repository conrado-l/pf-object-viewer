import Vue from 'vue'
import Router from 'vue-router'
import ObjectsList from '@/views/ObjectsList'
import NotFound from '@/views/NotFound.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: { name: 'objects-list' }
    },
    { // TODO: create a father route and /list, /:id as children maybe
      path: '/objects/list',
      name: 'objects-list',
      component: ObjectsList
    },
    {
      path: '/objects/:id',
      name: 'object-detail',
      props: true,
      component: () => import('./views/ObjectDetail') // Add webpackChunk for lazy component
    },
    {
      path: '*',
      component: NotFound
    }
  ]
})
