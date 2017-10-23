import Vue from 'vue'
import 'mint-ui/lib/style.css'
import './styles/iconfont.css'
import 'swiper/dist/css/swiper.css'
import App from './App'
import router from './router'
import MintUI from 'mint-ui'
import store from './vuex/store'
import { AUTH_URL } from './constants/constant'
import { getStore, setStore, mobileClient, getLocalStore, removeLocalStore } from './config/mUtils'
import realtime from './config/leancloud'

router.beforeEach((to, from, next) => {
  const handleUrlQuery = () => {
    let query = {
      tmpToken: '',
      provider: ''
    }
    if (window.location.hash.split('?').length === 1) {
      return query
    } else {
      let params = window.location.hash.split('?')[1].split('&')
      for (let i = 0; i < params.length; i++) {
        if (params[i].split('=').length > 1 && params[i].split('=')[0] === 'tmp_token') {
          query.tmpToken = params[i].split('=')[1]
        }
        if (params[i].split('=').length > 1 && params[i].split('=')[0] === 'provider') {
          query.provider = params[i].split('=')[1]
        }
      }
      return query
    }
  }
  const weixinAuth = (token, next) => {
    store.dispatch('commonAction', {
      url: '/login_info',
      method: 'get',
      params: {
        token: token
      },
      data: {},
      target: this,
      resolve: (state, res) => {
        setStore('device_signature', res.data.sign)
        removeLocalStore('weixinLogin')
        if (!res.data.authentication_token && res.data.id) {
          // this.user = res.data
          // this.countDown(AUTHORIZATION_TIME, 1000)
          // this.showDialog = true
          // this.initImClient(res.data.device_id)
          console.log('需要主控设备授权')
        } else if (res.data.authentication_token && res.data.id) {
          setStore('user', res.data)
          getSignature(res.data.authentication_token, next)
        } else {
          console.log('授权登录出错')
        }
      },
      reject: () => {
        console.log('授权登录出错')
      }
    })
  }
  const getSignature = (token, next) => {
    store.dispatch('commonAction', {
      url: '/im/sign',
      method: 'get',
      params: {
        token: token
      },
      target: this,
      resolve: (state, res) => {
        setStore('signature', res.data)
        let time = setTimeout(() => {
          clearTimeout(time)
          next()
        }, 1000)
      },
      reject: () => {
      }
    })
  }
  const autoLogin = (next) => {
    if (handleUrlQuery().tmpToken && (!getStore('user') || !getStore('user').authentication_token)) {
      weixinAuth(handleUrlQuery().tmpToken, next)
    } else if (getLocalStore('weixinLogin') && (!getStore('user') || !getStore('user').authentication_token)) {
      console.log('微信自动授权登录失败')
      next()
    } else if (mobileClient() === 'weixin' && (!getStore('user') || !getStore('user').authentication_token) && !getLocalStore('weixinLogin')) {
      window.location.href = `${AUTH_URL}/member/auth/wechat?url=${encodeURIComponent(`/${window.location.hash}?provider=wechat&tmp_token=`)}`
    } else {
      next()
    }
  }
  // 如果是直接输入地址打开指定页面，则保存当前页面直接返回首页标记，在当前页面返回会回到首页。如果是从上一级点击进入某页面后，会保存来源页面标记，刷新页面，判断如果没有返回首页标记，则返回上一页(刷新页面window.history不会丢失)
  setStore('fromName', {name: from.name ? from.name : (getStore('fromName') ? getStore('fromName').name : 'false')})
  if (!getStore('fromName') || getStore('fromName').name === 'false') {
    setStore(`${to.name}_goHome`, 'true')
  }
  store.dispatch('resetState')
  autoLogin(next)
  // next()
  document.documentElement.scrollTop = 0
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
