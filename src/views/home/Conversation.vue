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
    <conversation-list>

    </conversation-list>
  </section>
</template>

<script>
  import { getStore, removeStore } from '../../config/mUtils'
  import ConversationList from '../../components/common/ConversatonList'
  export default {
    data () {
      return {
        searchParams: ''
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

      }
    },
    mounted () {
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
</style>
