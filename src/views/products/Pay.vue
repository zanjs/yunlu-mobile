<template>
  <section class="container full-width">
    <common-header
      :title="header"
      @back="goBack()">
    </common-header>
    <div class="order-info">
      <div class="row">
        <span>订单号：</span>
        <span v-if="orderForm && orderForm.code">{{orderForm.code}}</span>
      </div>
      <div class="row">
        <span>总金额：</span>
        <span
          v-if="orderForm && orderForm.children.length > 0"
          class="money">
          {{handleTotalMoney(orderForm.children)}}
        </span>
      </div>
    </div>
    <div class="payment-list">
      <p class="title">支付方式</p>
    </div>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import { getStore, removeStore } from '../../config/mUtils'
  export default {
    data () {
      return {
        header: '支付',
        deliveryId: this.$route.query.id || '',
        token: getStore('user') ? getStore('user').authentication_token : '',
        orderForm: null
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
      createOrderForm () {
        this.$store.dispatch('commonAction', {
          url: '/order_forms',
          method: 'post',
          params: {},
          data: {
            token: this.token,
            delivery_id: this.deliveryId,
            groups: getStore('paying')
          },
          target: this,
          resolve: (state, res) => {
            this.orderForm = res.data.order_forms
          },
          reject: () => {
          }
        })
      },
      handleTotalMoney (arr) {
        let money = 0
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < arr[i].items.length; j++) {
            money += parseFloat(arr[i].items[j].price + '') * parseInt(arr[i].items[j].quantity + '')
          }
        }
        return money
      }
    },
    mounted () {
      this.createOrderForm()
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
        color: #FF5001;
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
  }
</style>
