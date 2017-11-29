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
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import { getStore, removeStore, mobileClient } from '../../config/mUtils'
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
        selectedItem: '微信支付'
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
        } else if (this.isRedirect) {
          this.$router.replace({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      pay (item) {
        if (item === '微信支付') {
          if (mobileClient() === 'weixin') {
            Toast({
              message: '暂不支持在微信中直接支付,请更换其他浏览器,可以在【我的订单】-【待付款】中继续支付',
              duration: 2000
            })
          } else {
            this.selectedItem = item
            this.payRequest()
          }
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
            if (res.data.success) {
              window.location.href = res.data.pay_link + '&redirect_url=' + encodeURIComponent(`${window.location.href}&back=1`)
            } else if (res.data.result && res.data.result.err_code_des === '201 商户订单号重复') {
              Toast({
                message: 'App与网页支付暂不互通，请回原支付端进行支付',
                duration: '3000'
              })
            } else {
              Toast({
                message: res.data.result && res.data.result.err_code_des ? res.data.result.err_code_des : '支付失败，请重试',
                duration: '1000'
              })
            }
          },
          reject: () => {
          }
        })
      },
      goPaySuccess () {
        this.$router.push({name: 'PaySuccess'})
      },
      goPayError () {
        this.$router.push({name: 'PayError', params: {id: this.code}})
      },
      showStatus () {
        if (this.isRedirect) {
          this.getPayStatus()
        }
      },
      getPayStatus () {
        this.$store.dispatch('commonAction', {
          url: `/order_forms/${this.code}`,
          method: 'get',
          params: {
            token: this.token,
            number: this.code
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.order_forms && (res.data.order_forms.state === 'paid' || res.data.order_forms.state === 'reminded')) {
              this.goPaySuccess()
            } else {
              this.goPayError()
            }
          },
          reject: () => {
          }
        })
      }
    },
    mounted () {
      this.showStatus()
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
</style>
