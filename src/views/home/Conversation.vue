<template>
  <section class="full-width">
    <common-header
      :title="header"
      @back="goBack()">
    </common-header>
    <div class="search-bar">
      <input
        type="search"
        v-model="searchParams"
        @input="handleInput"
        @keyup.enter="handleSearch"
        placeholder="搜索会话">
      <div
        class="search-btn absolute-vertical flex"
        @click.stop="searchConversation(searchParams)">
        <i class="iconfont icon-sousuo"></i>
      </div>
    </div>
    <section class="list-container" ref="conversation" :style="{height: scrollHeight}">
      <template v-if="conversationList && conversationList.length > 0">
        <conversation-list
          :store="conversationList"
          @click="goChat"
          @check="handleItemCheck">
        </conversation-list>
      </template>
      <template v-if="conversationList && conversationList.length === 0">
        <div class="empty-container">
          <div class="img-container">
            <img src="../../assets/noConversation.png">
          </div>
          <p>您还没发起任何会话呦~</p>
        </div>
      </template>
    </section>
    <template v-if="conversationList && conversationList.length > 0">
      <div class="option-bar full-width">
        <div
          class="check-btn"
          @click="handleAllCheck(conversationList, checkAll)">
          <i
            v-if="!checkAll"
            class="iconfont icon-weixuanzhong"></i>
          <i
            v-if="checkAll"
            class="iconfont icon-xuanzhong checked">
            </i>
          <p>全选</p>
        </div>
        <a
          v-show="hasChecked"
          class="flex text-btn"
          @click="deleteConfirm()">
          删除
        </a>
        <div
          v-show="!hasChecked"
          class="flex text-btn btn-disabled">
          删除
        </div>
      </div>
      <confirm-dialog
        v-if="showConfirm"
        :msg="confirmMsg"
        @click="deleteItem">
      </confirm-dialog>
    </template>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import { getStore, removeStore, setScrollTop } from '../../config/mUtils'
  import { requestFn } from '../../config/request'
  import ConversationList from '../../components/common/ConversatonList'
  import ConfirmDialog from '../../components/common/ConfirmDialog'
  import { mapGetters } from 'vuex'
  import moment from 'moment'
  import { Toast } from 'mint-ui'
  export default {
    name: 'Conversation',
    data () {
      return {
        header: '会话',
        searchParams: '',
        token: getStore('user') ? getStore('user').authentication_token : '',
        uuid: getStore('user') ? getStore('user').id : '',
        hasChecked: false,
        checkAll: false,
        showConfirm: false,
        confirmMsg: '确定要删除选中的会话吗?',
        scrollHeight: '15rem'
      }
    },
    components: {
      CommonHeader,
      ConversationList,
      ConfirmDialog
    },
    methods: {
      goBack () {
        if (getStore('Conversation_goHome')) {
          removeStore('Conversation_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      handleInput (e) {
        if (e.target.value === '') {
          this.resetSearchBar()
        }
      },
      resetSearchBar () {
        this.searchParams = ''
        this.hasChecked = false
        this.hasSearch = false
        this.getConversationList()
      },
      handleSearch () {
        this.searchConversation(this.searchParams)
        document.activeElement.blur()
      },
      searchConversation (params) {
        this.$store.dispatch('searchConversation', params)
      },
      getConversationList () {
        this.$store.dispatch('commonAction', {
          url: '/im/conferences',
          method: 'get',
          params: {
            token: this.token
          },
          target: this,
          resolve: (state, res) => {
            state.yunLuConversations = res.data.conferences
            state.originConversationList = this.handleConversations(res.data.conferences, state.leanCloudConversations || [], getStore('unReadMsgs') || [])
            state.originConversationList.sort((a, b) => {
              return moment(b.timestamp).isAfter(a.timestamp) ? 1 : -1
            })
            state.conversationList = [...state.originConversationList]
          },
          reject: () => {
          }
        })
      },
      async getClosedConversationList () {
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
      },
      handleConversations (arr1, arr2, arr3) {
        let tmpArr = []
        for (let i = 0; i < arr1.length; i++) {
          for (let j = 0; j < arr2.length; j++) {
            if (arr1[i].conversation_id === arr2[j].conversationId) {
              tmpArr.push({
                ...arr2[j],
                linkType: arr1[i].link_type,
                linkId: arr1[i].link_id,
                remark: arr1[i].remark,
                logoUrl: arr1[i].logo_url,
                checked: false
              })
            }
          }
        }
        for (let i = 0; i < arr3.length; i++) {
          for (let j = 0; j < tmpArr.length; j++) {
            if (arr3[i].id === tmpArr[j].conversationId) {
              tmpArr[j].hasRead = false
            }
          }
        }
        return tmpArr
      },
      goChat (item) {
        if (item.linkType === 'Product') {
          this.$router.push({name: 'Chat', query: {type: 'Product', productId: item.linkId}})
        } else if (item.linkType !== 'Product') {
          this.$router.push({name: 'Chat', query: {type: item.linkType, linkId: item.linkId, conversationId: item.conversationId}})
        }
      },
      handleItemCheck (item) {
        this.$store.dispatch('checkConversation', {
          item: {...item},
          resolve: (arr) => {
            let count = 0
            for (let i = 0; i < arr.length; i++) {
              if (arr[i].checked) {
                count += 1
              }
            }
            this.hasChecked = count > 0
            this.checkAll = count === arr.length
          }
        })
      },
      handleAllCheck (items, bool) {
        this.$store.dispatch('checkAllConversation', {
          items: items,
          checked: bool
        })
        this.checkAll = this.hasChecked = !bool
      },
      deleteConfirm () {
        this.showConfirm = true
      },
      deleteItem (bool) {
        this.showConfirm = false
        if (bool) {
          this.$store.dispatch('handleDeleteConversations', {
            resolve: ids => {
              this.removeConversation(ids)
            }
          })
        }
      },
      removeConversation (ids) {
        this.$store.dispatch('commonAction', {
          url: '/im/conferences/all',
          method: 'delete',
          params: {},
          data: {
            token: this.token,
            ids: ids
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.success) {
              this.markRead(ids)
              this.getConversationList()
              this.getClosedConversationList()
              Toast({
                message: '删除成功',
                duration: 500
              })
            }
          },
          reject: () => {
            Toast({
              message: '删除失败',
              duration: 500
            })
          }
        })
      },
      // 若删除的是未读消息，需要把被删除的未读消息，变为已读
      markRead (arr) {
        for (let i = 0; i < arr.length; i++) {
          this.$store.dispatch('markAsRead', {type: 'delete', data: {id: arr[i]}})
        }
      },
      handleScrollHeight () {
        let appHeight = document.getElementById('app').offsetHeight
        let rootFontSize = document.documentElement.style.fontSize.split('p')[0]
        let divHeight = (appHeight / parseFloat(rootFontSize + '')).toFixed(2)
        this.scrollHeight = `${Math.round(divHeight * 100) / 100}rem`
      }
    },
    mounted () {
      this.handleScrollHeight()
    },
    activated () {
      this.getConversationList() // 不管是进如会话列表页面还是返回到会话列表页面，统一获取最新数据(更新未读状态及列表顺序)。列表顺序可能有误差。（因为leancloud中的_lastmessageAt部分数据为空，用_updatedAt代替，而_updatedAt并不是会话最新时间。）
      if (!this.$store.state.popState) {
        this.uuid = getStore('user') ? getStore('user').id : ''
        this.token = getStore('user') ? getStore('user').authentication_token : null
        setScrollTop(0, this.$refs.conversation)
      } else {
        setScrollTop(this.$store.state.scrollMap.Conversation || 0, this.$refs.conversation)
      }
    },
    beforeRouteLeave (to, from, next) {
      this.$store.dispatch('saveScroll', {name: 'Conversation', value: this.$refs.conversation.scrollTop})
      next()
    },
    computed: {
      ...mapGetters([
        'userDelegate',
        'conversationList'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .search-bar {
    position: fixed;
    @include px2rem(height, 88px);
    @include px2rem(top, 88px);
    width: 100%;
    max-width: 540px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid $fifth-grey;
    background-color: $white;
    z-index: 2;
    input {
      width: 100%;
      border: none;
      @include font-dpr(14px);
      @include px2rem(border-radius, 14px);
      line-height: normal;
      background-color: $ninth-grey;
      color: $second-dark;
      @include px2rem(height, 66px);
      @include pm2rem(margin, 0px, 32px, 0px, 32px);
      @include pm2rem(padding, 0px, 100px, 0px, 30px);
      vertical-align: middle;
      text-align: left;
    }
    ::-webkit-input-placeholder{
      color: $eighth-grey;
      @include px2rem(height, 66px);
      vertical-align: middle;
      text-align: left;
      border: none;
      @include font-dpr(14px);
      line-height: 1;
    }
    input[type=search]::-webkit-search-cancel-button {
      -webkit-appearance: none;
    }
    .search-btn {
      @include px2rem(right, 60px);
      @include px2rem(height, 66px);
      color: $eleventh-grey;
      i {
        @include px2rem(padding-top, 4px);
      }
    }
  }
  .list-container {
    position: relative;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    margin-bottom: 1px;
    @include pm2rem(padding, 176px, 0px, 98px, 0px);
    box-sizing: border-box;
  }
  .option-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    @include px2rem(height, 98px);
    background-color: $white;
    border-top: 1px solid $fifth-grey;
    .check-btn {
      display: flex;
      align-items: center;
      height: inherit;
      @include pm2rem(padding, 0px, 30px, 0px, 28px);
      line-height: 1;
      i {
        @include font-dpr(18px);
        color: $fifth-grey;
        @include px2rem(margin-right, 12px);
      }
      p {
        @include font-dpr(16px);
        color: $second-dark;
      }
      .checked {
        color: $green;
      }
    }
    .text-btn {
      @include px2rem(width, 150px);
      @include px2rem(height, 70px);
      @include px2rem(border-radius, 40px);
      @include px2rem(margin-right, 28px);
      background-color: $green;
      color: $white;
      line-height: 1;
      @include font-dpr(15px);
    }
    a:active {
      background-color: rgba(82, 202, 167, .5);
    }
    .btn-disabled {
      background-color: $fourth-grey;
    }
  }
  .empty-container {
    .img-container {
      @include pm2rem(padding, 90px, 0px, 40px, 0px);
      text-align: center;
      img {
        @include px2rem(width, 266px);
        @include px2rem(height, 342px);
      }
    }
    p {
      @include font-dpr(16px);
      color: $third-dark;
      text-align: center;
    }
  }
</style>
