<template>
  <div id="app">
    <transition name="router-fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import { getStore, removeAllStore } from './config/mUtils'
  import { requestFn } from './config/request'
  import { MessageBox } from 'mint-ui'
  import moment from 'moment'
  export default {
    name: 'app',
    data () {
      return {
        currentUserDelegate: this.$store.state.userDelegate || null,
        currentDeviceDelegate: this.$store.state.deviceDelegate || null,
        conversation: null,
        acitve: false,
        showLogoffPopup: false
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
    transition: opacity .3s;
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
</style>
