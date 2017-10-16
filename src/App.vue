<template>
  <div id="app">
    <transition name="router-fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import { getStore, removeAllStore, setStore, mobileClient } from './config/mUtils'
  import { AUTH_URL, AUTHORIZATION_TIME } from './constants/constant'
  import { requestFn } from './config/request'
  import { MessageBox, Indicator, Toast } from 'mint-ui'
  import moment from 'moment'
  export default {
    name: 'app',
    data () {
      return {
        currentUserDelegate: this.$store.state.userDelegate || null,
        currentDeviceDelegate: this.$store.state.deviceDelegate || null,
        conversation: null,
        acitve: false,
        showLogoffPopup: false,
        weixinLogin: `${AUTH_URL}` + '/member/auth/wechat?url=' + encodeURIComponent(`/#${this.$route.path}?provider=wechat&tmp_token=`),
        title: '提醒',
        time: AUTHORIZATION_TIME,
        tips: '登录请求已发送，请等待授权...',
        showDialog: false,
        interval: null
      }
    },
    methods: {
      beforeInit () {
        // 登录后getStore('user')会发生变化，不能直接从data中取数据，data中的数据不是响应式的。
        if (getStore('user') && getStore('user').authentication_token && !this.acitve) {
          this.getClosedConversationList()
          this.init()
        } else {
          return false
        }
      },
      openIMClient (id, signatureStr) {
        return this.$realtime.createIMClient(id, {
          signatureFactory: () => {
            return new Promise((resolve, reject) => {
              return resolve({
                signature: getStore(`${signatureStr}`).signature,
                timestamp: getStore(`${signatureStr}`).timestamp / 1,
                nonce: getStore(`${signatureStr}`).nonce
              })
            })
          },
          conversationSignatureFactory: () => {
            return new Promise((resolve, reject) => {
              return resolve({
                signature: getStore(`${signatureStr}`).signature,
                timestamp: getStore(`${signatureStr}`).timestamp / 1,
                nonce: getStore(`${signatureStr}`).nonce
              })
            })
          }
        })
      },
      async init () {
        if (!this.$store.state.deviceDelegate) {
          this.currentDeviceDelegate = await this.openIMClient(`dev_${getStore('user').device_id}`, 'device_signature')
          this.$store.dispatch('setDeviceDelegate', this.currentDeviceDelegate)
        }
        if (!this.$store.state.userDelegate) {
          this.currentUserDelegate = await this.openIMClient(getStore('user').id, 'signature')
          this.$store.dispatch('setUserDelegate', this.currentUserDelegate)
        }
        this.$store.state.userDelegate.getQuery().limit(1000).containsMembers([`${getStore('user').id}`]).find().then(conversations => {
          this.$store.dispatch('updateLeanCouldConversations', conversations)
        })
        this.$store.state.deviceDelegate.on('message', message => {
          console.log('deviceDelegate, 设备uuid收到的消息，用于强制下线等操作', message)
          if (message.from === 'system' && message._lcattrs.clazz === 'sign_devices.logoff') {
            this.showLogoffPopup = true
            MessageBox.alert('授权到期，主设备将当前设备下线').then(action => {
              this.showLogoffPopup = false
              removeAllStore()
              this.$router.replace({name: 'See'})
            })
          }
        })
        this.$store.state.userDelegate.on('message', message => {
          console.log('userDelegate, 用户uuid收到的消息，用于聊天等操作', message)
          let tmpObj = {
            conversationId: message.cid,
            from: message.from,
            id: message.id,
            fromLogo: message._lcattrs.fromLogo,
            fromName: message._lcattrs.fromName,
            timestamp: moment(message.timestamp).format('YYYY-MM-DD HH:mm:ss'),
            clazz: message._lcattrs.clazz,
            lastMessage: message._lctext,
            isSelf: false,
            remark: message._lcattrs.fromName,
            logoUrl: message._lcattrs.fromLogo
          }
          this.reOpenBanList(message.from, message._lcattrs.clazz, message.cid)
          // 不在聊天页面，收到的新消息统一默认为未读消息
          if (this.$route.name !== 'Chat' && message.from !== getStore('user').id) {
            this.$store.dispatch('receiveNewMessage', tmpObj)
          }
        })
        this.$store.state.userDelegate.on('unreadmessagescountupdate', unreadMessagesCount => {
          console.log('聊天未读消息记录', unreadMessagesCount)
          this.$store.dispatch('updateUnReadMsgCount', unreadMessagesCount)
        })
        this.acitve = true
      },
      async getClosedConversationList () {
        if (this.$store.state.closedConversationList.length === 0) {
          let {state, res} = await requestFn({
            url: '/im/conferences',
            params: {
              token: getStore('user').authentication_token,
              closed: true
            }
          })
          if (res.data) {
            state.closedConversationList = res.data.conferences
          }
        }
      },
      async reOpenBanList (linkId, clazz, conversationId) {
        // 若收到的消息id(会话id)在被关闭的会话列表中，则需要开启会话
        let flag = false
        let conferencesLinkId = null
        for (let i = 0; i < this.$store.state.closedConversationList.length; i++) {
          if (conversationId === this.$store.state.closedConversationList[i].conversation_id) {
            flag = true
            conferencesLinkId = this.$store.state.closedConversationList[i].link_id
            break
          }
        }
        if (flag) {
          await requestFn({
            url: '/im/conferences',
            method: 'post',
            data: {
              token: getStore('user').authentication_token,
              ...(conferencesLinkId ? {product_id: conferencesLinkId} : {}), // 如果是产品客服，需要产品id
              user_id: linkId
            }
          })
          // 打开被关闭的会话后，要更细被关闭的会话列表
          this.getClosedConversationList()
        }
      },
      async initImClient (id) {
        this.deviceDelegate = await this.$realtime.createIMClient(`dev_${id}`, {
          signatureFactory: () => {
            return new Promise((resolve, reject) => {
              return resolve({
                signature: getStore('device_signature').signature,
                timestamp: getStore('device_signature').timestamp / 1,
                nonce: getStore('device_signature').nonce
              })
            })
          },
          conversationSignatureFactory: () => {
            return new Promise((resolve, reject) => {
              return resolve({
                signature: getStore('device_signature').signature,
                timestamp: getStore('device_signature').timestamp / 1,
                nonce: getStore('device_signature').nonce
              })
            })
          }
        })
        this.$store.dispatch('setDeviceDelegate', this.deviceDelegate)
        this.deviceDelegate.on('message', message => {
          if (message.from && message.from === 'system' && message.content && message.content._lcattrs && message.content._lcattrs.token) {
            this.user.authentication_token = message.content._lcattrs.token
            setStore('user', this.user)
            this.getSignature(message.content._lcattrs.token, false, '')
            this.closeDialog()
          } else if (message.from && message.from === 'system' && message._lcattrs && message._lcattrs.clazz === 'sign_devices.rejected') {
            this.closeDialog()
            this.showRejectPopup = true
            MessageBox.alert('主控设备拒绝了您的登录请求！').then(action => {
              this.showRejectPopup = false
            })
          }
        })
      },
      authLogin (token, provider) {
        this.$store.dispatch('commonAction', {
          url: '/login_info',
          method: 'get',
          params: {
            token: token
          },
          data: {},
          target: this,
          resolve: (state, res) => {
            setStore('device_signature', res.data.sign)
            if (!res.data.authentication_token && res.data.id) {
              this.user = res.data
              this.countDown(AUTHORIZATION_TIME, 1000)
              this.showDialog = true
              this.initImClient(res.data.device_id)
            } else if (res.data.authentication_token && res.data.id) {
              setStore('user', res.data)
              Indicator.open({
                text: '正在登录...',
                spinnerType: 'fading-circle'
              })
              this.getClosedConversationList()
              this.init()
            } else {
              Toast('授权登录出错')
            }
          },
          reject: () => {
            Toast('授权登录出错')
          }
        })
      },
      countDown (seconds, speed = 1000) {
        const count = () => {
          let minute = Math.floor(seconds / 60)
          let second = seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60
          if (seconds < 3600) {
            this.time = `${minute} : ${second}`
            seconds -= 1
            if (this.time === '0 : 00' && this.interval) {
              clearInterval(this.interval)
              if (this.deviceDelegate) {
                this.deviceDelegate.close().then(() => {
                  // 下线成功（倒计时走完后，没有授权则注销，点击登录，重新登录leancloud）
                }).catch(console.error.bind(console))
              }
              this.closeDialog()
              return false
            }
          }
        }
        count()
        this.interval = setInterval(count, speed)
      },
      closeDialog () {
        if (this.interval) {
          clearInterval(this.interval)
        }
        this.showDialog = false
      },
      shouldLogin () {
        if (this.$route.query.tmp_token) {
          this.authLogin(this.$route.query.tmp_token, this.$route.query.provider)
        } else if (mobileClient() === 'weixin') {
          window.location.href = this.weixinLogin
        }
      }
    },
    updated () {
      this.beforeInit()
    }
  }
</script>

<style lang="scss">
  @import './styles/common';
  @import './styles/mixin';
  .router-fade-enter-active, .router-fade-leave-active {
    transition: opacity .1s;
	}
	.router-fade-enter, .router-fade-leave-active {
    opacity: 0;
	}
  #app {
    background-color: $sixth-grey;
    width: 100%;
    max-width: 540px;
    min-height: 100%;
  }
  // symbols （iconfont彩色图标）
  .icon {
    width: 1em; height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
  .mint-indicator-mask {
    z-index: 1004 !important;
  }
  .mint-indicator-wrapper {
    z-index: 1004 !important;
  }
  .mint-msgbox-wrapper {
    max-width: 440px !important;
    .mint-msgbox {
      max-width: 360px !important;
    }
  }
  .mint-msgbox-confirm {
    color: $green !important;
  }
  .mint-msgbox-confirm:active {
    color: $green !important;
  }
  .mint-header-title {
    height: inherit !important;
    @include px2rem(line-height, 88px);
  }
  // 公共样式，放在公共文件中，避免部分页面没有加载而找不到样式文件
  .toast-icon-big {
    @include font-dpr(36px);
    @include pm2rem(margin, 0px, 0px, -20px, 0px);
  }
  .toast-content {
    background-color: rgba(0, 0, 0, .7);
    @include px2rem(width, 400px);
    box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.5);
    @include pm2rem(margin, -20px, 0px, -10px, 0px);
    padding: 0 !important;
    @include px2rem(border-radius, 14px);
    span {
      @include font-dpr(16px);
      @include px2rem(margin-bottom, 30px);
    }
  }

  @keyframes rotateTo90 {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(90deg);
    }
  }
  @keyframes rotateTo0 {
    from {
      transform: rotate(90deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
  @keyframes bounceIn {
    from, 20%, 40%, 60%, 80%, to {
      animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
    }
    0% {
      opacity: 0;
      transform: scale3d(.3, .3, .3);
    }
    20% {
      transform: scale3d(1.1, 1.1, 1.1);
    }
    40% {
      transform: scale3d(.9, .9, .9);
    }
    60% {
      opacity: 1;
      transform: scale3d(1.03, 1.03, 1.03);
    }
    80% {
      transform: scale3d(.97, .97, .97);
    }
    to {
      opacity: 1;
      transform: scale3d(1, 1, 1);
    }
  }
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translate3d(0, -100%, 0);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
  @keyframes fadeOutUp {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
      transform: translate3d(0, -100%, 0);
    }
  }
</style>
