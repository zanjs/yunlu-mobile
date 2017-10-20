<template>
  <section>
    <common-header
      :title="title"
      @back="goBack()">
    </common-header>
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
    <section
      class="container"
      v-bind:class="{'product-container': type === 'Product'}">
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
      <chat-input @send="send">
      </chat-input>
    </section>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
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
        type: this.$route.query.type,
        teamId: '',
        productId: this.$route.query.productId || '',
        linkId: this.$route.query.linkId || '',
        conversationId: this.$route.query.conversationId || '',
        productName: '',
        productPrice: '',
        productImg: '',
        currentUserDelegate: null,
        conversation: null,
        title: '',
        msg: null,
        msgs: [],
        hasDestory: false
      }
    },
    components: {
      CommonHeader,
      Message,
      ChatInput
    },
    methods: {
      beforeGetConferences () {
        if (this.type === 'Product') {
          this.getProductDetail()
        } else if (this.conversationId) {
          this.getConversations(this.conversationId)
        } else {
          this.createConferences(this.teamId, this.productId, this.linkId, this.type)
        }
      },
      getConversations (conversationId = '') {
        this.$store.dispatch('commonAction', {
          url: `/im/conferences/${conversationId}/detail`,
          method: 'get',
          params: {
            token: this.token,
            conv_id: conversationId
          },
          target: this,
          resolve: (state, res) => {
            this.conferences = res.data.conferences
            this.title = res.data.conferences.clazz === 'group' ? `${res.data.conferences.remark}(${res.data.conferences.members.length})` : res.data.conferences.remark
            this.init()
          },
          reject: () => {
          }
        })
      },
      createConferences (teamId = '', productId = '', linkId = '', type = this.type) {
        let linkParams = {}
        if (type === 'Stranger') {
          linkParams = {...(linkId ? {stranger_id: parseInt(linkId + '')} : {})}
        } else if (type === 'User') {
          linkParams = {...(linkId ? {user_id: linkId} : {})}
        }
        this.$store.dispatch('commonAction', {
          url: '/im/conferences',
          method: 'post',
          params: {
          },
          data: {
            token: this.token,
            ...(teamId ? {team_id: teamId} : {}),
            ...(productId ? {product_id: productId} : {}),
            ...linkParams
          },
          target: this,
          resolve: (state, res) => {
            this.conferences = res.data.conferences
            this.title = res.data.conferences.remark
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
            this.teamId = res.data.products.organization_id
            this.productName = res.data.products.name
            this.productPrice = res.data.products.prices[0].money
            this.getFilesPublisheds([res.data.products.files[0].file_id])
          },
          reject: () => {
          }
        })
      },
      getFilesPublisheds (ids) {
        this.$store.dispatch('commonAction', {
          url: '/links/files/publisheds',
          method: 'get',
          params: {
            type: 'product',
            thumbs: ['general'],
            ids: ids
          },
          target: this,
          resolve: (state, res) => {
            this.createConferences(this.teamId, this.productId, this.linkId, this.type)
            this.productImg = res.data.files[0].thumb_urls[0]
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
          username: this.mySelf.home_name
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
        this.$nextTick(() => {
          document.documentElement.scrollTop = document.body.scrollTop = document.documentElement.scrollHeight || document.body.scrollHeight
        })
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
          if (this.conversation && !this.hasDestory) {
            await this.conversation.read()
            this.$store.dispatch('markAsRead', this.conversation)
            console.log('进入聊天页面，将该会话相关的未读消息变为已读。')
            let msgHistory = await this.conversation.queryMessages({limit: 1000})
            if (msgHistory) {
              this.handleHistoryMsg(msgHistory)
            }
          }
        }
        this.currentUserDelegate.on('message', message => {
          if (message.from === this.uuid) {
            return false
          } else if (this.conferences && this.conferences.conversation_id && message.cid === this.conferences.conversation_id) {
            let tmpObj = {
              isSelf: false,
              content: message.content._lctext,
              name: message.content.clazz === 'group' ? message.content._lcattrs.name : message.content._lcattrs.fromName, // 早期部分群聊消息中没有fromName字段
              avatar: message.content._lcattrs.fromLogo, // 早期部分群聊消息中没有fromLogo字段,需在组件中给出默认头像
              date: moment(message.timestamp).format('YYYY-MM-DD HH:mm:ss')
            }
            if (this.conversation) {
              this.conversation.read().then(conversation => {
                if (!this.hasDestory) {
                  this.$store.dispatch('markAsRead', this.conversation)
                  console.log('在聊天界面接收新消息，并将接收到的消息标为已读')
                }
              }).catch(console.error.bind(console))
            }
            this.msgs.push(tmpObj)
            this.$nextTick(() => {
              document.documentElement.scrollTop = document.body.scrollTop = document.documentElement.scrollHeight || document.body.scrollHeight
            })
          } else {
            // 非当前会话，不做处理
          }
        })
      },
      handleHistoryMsg (arr) {
        for (let i = 0; i < arr.length; i++) {
          let logoUrl = ''
          for (let j = 0; j < this.conferences.members.length; j++) {
            if (arr[i].from === this.conferences.members[j].uuid) {
              logoUrl = this.conferences.members[j].avatar_url
              break
            }
          }
          if (arr[i].from === this.uuid) {
            let tmpObj = {
              isSelf: true,
              content: arr[i].content._lctext,
              name: this.mySelf.home_name,
              avatar: logoUrl,
              date: moment(arr[i].timestamp).format('YYYY-MM-DD HH:mm:ss')
            }
            this.msgs.push(tmpObj)
          } else {
            let tmpObj = {
              isSelf: false,
              content: arr[i].content._lctext,
              /* 1.历史遗留问题,早期部分群聊消息体中，没有fromName和fromLogo字段。
                 2.聊天记录中有图片时，消息类型为Message，此时没有自定义_lcattrs字段（消息类型为TextMessage时有此字段），取用content中的_lcattrs字段。
                 3.当聊天类型为单聊时，消息体中没有name字段，用fromName代替。
                 4.用户被移出群聊时，其聊天记录仍然存在，没有头像，需在组件中给出默认头像。 */
              name: arr[i].content._lcattrs.clazz === 'group' ? arr[i].content._lcattrs.name : arr[i].content._lcattrs.fromName,
              avatar: logoUrl,
              date: moment(arr[i].timestamp).format('YYYY-MM-DD HH:mm:ss')
            }
            this.msgs.push(tmpObj)
          }
        }
        this.$nextTick(() => {
          document.documentElement.scrollTop = document.body.scrollTop = document.documentElement.scrollHeight || document.body.scrollHeight
        })
      },
      goBack () {
        if (getStore('Chat_goHome')) {
          removeStore('Chat_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      destroyConverastion () {
        this.hasDestory = true
      }
    },
    mounted () {
      this.beforeGetConferences()
    },
    beforeDestroy () {
      this.destroyConverastion()
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin.scss';

  .product-info {
    display: flex;
    position: fixed;
    width: 100%;
    max-width: 540px;
    @include px2rem(top, 88px);
    @include pm2rem(padding, 20px, 0px, 20px, 0px);
    background-color: $white;
    z-index: 1;
    .img-container {
      @include px2rem(width, 120px);
      @include px2rem(height, 120px);
      @include pm2rem(margin, 0px, 30px, 0px, 30px);
      img {
        width: 100%;
        height: 100%;
      }
    }
    .content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      @include px2rem(margin-right, 30px);
      .name {
        @include font-dpr(15px);
      }
      .price {
        color: $red;
      }
    }
  }
  .container {
    @include pm2rem(padding, 128px, 0px, 240px, 0px);
  }
  .product-container {
    @include px2rem(padding-top, 248px);
  }
</style>
