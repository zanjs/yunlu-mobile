<template>
  <section>
    <common-header
      :title="header"
      :icon-class="iconClass"
      @right-click="goHome()"
      @back="goBack()">
    </common-header>
    <div class="container">
      <div class="tip-icon-container flex">
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
  import CommonHeader from '../../components/header/CommonHeader'
  import { getStore, removeStore } from '../../config/mUtils'
  export default {
    name: 'ReportExpired',
    data () {
      return {
        header: '云庐',
        iconClass: 'icon-zhuye',
        initSecond: 12,
        tips: '对不起，本次授权已过期，您也能安装云庐App，邀请好友相互分享精彩与喜悦。',
        goText: '秒后进入云庐首页'
      }
    },
    components: {
      CommonHeader
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

  .container {
    @include px2rem(padding-top, 88px);
    .tip-icon-container {
      @include pm2rem(margin, 132px, 268px, 118px, 268px);
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
        color: $third-dark;
      }
    }
  }
</style>
