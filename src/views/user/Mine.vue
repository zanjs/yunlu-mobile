<template>
  <section>
    <div class="user-info">
      <img src="../../assets/seeBg.png"
           class="info-bg">
      <i class="iconfont icon-fanhui"
         @click="goBack()"></i>
      <div class="content">
        {{currentUser.home_name}}
      </div>
    </div>
    <div class="user-avatar">
      <div class="circle">
        <img
          v-if="currentUser.avatar_url"
          :src="currentUser.avatar_url">
        <img
          v-else
          src="../../assets/userAvatarBig.png">
      </div>
    </div>
    <div class="menu-container">
      <a
        class="row-item"
        @click="contactUs()">
        <div class="box">
          <i class="iconfont icon-lianxifangshi"></i>
        </div>
        <div class="item">
          <span>联系我们</span>
          <i class="iconfont icon-fanhui arrow"></i>
        </div>
      </a>
      <a
        class="row-item"
        @click="helpCenter()">
        <div class="box">
          <i class="iconfont icon-bangzhuzhongxin"></i>
        </div>
        <div class="item">
          <span>帮助中心</span>
          <i class="iconfont icon-fanhui arrow"></i>
        </div>
      </a>
      <a
        class="row-item"
        @click="openProtocol()">
        <div class="box">
          <i class="iconfont icon-fuwutiaokuan"></i>
        </div>
        <div class="item">
          <span>云庐使用条款和隐私政策</span>
          <i class="iconfont icon-fanhui arrow"></i>
        </div>
      </a>
    </div>
    <div class="logout-btn">
      <a
        class="flex"
        @click="logOut()">
        退出登录
      </a>
    </div>
    <div class="copyright">
      <p>云庐数据&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;版权所有</p>
      <p>Copyright&copy;2017-2019&nbsp;&nbsp;&nbsp;&nbsp;Yunlu&nbsp;&nbsp;&nbsp;All&nbsp;&nbsp;&nbsp;Right&nbsp;&nbsp;&nbsp;Reserved</p>
    </div>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getStore, removeAllStore, removeStore, setLocalStore, removeLocalStore, mobileClient } from '../../config/mUtils'
  export default {
    name: 'Mine',
    data () {
      return {
        currentUser: getStore('user')
      }
    },
    methods: {
      goBack () {
        if (getStore('Mine_goHome')) {
          removeStore('Mine_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      logOut () {
        removeAllStore()
        removeLocalStore()
        this.$store.dispatch('switchLeanCloudStatus', {active: false})
        if (mobileClient() === 'weixin') {
          setLocalStore('weixinLogin', 'true')
        }
        this.$store.dispatch('clearUnReadMsgCount', {})
        this.$router.replace({name: 'See'})
      },
      contactUs () {
        this.$router.push({name: 'Download'})
      },
      helpCenter () {
        this.$router.push({name: 'Help', query: {from: 'web'}})
      },
      openProtocol () {
        this.$router.push({name: 'ProtocolMenu', query: {from: 'web'}})
      }
    },
    computed: {
      ...mapGetters([
        'user'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .user-info {
    position: relative;
    @include px2rem(height, 200px);
    @include pm2rem(padding, 24px, 0px, 0px, 0px);
    i {
      @include px2rem(margin-left, 30px);
      @include font-dpr(25px);
      color: $white;
      position: relative;
    }
    .info-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      @include px2rem(height, 300px);
    }
    .content {
      position: relative;
      @include px2rem(padding-top, 4px);
      @include font-dpr(20px);
      line-height: 1;
      color: #2F705D;
      text-align: center;
      font-weight: bold;
    }
  }
  .user-avatar {
    @include pm2rem(margin, -60px, 0px, 0px, 0px);
    position: relative;
    display: flex;
    justify-content: center;
    .circle {
      @include px2rem(width, 208px);
      @include px2rem(height, 208px);
      @include px2rem(border-radius, 108px);
      background-color: #D5D5D5;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        @include px2rem(width, 185px);
        @include px2rem(height, 185px);
        @include px2rem(border-radius, 92.5px);
      }
    }
  }
  .menu-container {
    background-color: $white;
    border-top: 1px solid $primary-grey;
    @include px2rem(margin-top, 16px);
    .row-item {
      @include px2rem(height, 96px);
      display: flex;
      align-items: center;
      border-bottom: 1px solid $primary-grey;
      box-sizing: border-box;
      .box {
        @include px2rem(width, 36px);
        @include pm2rem(margin, 0px, 20px, 0px, 30px);
        @include font-dpr(18px);
        color: $second-dark;
      }
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex: 1;
        span {
          @include font-dpr(14px);
          color: $second-dark;
          line-height: 1;
        }
        .arrow {
          transform: rotate(180deg);
          color: $fifth-grey;
          @include font-dpr(18px);
          @include px2rem(margin-right, 30px);
        }
      }
    }
    a:active {
      background-color: rgba(239, 234, 234, .5);
    }
  }
  .logout-btn {
    color: $white;
    @include px2rem(margin-top, 50px);
    text-align: center;
    line-height: normal;
    a {
      margin: 0 auto;
      @include px2rem(width, 520px);
      @include px2rem(height, 80px);
      background-color: $green;
      @include font-dpr(15px);
    }
    a:active {
      background-color: rgba(82, 202, 167, .5);
    }
  }
  .copyright {
    text-align: center;
    @include px2rem(margin-top, 268px);
    color: $fifth-grey;
    @include font-dpr(10px);
  }
</style>

