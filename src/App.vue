<template>
  <div id="app">
    <transition name="router-fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import { getStore } from './config/mUtils'
  import moment from 'moment'
  export default {
    name: 'app',
    data () {
      return {
        currentUserDelegate: this.$store.state.userDelegate || null,
        currentDeviceDelegate: this.$store.state.deviceDelegate || null,
        conversation: null,
        conversationList: [],
        acitve: false
      }
    },
    methods: {
      beforeInit () {
        // 登录后getStore('user')会发生变化，不能直接从data中取数据，data中的数据不是响应式的。
        if (getStore('user') && getStore('user').authentication_token) {
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
          console.log('deviceDelegate', message)
        })
        if (!this.acitve) {
          this.$store.state.userDelegate.on('message', message => {
            this.acitve = true
            console.log('userDelegate', message)
            let tmpObj = {
              conversationId: message.cid,
              from: message.from,
              id: message.id,
              fromLogo: message._lcattrs.fromLogo,
              fromName: message._lcattrs.fromName,
              timestamp: moment(message.timestamp).format('YYYY-MM-DD HH:mm:ss'),
              clazz: message._lcattrs.clazz,
              lastMessage: message._lctext,
              isSelf: false
            }
            // 不在聊天页面，收到的新消息统一默认为未读消息
            if (this.$route.name !== 'Chat') {
              this.$store.dispatch('receiveNewMessage', tmpObj)
            }
          })
          this.$store.state.userDelegate.on('unreadmessagescountupdate', unreadMessagesCount => {
            console.log('未读消息记录', unreadMessagesCount)
            this.$store.dispatch('updateUnReadMsgCount', unreadMessagesCount)
          })
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
  .mint-header-title {
    height: inherit !important;
    @include px2rem(line-height, 88px);
  }
</style>
