<template>
  <section class="container full-width">
    <common-header
      :title="header"
      @back="goBack()">
    </common-header>
    <div class="order-info">
      <div class="row">
        <span>订单号：</span>
        <span v-if="code">{{code}}</span>
      </div>
      <div class="row">
        <span>总金额：</span>
        <span class="money">
          &yen;&nbsp;{{amount}}
        </span>
      </div>
    </div>
    <div class="payment-list">
      <p class="title">支付方式</p>
      <a
        v-for="(item, index) in paymentMethods"
        :key="index"
        class="white-bg primary-test font-14 flex-between"
        @click="pay(item)">
        <div class="name">
          <img src="../../assets/weixinPay.png">
          <span>{{item}}</span>
        </div>
        <i class="iconfont icon-you"></i>
      </a>
    </div>
    <transition name="fade">
      <div v-if="dialogVisible" class="full-width dialog-container">
        <div class="full-width dialog-bg" @click="closeDialog()"></div>
        <div class="absolute-horizontal flex dialog-body">
          <p class="flex">请确认微信支付是否已完成</p>
          <a class="flex success" @click="goPaySuccess()">已完成支付</a>
          <a class="flex error" @click="pay(selectedItem)">支付遇到问题，重新支付</a>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import { getStore, removeStore } from '../../config/mUtils'
  import { Toast } from 'mint-ui'
  export default {
    name: 'Pay',
    data () {
      return {
        header: '支付',
        token: getStore('user') ? getStore('user').authentication_token : '',
        isRedirect: this.$route.query.back || '',
        code: this.$route.query.code || '',
        amount: this.$route.query.amount || '',
        paymentMethods: ['微信支付'],
        selectedItem: '',
        dialogVisible: false
      }
    },
    components: {
      CommonHeader
    },
    methods: {
      goBack () {
        if (getStore('Paying_goHome')) {
          removeStore('Paying_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      pay (item) {
        if (item === '微信支付') {
          this.selectedItem = item
          this.payRequest()
        }
      },
      payRequest () {
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
      },
      notOpen () {
        Toast({
          message: '暂未开放',
          duration: 500
        })
      },
      goPaySuccess () {
        this.$router.push({name: 'PaySuccess'})
      },
      closeDialog () {
        this.dialogVisible = false
      },
      showDialog () {
        this.dialogVisible = !!this.isRedirect
      }
    },
    mounted () {
      this.showDialog()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .container {
    position: absolute;
    top: 0;
    bottom: 0;
    background-color: $tenth-grey;
  }
  .order-info {
    @include pm2rem(padding, 115px, 0px, 12px, 0px);
    background-color: $white;
    border-bottom: 1px solid #C9C9C9;
    .row {
      display: flex;
      align-items: center;
      line-height: 1;
      @include pm2rem(padding, 5px, 30px, 20px, 32px);
      span {
        @include font-dpr(15px);
        color: $primary-dark;
      }
      .money {
        color: $second-red;
      }
    }
  }
  .payment-list {
    .title {
      @include px2rem(height, 80px);
      @include px2rem(padding-left, 32px);
      @include font-dpr(16px);
      color: $primary-dark;
      display: flex;
      align-items: center;
    }
    .list {
      border-top: 1px solid #C9C9C9;
    }
    a {
      @include px2rem(height, 96px);
      @include pm2rem(padding, 0px, 32px, 0px, 32px);
      border-top: 1px solid $second-grey;
      align-items: center;
      .name {
        height: inherit;
        display: flex;
        align-items: center;
        line-height: normal;
        img {
          @include px2rem(height, 54px);
          @include px2rem(margin-right, 32px);
        }
      }
      i {
        color: $fifth-grey;
      }
    }
    a:last-child {
      border-bottom: 1px solid $second-grey;
    }
    a:active {
      background-color: rgba(239, 234, 234, .5);
    }
  }
  .dialog-container {
    position: fixed;
    top: 0;
    bottom: 0;
    height: 100%;
    z-index: 1005;
    .dialog-bg {
      position: fixed;
      top: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, .5);
    }
    .dialog-body {
      top: 50%;
      flex-direction: column;
      transform: translate3d(-50%, -50%, 0);
      @include px2rem(width, 480px);
      @include px2rem(height, 400px);
      @include px2rem(border-radius, 20px);
      line-height: normal;
      background-color: $white;
      overflow: hidden;
      p {
        @include px2rem(height, 160px);
        @include font-dpr(16px);
        color: $primary-dark;
        width: inherit;
      }
      a {
        width: inherit;
        border-top: 1px solid $second-grey;
      }
      a:active {
        background-color: rgba(239, 234, 234, .5);
      }
      .success {
        color: $second-red;
        @include font-dpr(16px);
        @include px2rem(height, 120px);
      }
      .error {
        background-color: $second-grey;
        @include font-dpr(16px);
        color: $third-dark;
        @include px2rem(height, 120px);
      }
    }
  }
</style>
