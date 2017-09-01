import { Realtime } from 'leancloud-realtime'
import { LEANCLOUD_APP_ID } from '../constants/constant'

const realtime = new Realtime({
  appId: LEANCLOUD_APP_ID,
  region: 'cn' // 美国节点为 "us"
})

export default {
  install: function (Vue) {
    Object.defineProperty(Vue.prototype, '$realtime', { value: realtime })
  }
}
