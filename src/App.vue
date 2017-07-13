<template>
  <div id="app">
    <transition name="router-fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import { getStore } from './config/mUtils'
  export default {
    name: 'app',
    data () {
      return {
        hasLogin: !!getStore('user'),
        token: getStore('user') ? getStore('user').authentication_token : '',
        currentUserDelegate: null,
        conversation: null,
        uuid: getStore('user') ? getStore('user').id : ''
      }
    },
    methods: {
      async init () {
        this.currentUserDelegate = await this.$realtime.createIMClient(this.uuid, {
          signatureFactory: () => {
            return new Promise((resolve, reject) => {
              return resolve({
                signature: getStore('signature').signature,
                timestamp: getStore('signature').timestamp / 1,
                nonce: getStore('signature').nonce
              })
            })
          },
          conversationSignatureFactory: () => {
            return new Promise((resolve, reject) => {
              return resolve({
                signature: getStore('signature').signature,
                timestamp: getStore('signature').timestamp / 1,
                nonce: getStore('signature').nonce
              })
            })
          }
        })
        this.currentUserDelegate.getQuery().containsMembers([`${this.uuid}`]).find().then(conversations => {
          conversations.map(conversation => {
            console.log(conversation.lastMessageAt.toString(), conversation)
          })
        }).catch(
          console.error.bind(console)
        )
        this.currentUserDelegate.on('message', message => {
          console.log(message)
        })
      }
    },
    mounted () {
      this.init()
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
    background-color: $main-background;
    width: 100%;
    height: 100%;
  }
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
</style>
