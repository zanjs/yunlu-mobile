// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import './styles/iconfont.css'
import store from './vuex/store'
import { setStore } from './config/mUtils'
import realtime from './config/leancloud'
// import './config/rem'
// import FastClick from 'fastclick'

// 快速点击，消除300ms延迟
// if ('addEventListener' in document) {
//   document.addEventListener('DOMContentLoaded', function () {
//     FastClick.attach(document.body)
//   }, false)
// }

// history.pushState(null, null, document.URL)
// window.addEventListener('popstate', function () {
//   history.pushState(null, null, document.URL)
// })

router.beforeEach((to, from, next) => {
  if (!from.name) {
    setStore(`${to.name}_goHome`, 'true')
  }
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
