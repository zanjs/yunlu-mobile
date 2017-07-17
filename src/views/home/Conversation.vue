<template>
  <section>
    <mt-header
      title="会话"
      fixed
      class="header">
      <mt-button
        slot="left"
        @click="goBack()"
        class="button-text">
        <i class="iconfont icon-fanhui"></i>
      </mt-button>
    </mt-header>
    <form
      class="search-bar"
      action="#">
      <input
        type="search"
        v-model="searchParams"
        @input="handleInput"
        @keyup.enter="handleSearchBtn"
        placeholder="搜索会话">
      <div
        v-show="searchParams"
        class="clear-btn"
        @click.stop="resetSearchBar()">
        <i class="iconfont icon-shanchubiaoqian"></i>
      </div>
      <div
        class="search-btn"
        @click.stop="searchConversation">
        <i class="iconfont icon-sousuo"></i>
      </div>
    </form>
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
    </template>
  </section>
</template>

<script>
  import { getStore, removeStore } from '../../config/mUtils'
  import ConversationList from '../../components/common/ConversatonList'
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        searchParams: '',
        token: getStore('user') ? getStore('user').authentication_token : '',
        hasChecked: false,
        checkAll: false,
        conversations: []
      }
    },
    components: {
      ConversationList
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
      handleSearchBtn () {
        document.activeElement.blur()
      },
      searchConversation () {

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
            state.conversationList = this.handleConversations(res.data.conferences, state.leanCloudConversations)
            this.conversations = this.handleConverstaionList(state.conversationList)
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
                remark: arr1[i].remark
              })
            }
          }
        }
        return tmpArr
      },
      handleConverstaionList (arr) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          tmpArr.push({
            ...arr[i],
            checked: false
          })
        }
        return tmpArr
      },
      goChat (item) {
        console.log(item)
      },
      handleItemCheck (item) {
        for (let i = 0; i < this.conversations.length; i++) {
          if (item.item.conversationId === this.conversations[i].conversationId) {
            this.conversations[i].checked = !item.checked
          }
        }
      },
      handleAllCheck () {

      },
      deleteConfirm () {

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
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #D1D1D1;
    background-color: $white;
    @include pm2rem(padding, 0px, 32px, 0px, 32px);
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
      @include pm2rem(padding, 2px, 100px, 0px, 30px);
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
      -webkit-appearance: none; // 此处只是去掉默认的小×
    }
    .clear-btn {
      position: absolute;
      @include px2rem(right, 140px);
      @include px2rem(height, 66px);
      display: flex;
      justify-content: flex-end;
      i {
        @include font-dpr(21px);
        color: #D1D1D1;
        @include px2rem(margin-top, -2px);
      }
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
    @include px2rem(padding-top, 176px);
  }
  .option-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    @include px2rem(height, 98px);
    @include pm2rem(padding, 0px, 22px, 0px, 28px);
    background-color: $white;
    border-top: 1px solid #D1D1D1;
    .check-btn {
      display: flex;
      align-items: center;
      height: inherit;
      @include px2rem(padding-right, 30px);
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
</style>
