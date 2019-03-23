import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import VueWait from 'vue-wait'
import VuetifyToast from 'vuetify-toast-snackbar'
import Transitions from 'vue2-transitions'
import VueMoment from 'vue-moment'
import './plugins/axios'
import './plugins/vuetify'
import './registerServiceWorker'

Vue.config.productionTip = false

/** Plugins */
Vue.use(VueWait)
Vue.use(VuetifyToast, {
  property: '$toast'
})
Vue.use(VueMoment)
Vue.use(Transitions)

/** Error handler **/
// Vue.config.errorHandler = (err, vm, info) => { // eslint-disable-line
// Store and send errors with Sentry or Bugsnag for example
// Use a file like ./error-handling.js
// }

/** Warning handler **/
// Vue.config.warnHandler = (msg, vm, trace) => {
// Store and send warnings with Sentry or Bugsnag for example
// Use a file like ./warning-handling.js
// }

/** Vue instance */
new Vue({
  router,
  store,
  wait: new VueWait({ useVuex: true }),
  render: h => h(App)
}).$mount('#app')
/**/
