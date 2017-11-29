<template>
  <section class="full-width">
    <common-header
      :title="header"
      @back="goBack()">
    </common-header>
    <div class="success-img">
      <img src="../../assets/paySuccess.png">
      <p>支付成功，请耐心等待商家发货</p>
      <div class="flex-between button-group">
        <a class="flex white-btn" @click="viewOrder()">查看订单</a>
        <a class="flex green-btn" @click="continueToBuy()">继续购买</a>
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
    name: 'PaySuccess',
    data () {
      return {
        header: '云庐收银台'
      }
    },
    components: {
      CommonHeader
    },
    methods: {
      goBack () {
        if (getStore('PaySuccess_goHome')) {
          removeStore('PaySuccess_goHome')
          this.$router.replace({name: 'See'})
        } else {
          this.$router.replace({name: 'See'})
        }
      },
      viewOrder () {
        this.$router.replace({name: 'OrderForm', query: {index: 2}})
      },
      continueToBuy () {
        this.$router.replace({name: 'See'})
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
