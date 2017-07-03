<template>
  <section>
    <div class="search-bar">
      <img src="../../assets/homePageTopBg.png">
      <div class="search-input"
           @click="searchEnterprise()">
        <input type="text"
               placeholder="任你搜 任意搜">
        <i class="iconfont icon-sousuo"></i>
      </div>
      <i v-if="hasLogin"
         class="iconfont icon-geren icon-btn"
         @click="goMine()"></i>
      <p v-else
         @click="goLogin()"
         class="icon-btn login-btn">登录|注册</p>
    </div>
    <div class="option-bars">
      <img src="../../assets/seeBg.png">
      <div class="row">
        <div class="row-item"
             @click="goDownload()">
          <div class="icon-box box-1">
            <i class="iconfont icon-liucheng"></i>
          </div>
          <span>流程</span>
        </div>
        <div class="row-item"
             @click="goDownload()">
          <div class="icon-box box-2">
            <i class="iconfont icon-huihua"></i>
          </div>
          <span>会话</span>
        </div>
        <div class="row-item"
             @click="goDownload()">
          <div class="icon-box box-3">
            <i class="iconfont icon-gouwuche1"></i>
          </div>
          <span>购物车</span>
        </div>
        <div class="row-item"
             @click="goDownload()">
          <div class="icon-box box-4">
            <i class="iconfont icon-shoucang1"></i>
          </div>
          <span>收藏</span>
        </div>
      </div>
    </div>
    <div class="carte-container">
      <img src="../../assets/seeCardBg.png"
           class="white-bg">
      <img src="../../assets/send.png"
           @click="send()"
           class="send">
      <div class="avatar-container"
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
      <p v-if="!hasLogin || !card"
          class="user-name"
          @click="send()">
        胖胖的云庐君
      </p>
      <template v-else>
        <p v-if="!enterpriseOwner"
           class="user-name"
           @click="send()">{{card.home_name}}</p>
        <p v-else
           class="user-name">{{seeCard.name}}</p>
      </template>
    </div>
    <div class="card-container">
      <div class="card"
           @click="searchEnterprise()">
        <img src="../../assets/enterprise.png"
             class="card-img">
        <div class="content">
          <div class="left-border"></div>
          <p class="name">企业</p>
          <div class="right-border"></div>
        </div>
      </div>
      <div
        v-for="(item, index) in clientKeyWrods"
        :key="index"
        class="card"
        @click="searchEnterprise(item.keyword)">
        <img src="../../assets/seeKeyWrodCardBg.png"
             class="card-img">
        <div class="content">
          <div class="left-border"></div>
          <p class="name">{{item.keyword}}</p>
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
      goMine () {
        this.$router.push({name: 'Mine'})
      },
      goDownload () {
        this.$router.push({name: 'Download'})
      },
      goLogin () {
        this.$router.push({name: 'Login'})
      },
      send () {
        if (this.hasLogin) {
          Toast('暂未开放')
        } else {
          this.$router.push({name: 'Login'})
        }
      },
      searchEnterprise (keyword = '') {
        this.$router.push({name: 'SearchEnterprise', query: {q: keyword}})
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
        // 'clientKeyWrods',
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
    left: 0;
    right: 0;
    z-index: 999;
    img {
      position: fixed;
      top: 0;
      @include px2rem(height, 114px);
      width: 100%;
      z-index: 999;
    }
    .search-input {
      position: relative;
      flex: 1;
      z-index: 1000;
      display: flex;
      justify-content: center;
      align-content: center;
      @include px2rem(height, 70px);
      @include pm2rem(padding, 22px, 0px, 22px, 0px);
      @include pm2rem(margin, 0px, 44px, 0px, 55px);
      input {
        color: #B4B4B4;
        border: none;
        width: 100%;
        @include px2rem(border-radius, 40px);
        @include pm2rem(padding, 8px, 20px, 0px, 102px);
        @include font-dpr(14px);
        line-height: 1;
      }
      ::-webkit-input-placeholder{
        color: #C2C2C2;
        @include px2rem(padding-top, 2px);
      }
      i {
        position: absolute;
        color: #B4B4B4;
        @include font-dpr(21px);
        @include px2rem(padding-top, 8px);
        @include px2rem(left, 40px);
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .icon-btn {
      @include font-dpr(26px);
      color: $white;
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
      display: flex;
      position: absolute;
      @include px2rem(top, 114px);
      left: 0;
      right: 0;
      z-index: 1;
      justify-content: space-between;
      @include pm2rem(padding, 16px, 55px, 30px, 55px);
      .row-item {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        .icon-box {
          @include px2rem(height, 94px);
          @include px2rem(width, 94px);
          @include px2rem(border-radius, 57px);
          @include pm2rem(margin, 0px, 0px, 16px, 0px);
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0px 2px 6px rgba(128, 128, 128, .5);
          i {
            @include font-dpr(27px);
            color: $white;
          }
        }
        span {
          @include font-dpr(14px);
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
    .white-bg {
      @include px2rem(height, 328px);
      @include px2rem(width, 658px);
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
    .send {
      position: absolute;
      @include px2rem(width, 221px);
      @include px2rem(height, 78px);
      left: 50%;
      transform: translateX(-50%);
      @include px2rem(bottom, -294px);
    }
    .avatar-container {
      border-color: #9CE7A0;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      @include px2rem(top, 30px);
      @include px2rem(border-width, 2px);
      @include px2rem(width, 120px);
      @include px2rem(height, 120px);
      @include px2rem(border-radius, 65px);
      border-style: solid;
      display: flex;
      justify-content: center;
      align-items: center;
      .user-avatar {
        @include px2rem(width, 108px);
        @include px2rem(height, 108px);
        @include px2rem(border-radius, 54px);
      }
    }
    .user-name {
      @include font-dpr(16px);
      color: #595959;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      @include px2rem(top, 160px);
    }
  }
  .card-container {
    @include px2rem(margin-top, 350px);
    @include pm2rem(padding, 28px, 26px, 100px, 26px);
    border-top: 1px solid #DEDEDE;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .card {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      box-shadow: 0px 3px 6px rgba(125, 119, 119, .5);
      @include px2rem(border-radius, 10px);
      @include px2rem(margin-bottom, 22px);
      @include px2rem(width, 340px);
      @include px2rem(height, 188px);
      .card-img {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: inherit;
        height: inherit;
      }
      .content {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        div {
          @include px2rem(width, 12px);
          @include px2rem(height, 40px);
          border: 1px solid $white;
        }
        p {
          color: $white;
          @include font-dpr(15px);
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
