// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'mint-ui/lib/style.css'
import './styles/iconfont.css'
import 'swiper/dist/css/swiper.css'
import App from './App'
import router from './router'
import MintUI from 'mint-ui'
import store from './vuex/store'
import { getStore, setStore } from './config/mUtils'
import realtime from './config/leancloud'

router.beforeEach((to, from, next) => {
  // 如果是直接输入地址打开指定页面，则保存当前页面直接返回首页标记，在当前页面返回会回到首页。如果是从上一级点击进入某页面后，会保存来源页面标记，刷新页面，判断如果没有返回首页标记，则返回上一页(刷新页面window.history不会丢失)
  setStore('fromName', {name: from.name ? from.name : (getStore('fromName') ? getStore('fromName').name : 'false')})
  if (!getStore('fromName') || getStore('fromName').name === 'false') {
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
