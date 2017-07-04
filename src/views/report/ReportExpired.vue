<template>
  <section>
    <mt-header
      title="云庐"
      fixed
      class="header">
      <mt-button
        slot="left"
        @click="goBack()"
        class="button-text">
        <i class="iconfont icon-fanhui"></i>
      </mt-button>
      <mt-button
        slot="right"
        @click="goHome()"
        class="button-text">
        <i class="iconfont icon-zhuye"></i>
      </mt-button>
    </mt-header>
    <div class="container">
      <div class="tip-icon-container">
        <i class="iconfont icon-jinggao"></i>
      </div>
      <div class="tips-content">
        <p class="tips">{{tips}}</p>
        <p>{{initSecond}}{{goText}}</p>
      </div>
    </div>
  </section>
</template>

<script>
  import { getStore, removeStore } from '../../config/mUtils'
  export default {
    data () {
      return {
        initSecond: 12,
        tips: '对不起，本次授权已过期，您也能安装云庐App，邀请好友相互分享精彩与喜悦。',
        goText: '秒后进入云庐首页'
      }
    },
    methods: {
      goHome () {
        this.$router.replace({name: 'See'})
      },
      countDown () {
        let interval = setInterval(() => {
          this.initSecond -= 1
          if (this.initSecond === 1) {
            this.goHome()
            clearInterval(interval)
          }
        }, 1000)
      },
      goBack () {
        if (getStore('ReportExpired_goHome')) {
          removeStore('ReportExpired_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      }
    },
    mounted () {
      this.countDown()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin.scss";

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
  .container {
    @include px2rem(padding-top, 88px);
    .tip-icon-container {
      @include pm2rem(margin, 132px, 268px, 118px, 268px);
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        color: #FF8D7F;
        @include font-dpr(107px);
      }
    }
    .tips-content {
      text-align: center;
      @include pm2rem(padding, 0px, 30px, 0px, 30px);
      p {
        @include font-dpr(16px);
        color: #A6A6A6;
      }
    }
  }
</style>
