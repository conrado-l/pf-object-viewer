import Vue from 'vue'
import Vuetify, { VSnackbar, VIcon } from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  iconfont: 'md',
  components: {
    VSnackbar,
    VIcon
  }
})
