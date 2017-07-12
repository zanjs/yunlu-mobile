<template>
  <section>
    <mt-header
      :title="title"
      fixed
      class="header">
      <mt-button
        slot="left"
        @click="goBack()"
        class="button-text">
        <i class="iconfont icon-fanhui"></i>
      </mt-button>
    </mt-header>
    <section
      v-if="type === 'Product'"
      class="product-info">
      <div class="img-container">
        <img :src="productImg">
      </div>
      <div class="content">
        <p class="name">{{productName}}</p>
        <p
          v-if="productPrice === '定制'"
          class="price">定制</p>
        <p
          v-else
          class="price">&yen;{{productPrice}}元</p>
      </div>
    </section>
    <section class="container">
      <div
        class="chat-content"
        ref="chatContent"
        id="chatContent"
        onresize="resizeHeight">
        <message
          v-for="(item, index) in msgs"
          :key="index"
          :date="item.date"
          :is-self="item.isSelf"
          :content="item.content"
          :avatar="item.avatar">
        </message>
      </div>
      <chat-input
      @send="send">
      </chat-input>
    </section>
  </section>
</template>

<script>
  import Message from '../../components/chat/Message'
  import ChatInput from '../../components/chat/ChatInput'
  import { TextMessage } from 'leancloud-realtime'
  import { getStore, removeStore } from '../../config/mUtils'
  import moment from 'moment'
  export default {
    data () {
      return {
        token: getStore('user') ? getStore('user').authentication_token : '',
        uuid: getStore('user') ? getStore('user').id : '',
        mySelf: getStore('user') || null,
        targetUser: null,
        type: this.$route.query.type,
        teamId: this.$route.query.teamId || '',
        productId: this.$route.query.productId || '',
        productName: this.$route.query.productName || '',
        productPrice: this.$route.query.productPrice || '',
        productImg: this.$route.query.productImg || '',
        targetUuid: this.$route.query.uuid,
        conversationId: this.$route.query.conversationId,
        currentUserDelegate: null,
        conversation: null,
        title: '',
        msg: null,
        msgs: []
      }
    },
    components: {
      Message,
      ChatInput
    },
    methods: {
      beforeGetConferences () {
        if (this.type === 'Product') {
          this.getConferences(this.teamId, this.productId)
        } else {
          this.getConferences()
        }
      },
      getConferences (teamId = '', productId = '') {
        this.$store.dispatch('commonAction', {
          url: '/im/conferences',
          method: 'post',
          params: {
          },
          data: {
            token: this.token,
            ...(teamId ? {team_id: teamId} : {}),
            ...(productId ? {product_id: productId} : {})
          },
          target: this,
          resolve: (state, res) => {
            this.conferences = res.data.conferences
            this.title = res.data.conferences.remark
            this.targetUser = res.data.conferences.members[0]
            this.init()
          },
          reject: () => {
          }
        })
      },
      getProductDetail () {
        this.$store.dispatch('commonAction', {
          url: `/products/${this.productId}`,
          method: 'get',
          params: {
            token: this.token,
            id: this.productId
          },
          target: this,
          resolve: (state, res) => {

          },
          reject: () => {
          }
        })
      },
      send (content) {
        if (content === '') {
          return false
        } else {
          this.sendContent(content)
        }
      },
      async sendContent (content) {
        let msg = new TextMessage(content)
        msg.setAttributes({
          fromLogo: this.mySelf.avatar_url,
          clazz: 'user',
          conversationType: 0,
          fromName: this.mySelf.home_name,
          iOS_toName: this.targetUser.display_name,
          username: this.mySelf.home_name,
          iOS_toURL: this.targetUser.avatar_url
        })
        let result = await this.conversation.send(msg)
        let tmpObj = {
          isSelf: true,
          content: content,
          name: this.mySelf.home_name,
          avatar: this.mySelf.avatar_url,
          date: moment(result.timestamp).format('YYYY-MM-DD HH:mm:ss')
        }
        this.msgs.push(tmpObj)
        document.body.scrollTop = document.body.scrollHeight
      },
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
        if (this.conferences && this.conferences.conversation_id) {
          this.conversation = await this.currentUserDelegate.getConversation(this.conferences.conversation_id)
        }
        let msgHistory = await this.conversation.queryMessages({limit: 1000})
        if (msgHistory) {
          this.handleHistoryMsg(msgHistory)
        }
        this.currentUserDelegate.on('message', message => {
          if (message.from === this.uuid) {
            return false
          } else {
            let tmpObj = {
              isSelf: false,
              content: message.content._lctext,
              name: this.targetUser.display_name,
              avatar: this.targetUser.avatar_url,
              date: moment(message.timestamp).format('YYYY-MM-DD HH:mm:ss')
            }
            this.msgs.push(tmpObj)
            document.body.scrollTop = document.body.scrollHeight
          }
        })
      },
      handleHistoryMsg (arr) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].from === this.uuid) {
            let tmpObj = {
              isSelf: true,
              content: arr[i].content._lctext,
              name: this.mySelf.home_name,
              avatar: this.mySelf.avatar_url,
              date: moment(arr[i].timestamp).format('YYYY-MM-DD HH:mm:ss')
            }
            this.msgs.push(tmpObj)
          } else {
            let tmpObj = {
              isSelf: false,
              content: arr[i].content._lctext,
              name: this.targetUser.display_name,
              avatar: this.targetUser.avatar_url,
              date: moment(arr[i].timestamp).format('YYYY-MM-DD HH:mm:ss')
            }
            this.msgs.push(tmpObj)
          }
        }
        document.body.scrollTop = document.body.scrollHeight
      },
      goBack () {
        if (getStore('Chat_goHome')) {
          removeStore('Chat_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      }
    },
    mounted () {
      this.beforeGetConferences()
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin.scss';

  .header {
    background-color: $green;
    @include px2rem(height, 88px);
    @include pm2rem(padding, 0px, 30px, 0px, 30px);
    @include font-dpr(17px);
    position: fixed;
    h1 {
      @include font-dpr(17px);
    }
    .button-text {
      @include font-dpr(15px);
    }
    i {
      @include font-dpr(20px);
    }
  }
  .product-info {
    display: flex;
    position: fixed;
    width: 100%;
    @include px2rem(top, 88px);
    @include pm2rem(padding, 20px, 30px, 20px, 30px);
    background-color: $white;
    z-index: 1;
    .img-container {
      @include px2rem(width, 120px);
      @include px2rem(height, 120px);
      @include px2rem(margin-right, 30px);
      img {
        width: 100%;
        height: 100%;
      }
    }
    .content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .name {
        @include font-dpr(15px);
      }
      .price {
        color: red;
      }
    }
  }
  .container {
    @include pm2rem(padding, 248px, 0px, 240px, 0px);
    background-color: #FAFAFA;
  }
</style>