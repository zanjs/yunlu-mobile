<template>
  <section>
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
        class="search-btn"
        @click.stop="searchConversation(searchParams)">
        <i class="iconfont icon-sousuo"></i>
      </div>
    </div>
    <template v-if="conversations && conversations.length > 0">
      <conversation-list
        class="list-container"
        :store="conversations"
        @click="goChat"
        @check="handleItemCheck">
      </conversation-list>
      <div class="option-bar">
        <div
          class="check-btn"
          @click="handleAllCheck(conversations, checkAll)">
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
          class="text-btn"
          @click="deleteConfirm()">
          删除
        </a>
        <div
          v-show="!hasChecked"
          class="text-btn btn-disabled">
          删除
        </div>
      </div>
      <confirm-dialog
        v-if="showConfirm"
        :msg="confirmMsg"
        @click="deleteItem">
      </confirm-dialog>
    </template>
    <template v-if="conversations && conversations.length === 0">
      <div class="empty-container">
        <div class="img-container">
          <img src="../../assets/noConversation.png">
        </div>
        <p>您还没发起任何会话呦~</p>
      </div>
    </template>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import { getStore, removeStore } from '../../config/mUtils'
  import ConversationList from '../../components/common/ConversatonList'
  import ConfirmDialog from '../../components/common/ConfirmDialog'
  import { mapGetters } from 'vuex'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        header: '会话',
        searchParams: '',
        token: getStore('user') ? getStore('user').authentication_token : '',
        uuid: getStore('user') ? getStore('user').id : '',
        hasChecked: false,
        checkAll: false,
        conversations: [],
        showConfirm: false,
        confirmMsg: '确定要删除选中的会话吗?'
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
      handleInput () {
        if (this.searchParams === '') {
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
        let tmpArr = []
        for (let i = 0; i < this.conversations.length; i++) {
          if (this.conversations[i].remark.indexOf(params) > -1) {
            tmpArr.push(this.conversations[i])
          }
        }
        // this.$store.dispatch('searchConversation', params)
        this.conversations = tmpArr
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
            state.conversationList = this.handleConversations(res.data.conferences, getStore('leanCloudConversations'))
            this.conversations = [...state.conversationList]
          },
          reject: () => {
          }
        })
      },
      handleConversations (arr1, arr2) {
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
        for (let i = 0; i < this.conversations.length; i++) {
          if (item.item.conversationId === this.conversations[i].conversationId) {
            this.conversations[i].checked = !item.checked
            this.isAllChecked(this.conversations)
          }
        }
      },
      isAllChecked (arr) {
        let count = 0
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].checked) {
            count += 1
          }
        }
        this.hasChecked = count > 0
        this.checkAll = count === arr.length
      },
      handleAllCheck (items, bool) {
        for (let i = 0; i < items.length; i++) {
          items[i].checked = !bool
        }
        this.checkAll = this.hasChecked = !bool
      },
      deleteConfirm () {
        this.showConfirm = true
      },
      deleteItem (bool) {
        this.showConfirm = false
        if (bool) {
          this.handleDeleteConversations(this.conversations)
        }
      },
      handleDeleteConversations (arr) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].checked) {
            tmpArr.push(arr[i].conversationId)
          }
        }
        this.removeConversation(tmpArr)
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
              this.getConversationList()
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
      }
    },
    mounted () {
      this.getConversationList()
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

  .header {
    background-color: $green;
    @include px2rem(height, 88px);
    @include pm2rem(padding, 0px, 30px, 0px, 30px);
    @include font-dpr(17px);
    position: fixed;
    z-index: 1002 !important;
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
  .search-bar {
    position: fixed;
    @include px2rem(height, 88px);
    @include px2rem(top, 88px);
    width: 100%;
    max-width: 540px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #D1D1D1;
    background-color: $white;
    z-index: 2;
    input {
      width: 100%;
      border: none;
      @include font-dpr(14px);
      @include px2rem(border-radius, 14px);
      line-height: 1;
      background-color: #EDEDED;
      color: #595959;
      @include px2rem(height, 66px);
      @include pm2rem(margin, 0px, 32px, 0px, 32px);
      @include pm2rem(padding, 0px, 100px, 0px, 30px);
      vertical-align: middle;
      text-align: left;
    }
    ::-webkit-input-placeholder{
      color: #C2C2C2;
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
      position: absolute;
      @include px2rem(right, 60px);
      @include px2rem(height, 66px);
      top: 50%;
      transform: translateY(-50%);
      color: #B4B4B4;
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        @include px2rem(padding-top, 4px);
      }
    }
  }
  .list-container {
    @include pm2rem(padding, 176px, 0px, 98px, 0px);
  }
  .option-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    width: 100%;
    max-width: 540px;
    @include px2rem(height, 98px);
    background-color: $white;
    border-top: 1px solid #D1D1D1;
    .check-btn {
      display: flex;
      align-items: center;
      height: inherit;
      @include pm2rem(padding, 0px, 30px, 0px, 28px);
      line-height: 1;
      i {
        @include font-dpr(18px);
        color: #D1D1D1;
        @include px2rem(margin-right, 12px);
      }
      p {
        @include font-dpr(16px);
        color: #595959;
      }
      .checked {
        color: #52CAA7;
      }
    }
    .text-btn {
      @include px2rem(width, 150px);
      @include px2rem(height, 70px);
      @include px2rem(border-radius, 40px);
      @include px2rem(margin-right, 28px);
      background-color: #52CAA7;
      color: $white;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      @include font-dpr(15px);
    }
    a:active {
      background-color: rgba(82, 202, 167, .5);
    }
    .btn-disabled {
      background-color: #DEDEDE;
    }
  }
  .empty-container {
    @include pm2rem(padding, 176px, 0px, 0px, 0px);
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
      color: #A6A6A6;
      text-align: center;
    }
  }
</style>
