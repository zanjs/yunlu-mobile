<template>
  <section>
    <div class="search-bar full-width">
      <div
        class="search-input"
        @click="goRoute('SearchProducts', true)">
        <a class="text font-14 white-bg">任你搜 任意搜</a>
        <i class="iconfont icon-sousuo absolute-vertical"></i>
      </div>
      <i
        v-if="hasLogin"
        class="iconfont icon-geren icon-btn white"
        @click="goRoute('Mine', true)"></i>
      <p v-else
         @click="goRoute('Login', false)"
         class="icon-btn login-btn white">登录|注册</p>
    </div>
    <div class="option-bars">
      <img src="../../assets/seeBg.png">
      <div class="flex-between row">
        <div class="flex-between row-item"
             @click="goRoute('Download', true)">
          <div class="icon-box box-1 flex">
            <i class="iconfont icon-liucheng"></i>
          </div>
          <span class="font-14">流程</span>
        </div>
        <div class="flex-between row-item"
             @click="goRoute('Conversation', hasLogin)">
          <div class="icon-box box-2 flex">
            <i class="iconfont icon-huihua"></i>
            <div
              v-if="unReadeMsgs.length > 0"
              class="dot second-bg"></div>
          </div>
          <span class="font-14">会话</span>
        </div>
        <div class="flex-between row-item"
             @click="goRoute('ShoppingCart', hasLogin)">
          <div class="icon-box box-3 flex">
            <i class="iconfont icon-gouwuche1"></i>
          </div>
          <span class="font-14">购物车</span>
        </div>
        <div class="flex-between row-item"
             @click="goRoute('Favorites', hasLogin)">
          <div class="icon-box box-4 flex">
            <i class="iconfont icon-shoucang1"></i>
          </div>
          <span class="font-14">收藏</span>
        </div>
      </div>
    </div>
    <div class="carte-container">
      <img
        src="../../assets/seeCardBg.png"
        class="card-bg absolute-horizontal">
      <img
        src="../../assets/send.png"
        @click="send()"
        class="send absolute-horizontal">
      <div
        class="flex avatar-container absolute-horizontal"
        @click="send()">
        <img
          v-if="!hasLogin || !card"
          src="../../assets/userAvatarSmall.png"
          class="user-avatar">
        <template v-else>
          <img
            v-if="!enterpriseOwner"
            :src="card.avatar_url"
            class="user-avatar">
          <img
            v-else
            :src="seeCard.logo_url"
            class="user-avatar">
        </template>
      </div>
      <p
        v-if="!hasLogin || !card"
        class="user-name font-16 second-text absolute-horizontal"
        @click="send()">
        胖胖的云庐君
      </p>
      <template v-else>
        <p
          v-if="!enterpriseOwner"
          class="user-name font-16 second-text absolute-horizontal"
          @click="send()">{{card.home_name}}</p>
        <p
          v-else
          class="user-name font-16 second-text absolute-horizontal">{{seeCard.name}}</p>
      </template>
    </div>
    <div class="flex-between card-wrapper">
      <div
        class="card flex"
        @click="searchEnterprise()">
        <img
          src="../../assets/enterprise.png"
          class="full-cover">
        <div class="content flex">
          <div class="left-border"></div>
          <p class="name font-15 white">企业</p>
          <div class="right-border"></div>
        </div>
      </div>
      <div
        v-for="(item, index) in clientKeyWrods"
        :key="index"
        class="card flex"
        @click="searchEnterprise(item.keyword)">
        <img
          src="../../assets/seeKeyWrodCardBg.png"
          class="full-cover">
        <div class="content flex">
          <div class="left-border"></div>
          <p class="name font-15 white">{{item.keyword}}</p>
          <div class="right-border"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getStore, removeStore } from '../../config/mUtils'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        hasLogin: !!getStore('user'),
        enterpriseOwner: false,
        card: getStore('user'),
        token: getStore('user') ? getStore('user').authentication_token : '',
        clientKeyWrods: []
      }
    },
    methods: {
      goRoute (route, bool) {
        this.$router.push({name: bool ? route : 'Login'})
      },
      send () {
        if (this.hasLogin) {
          Toast({
            message: '暂未开放',
            duration: 500
          })
        } else {
          this.$router.push({name: 'Login'})
        }
      },
      searchEnterprise (keyword = '') {
        this.$router.push({name: 'SearchEnterprise', ...(keyword ? {query: {q: keyword}} : {})})
      },
      getSpaces () {
        this.$store.dispatch('commonAction', {
          url: '/spaces',
          method: 'get',
          params: {
            token: this.token
          },
          target: this,
          resolve: (state, res) => {
            let arr = this.handleSeeCard(res.data)
            this.enterpriseOwner = arr.length > 0
            if (arr.length === 0) {
              state.seeCard = getStore('user')
            } else {
              state.seeCard = arr[0]
            }
          },
          reject: () => {
          }
        })
      },
      handleSeeCard (arr) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].organization_state && arr[i].organization_state === 'approved') {
            tmpArr.push(arr[i])
          }
        }
        return tmpArr
      },
      getClientKeyWords () {
        this.$store.dispatch('commonAction', {
          url: '/client_keywords',
          method: 'get',
          params: {
            token: this.token
          },
          target: this,
          resolve: (state, res) => {
            this.clientKeyWrods = this.handleKeyWords(res.data.keywords)
          },
          reject: () => {
          }
        })
      },
      handleKeyWords (arr) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].enterprises_count >= 100) {
            tmpArr.push(arr[i])
          }
        }
        return tmpArr
      },
      getSeeInfo () {
        if (this.hasLogin) {
          this.getClientKeyWords()
          this.getSpaces()
        }
      }
    },
    mounted () {
      removeStore('showGoHome')
      this.getSeeInfo()
    },
    computed: {
      ...mapGetters([
        'user',
        'unReadeMsgs',
        'seeCard'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .search-bar {
    display: flex;
    align-items: center;
    position: fixed;
    top: 0;
    z-index: 999;
    @include px2rem(height, 114px);
    background: url("../../assets/homePageTopBg.png");
    background-repeat: no-repeat;
    background-size: cover;
    .search-input {
      position: relative;
      flex: 1;
      z-index: 1000;
      @include px2rem(height, 70px);
      @include pm2rem(padding, 22px, 0px, 22px, 0px);
      @include pm2rem(margin, 0px, 44px, 0px, 55px);
      .text {
        color: $eighth-grey;
        border: none;
        display: flex;
        @include px2rem(height, 70px);
        @include px2rem(border-radius, 40px);
        @include pm2rem(padding, 0px, 20px, 0px, 102px);
        align-items: center;
        line-height: normal;
      }
      i {
        color: $eleventh-grey;
        @include font-dpr(21px);
        @include px2rem(left, 40px);
      }
    }
    .icon-btn {
      @include font-dpr(26px);
      z-index: 1000;
      @include pm2rem(margin, 0px, 30px, 0px, 0px);
    }
    .login-btn {
      @include font-dpr(14px);
    }
  }
  .option-bars {
    position: relative;
    @include pm2rem(padding, 114px, 0px, 0px, 0px);
    img {
      @include px2rem(height, 313px);
      width: 100%;
    }
    .row {
      position: absolute;
      @include px2rem(top, 114px);
      left: 0;
      right: 0;
      z-index: 1;
      @include pm2rem(padding, 16px, 55px, 30px, 55px);
      .row-item {
        flex-direction: column;
        align-items: center;
        .icon-box {
          @include px2rem(height, 94px);
          @include px2rem(width, 94px);
          @include px2rem(border-radius, 57px);
          @include pm2rem(margin, 0px, 0px, 16px, 0px);
          box-shadow: 0px 2px 6px rgba(128, 128, 128, .5);
          position: relative;
          .dot {
            @include px2rem(width, 16px);
            @include px2rem(height, 16px);
            @include px2rem(border-radius, 8px);
            position: absolute;
            @include px2rem(top, 0px);
            @include px2rem(right, -10px);
          }
          i {
            @include font-dpr(27px);
            color: $white;
          }
        }
        span {
          color: #246451;
        }
        .box-1 {
          background: linear-gradient(to bottom, #FEBEBE , #EE75C5);
        }
        .box-2 {
          background: linear-gradient(to bottom, #FFDD9C , #FDA698);
        }
        .box-3 {
          background: linear-gradient(to bottom, #ECB1FF , #959DFF);
        }
        .box-4 {
          background: linear-gradient(to bottom, #C6D7FF , #32BBD8);
        }
      }
    }
  }
  .carte-container {
    @include pm2rem(margin, -130px, 0px, 0px, 0px);
    position: relative;
    .card-bg {
      @include px2rem(height, 328px);
      @include px2rem(width, 658px);
    }
    .send {
      @include px2rem(width, 221px);
      @include px2rem(height, 78px);
      @include px2rem(bottom, -294px);
    }
    .avatar-container {
      border-color: #9CE7A0;
      @include px2rem(top, 30px);
      @include px2rem(border-width, 2px);
      @include px2rem(width, 120px);
      @include px2rem(height, 120px);
      @include px2rem(border-radius, 65px);
      border-style: solid;
      .user-avatar {
        @include px2rem(width, 108px);
        @include px2rem(height, 108px);
        @include px2rem(border-radius, 54px);
      }
    }
    .user-name {
      @include px2rem(top, 160px);
    }
  }
  .card-wrapper {
    @include px2rem(margin-top, 350px);
    @include pm2rem(padding, 28px, 26px, 100px, 26px);
    border-top: 4px solid $primary-grey;
    flex-wrap: wrap;
    .card {
      position: relative;
      @include px2rem(border-radius, 10px);
      @include px2rem(margin-bottom, 22px);
      @include px2rem(width, 340px);
      @include px2rem(height, 188px);
      box-shadow: 0 1px 5px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12);
      .content {
        position: relative;
        div {
          @include px2rem(width, 12px);
          @include px2rem(height, 40px);
          border: 1px solid $white;
        }
        p {
          @include px2rem(line-height, 50px);
        }
        .left-border {
          border-right: none;
        }
        .right-border {
          border-left: none;
        }
      }
    }
  }
</style>
