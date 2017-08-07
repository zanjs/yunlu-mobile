// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'mint-ui/lib/style.css'
import './styles/iconfont.css'
import App from './App'
import router from './router'
import MintUI from 'mint-ui'
import store from './vuex/store'
import { setStore } from './config/mUtils'
import realtime from './config/leancloud'

router.beforeEach((to, from, next) => {
  if (!from.name) {
    setStore(`${to.name}_goHome`, 'true')
  }
  store.dispatch('resetState')
  next()
  document.body.scrollTop = 0
})

Vue.use(realtime)
Vue.use(MintUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
