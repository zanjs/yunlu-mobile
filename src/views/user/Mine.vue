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
        <img src="../../assets/userAvatarBig.png">
      </div>
    </div>
    <div class="menu-container">
      <a class="row-item"
         @click="changePassword()">
        <div class="box">
          <i class="iconfont icon-xiugaimima"></i>
        </div>
        <div class="item">
          <span>修改密码</span>
          <i class="iconfont icon-fanhui arrow"></i>
        </div>
      </a>
      <a class="row-item"
         @click="contactUs()">
        <div class="box">
          <i class="iconfont icon-lianxifangshi"></i>
        </div>
        <div class="item">
          <span>联系我们</span>
          <i class="iconfont icon-fanhui arrow"></i>
        </div>
      </a>
      <a class="row-item"
         @click="helpCenter()">
        <div class="box">
          <i class="iconfont icon-bangzhuzhongxin"></i>
        </div>
        <div class="item">
          <span>帮助中心</span>
          <i class="iconfont icon-fanhui arrow"></i>
        </div>
      </a>
      <a class="row-item"
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
      <a @click="logOut()">
        退出登录
      </a>
    </div>
    <div class="copyright">
      <p>云庐数据&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;版权所有</p>
      <p>Copyright&copy;2014-2016&nbsp;&nbsp;&nbsp;&nbsp;Yunlu&nbsp;&nbsp;&nbsp;All&nbsp;&nbsp;&nbsp;Right&nbsp;&nbsp;&nbsp;Reserved</p>
    </div>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getStore, removeAllStore } from '../../config/mUtils'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        currentUser: getStore('user')
      }
    },
    methods: {
      goBack () {
        this.$router.go(-1)
        // this.$router.push({name: 'Home', params: {backUrl: 'Home'}})
      },
      logOut () {
        removeAllStore()
        this.$router.go(-1)
        // this.$router.push({name: 'Home', params: {backUrl: 'Home'}})
      },
      changePassword () {
        this.$router.push({name: 'ChangePassword', params: {backUrl: 'Mine'}})
      },
      contactUs () {
        this.$router.push({name: 'Download', params: {backUrl: 'Mine'}})
      },
      helpCenter () {
        Toast('暂未开放')
        // this.$router.push({name: 'Download', params: {backUrl: 'Mine'}})
      },
      openProtocol () {
        Toast('暂未开放')
        // this.$router.push({name: 'Protocol', params: {backUrl: 'Mine'}})
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
    border-top: 1px solid #DEDEDE;
    @include px2rem(margin-top, 16px);
    .row-item {
      @include px2rem(height, 88px);
      display: flex;
      align-items: center;
      border-bottom: 1px solid #DEDEDE;
      box-sizing: border-box;
      .box {
        @include px2rem(width, 36px);
        @include pm2rem(margin, 0px, 20px, 0px, 30px);
        @include font-dpr(18px);
        color: #595959;
      }
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex: 1;
        span {
          @include font-dpr(14px);
          color: #595959;
          line-height: 1;
        }
        .arrow {
          transform: rotate(180deg);
          color: #A6A6A6;
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
    @include px2rem(margin-top, 22px);
    text-align: center;
    a {
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      @include px2rem(width, 520px);
      @include px2rem(height,70px);
      background-color: #52CAA7;
      @include font-dpr(15px);
    }
    a:active {
      background-color: rgba(82, 202, 167, .5);
    }
  }
  .copyright {
    text-align: center;
    @include px2rem(margin-top, 172px);
    color: #A7A4A4;
    @include font-dpr(13px);
  }
</style>

