<template>
  <section class="full-width">
    <common-header
      :title="header"
      @back="goBack()">
    </common-header>
    <div class="success-img">
      <img src="../../assets/payError.png">
      <p>您的订单处理出现异常，请重新下单</p>
      <div class="flex-between button-group">
        <a class="flex white-btn" @click="viewOrder()">查看订单</a>
        <a class="flex green-btn" @click="payAgain()">重新支付</a>
      </div>
    </div>
    <div class="tips">
      <p class="third-text font-12">注意：平台不会以订单异常、系统升级为由，要求您点击任何链接进行退款操作。</p>
    </div>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import { getStore, removeStore } from '../../config/mUtils'
  export default {
    name: 'PayError',
    data () {
      return {
        header: '云庐收银台',
        token: getStore('user') ? getStore('user').authentication_token : '',
        code: this.$route.params.id || ''
      }
    },
    components: {
      CommonHeader
    },
    methods: {
      goBack () {
        if (getStore('PayError_goHome')) {
          removeStore('PayError_goHome')
          this.$router.replace({name: 'See'})
        } else {
          this.$router.replace({name: 'See'})
        }
      },
      viewOrder () {
        this.$router.replace({name: 'OrderForm', query: {index: 1}})
      },
      payAgain () {
        this.$store.dispatch('commonAction', {
          url: '/prepay/wechat/h5',
          method: 'get',
          params: {
            token: this.token,
            code: this.code
          },
          target: this,
          resolve: (state, res) => {
            window.location.href = res.data.pay_link + '&redirect_url=' + encodeURIComponent(`${window.location.href}&back=1`)
          },
          reject: () => {
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .success-img {
    @include pm2rem(padding, 158px, 0px, 80px, 0px);
    background-color: $white;
    text-align: center;
    img {
      @include px2rem(width, 290px);
    }
    p {
      @include font-dpr(18px);
      @include pm2rem(margin, 60px, 0px, 60px, 0px);
      color: $third-dark;
    }
    .button-group {
      margin: 0 auto;
      align-items: center;
      @include px2rem(width, 600px);
      a {
        @include px2rem(width, 246px);
        @include px2rem(height, 70px);
        @include px2rem(border-radius, 10px);
        line-height: normal;
        @include font-dpr(15px);
      }
      .white-btn {
        color: $primary-dark;
        background-color: $white;
        border: 1px solid $second-grey;
      }
      .green-btn {
        color: $white;
        background-color: $green;
      }
    }
  }
  .tips {
    @include pm2rem(padding, 40px, 40px, 40px, 40px);
  }
</style>
