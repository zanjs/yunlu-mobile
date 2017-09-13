<template>
  <section class="full-width container">
    <common-header
      :title="header"
      @back="goBack()">
    </common-header>
    <section class="address full-width">
      <div class="flex icon-box">
        <i class="iconfont icon-fujinkehu-copy primary font-25"></i>
      </div>
      <div class="content">
        <div class="row primary-text font-15 top">
          <span>收货人：{{deliverie.recipient}}</span>
          <span class="phone">{{deliverie.phone}}</span>
        </div>
        <div class="row second-text font-13 text">
          收货地址：{{deliverie.zone_name}}{{deliverie.address}}
        </div>
      </div>
    </section>
    <div class="line">
      <img src="../../assets/addressLine.png">
    </div>
    <section class="order">
      <div
        v-for="(p, index) in purchaseItems"
        :key="index">
        <a class="title">
          <div class="icon-box">
            <i class="iconfont icon-shangjia second-text font-21"></i>
          </div>
          <span class="name font-14">{{p.team.company}}</span>
          <i class="iconfont icon-you arrow"></i>
        </a>
        <div class="rows">
          <div
            v-for="(item, indexI) in p.products"
            :key="indexI"
            class="row">
            <div class="info">
              <img :src="item.price.product.file_thumb_url">
              <div class="content second-text">
                <p class="font-13">{{item.price.product.name}}</p>
                <span class="font-13">￥{{parseFloat(item.price.money + '') * item.quantity}}</span>
              </div>
            </div>
            <div class="option">
              <label class="font-14 primary-text">购买数量</label>
              <div class="count">
                <a
                  v-if="item.quantity > 1"
                  class="flex"
                  @click="decrease(item)">-</a>
                <a
                  v-if="item.quantity === 1"
                  class="flex disabled">-</a>
                <input
                  v-if="parseInt(item.quantity + '') < parseInt(item.price.amount + '')"
                  class="primary-text"
                  type="number"
                  @blur="handleInput($event.target.value, item.price.amount, item)"
                  :value="item.quantity">
                <span
                  v-if="parseInt(item.quantity + '') === parseInt(item.price.amount + '')">
                  {{item.quantity}}
                </span>
                <a
                  class="flex"
                  @click="increase(item)">+</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="others">
      <a class="flex-between item">
        <label>配送方式</label>
        <span>包邮</span>
      </a>
      <a class="flex-between item">
        <label>发票</label>
        <div class="invoice">
          <span>电子发票</span>
          <i class="iconfont icon-you"></i>
        </div>
      </a>
      <a class="item">
        <label>买家留言：</label>
        <input v-model="message">
      </a>
    </section>
    <section class="option-bar full-width">
      <div class="text font-17 primary-text">
        <span>合计：</span>
        <span class="money">￥{{totalMoney}}</span>
      </div>
      <a
        class="flex pay-btn white font-17"
        @click="pay()">
        支付
      </a>
    </section>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import { getStore, removeStore } from '../../config/mUtils'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        header: '确认订单',
        deliverie: {},
        token: getStore('user') ? getStore('user').authentication_token : '',
        purchaseItems: getStore('buying') ? getStore('buying') : [],
        message: '希望掌柜快点发货！'
      }
    },
    components: {
      CommonHeader
    },
    methods: {
      goBack () {
        if (getStore('OrderPaying_goHome')) {
          removeStore('OrderPaying_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      getDeliveries (token) {
        this.$store.dispatch('commonAction', {
          url: '/deliveries',
          method: 'get',
          params: {
            token: token
          },
          target: this,
          resolve: (state, res) => {
            state.deliveries = res.data.deliveries
            this.deliverie = res.data.deliveries[0]
          },
          reject: () => {
          }
        })
      },
      handleInput (quantity, amount, i) {
        if (parseInt(quantity + '') >= parseInt(amount + '')) {
          this.updateQuentity(parseInt(amount + ''), i)
        } else if (parseInt(quantity + '') <= 0 || !quantity) {
          this.updateQuentity(1, i)
        } else {
          this.updateQuentity(parseInt(quantity + ''), i)
        }
      },
      updateQuentity (quantity, priceItem) {
        for (let i = 0; i < this.purchaseItems.length; i++) {
          for (let j = 0; j < this.purchaseItems[i].products.length; j++) {
            if (priceItem.price.product.id === this.purchaseItems[i].products[j].price.product.id) {
              this.purchaseItems[i].products[j].quantity = parseInt(quantity + '')
            }
          }
        }
      },
      decrease (item) {
        for (let i = 0; i < this.purchaseItems.length; i++) {
          for (let j = 0; j < this.purchaseItems[i].products.length; j++) {
            if (item.price.product.id === this.purchaseItems[i].products[j].price.product.id) {
              this.purchaseItems[i].products[j].quantity = parseInt(this.purchaseItems[i].products[j].quantity + '')
              this.purchaseItems[i].products[j].quantity -= 1
            }
          }
        }
        this.updateShoppingCartRequest(item.id, item.quantity)
      },
      increase (item) {
        for (let i = 0; i < this.purchaseItems.length; i++) {
          for (let j = 0; j < this.purchaseItems[i].products.length; j++) {
            if (item.price.product.id === this.purchaseItems[i].products[j].price.product.id) {
              this.purchaseItems[i].products[j].quantity = parseInt(this.purchaseItems[i].products[j].quantity + '')
              this.purchaseItems[i].products[j].quantity += 1
            }
          }
        }
        this.updateShoppingCartRequest(item.id, item.quantity)
      },
      updateShoppingCartRequest (id, quantity) {
        this.$store.dispatch('commonAction', {
          url: `/purchase_items/${id}`,
          method: 'put',
          params: {},
          data: {
            token: this.token,
            quantity: quantity
          },
          target: this,
          resolve: (state, res) => {
            // 该机构新增了一条访客记录
            if (res.data.id === id) {
              console.log('123')
              // 更新购物车中商品数量成功
              this.hasOnFocus = false
            } else {
              let toast = Toast({
                message: '更改商品数量失败',
                duration: 1000
              })
              setTimeout(() => {
                clearTimeout(toast)
              }, 1000)
            }
          },
          reject: () => {
          }
        })
      },
      handleTotalMoney () {
        let totalMoney = 0
        for (let i = 0; i < this.purchaseItems.length; i++) {
          for (let j = 0; j < this.purchaseItems[i].products.length; j++) {
            if (!isNaN(parseFloat(this.purchaseItems[i].products[j].price.money + ''))) {
              totalMoney += parseFloat(this.purchaseItems[i].products[j].price.money + '') * parseInt(this.purchaseItems[i].products[j].quantity + '')
            }
          }
        }
        return totalMoney
      },
      pay () {
        Toast({
          message: '暂未开放',
          duration: 500
        })
      }
    },
    mounted () {
      this.getDeliveries(this.token)
    },
    computed: {
      totalMoney: function () {
        let totalMoney = 0
        for (let i = 0; i < this.purchaseItems.length; i++) {
          for (let j = 0; j < this.purchaseItems[i].products.length; j++) {
            if (!isNaN(parseFloat(this.purchaseItems[i].products[j].price.money + ''))) {
              totalMoney += parseFloat(this.purchaseItems[i].products[j].price.money + '') * parseInt(this.purchaseItems[i].products[j].quantity + '')
            }
          }
        }
        return totalMoney
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .container {
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    background-color: $tenth-grey;
    .address {
      display: flex;
      @include px2rem(padding-top, 88px);
      @include px2rem(height, 160px);
      background-color: $sixth-grey;
      .icon-box {
        height: inherit;
        @include px2rem(width, 120px);
      }
      .content {
        flex: 1;
        @include px2rem(padding-right, 70px);
        .row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex: 1;
          span {
            @include font-dpr(15px);
            @include pm2rem(padding, 22px, 0px, 15px, 0px);
            line-height: 1;
          }
        }
        .top {
          @include px2rem(height, 70px);
        }
        .text {
          @include px2rem(height, 90px);
          line-height: 1.5;
          text-align: left;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          word-break: break-all;
        }
      }
    }
    .line {
      @include px2rem(height, 11px);
      @include px2rem(margin-bottom, 20px);
      img {
        display: block;
        width: 100%;
      }
    }
    .order {
      background-color: $twelfth-grey;
      .title {
        background-color: $white;
        display: flex;
        align-items: center;
        @include px2rem(height, 97px);
        .icon-box {
          @include px2rem(width, 72px);
          @include px2rem(padding-left, 40px);
          height: inherit;
          display: flex;
          align-items: center;
        }
        .name {
          @include px2rem(margin-right, 42px);
        }
        .arrow {
          color: $second-grey;
        }
      }
      a:active {
        background-color: rgba(239, 234, 234, .5);
      }
      .rows {
        background-color: $twelfth-grey;
        .row {
          @include px2rem(height, 228px);
          border-bottom: 1px solid $third-grey;
          .info {
            display: flex;
            @include px2rem(height, 160px);
            img {
              @include px2rem(width, 125px);
              @include px2rem(height, 125px);
              @include pm2rem(margin, 18px, 25px, 18px, 30px);
            }
            .content {
              flex: 1;
              display: flex;
              justify-content: space-between;
              flex-direction: column;
              @include pm2rem(margin, 26px, 30px, 20px, 0px);
              span {
                color: #FE4A00;
              }
            }
          }
          .option {
            line-height: 1;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            label {
              @include px2rem(padding-left, 30px);
              @include px2rem(line-height, 50px);
            }
            .count {
              @include px2rem(padding-right, 30px);
              display: flex;
              align-items: center;
              a {
                @include font-dpr(25px);
                border: 1px solid $third-grey;
                @include px2rem(height, 50px);
                @include px2rem(width, 50px);
                color: #FF5001;
              }
              .disabled {
                color: $third-grey;
              }
              input {
                @include px2rem(height, 50px);
                @include px2rem(width, 90px);
                text-align: center;
                background-color: $twelfth-grey;
                border: none;
                border-top: 1px solid $third-grey;
                border-bottom: 1px solid $third-grey;
              }
              span {
                @include px2rem(height, 50px);
                @include px2rem(width, 90px);
                @include px2rem(line-height, 50px);
                text-align: center;
                background-color: $twelfth-grey;
                border: none;
                border-top: 1px solid $third-grey;
                border-bottom: 1px solid $third-grey;
              }
            }
          }
        }
      }
    }
    .others {
      background-color: $white;
      @include px2rem(margin-bottom, 150px);
      .item {
        @include px2rem(height, 97px);
        display: flex;
        align-items: center;
        @include pm2rem(padding, 0px, 30px, 0px, 30px);
        border-bottom: 1px solid $third-grey;
        @include font-dpr(14px);
        label {
          @include font-dpr(14px);
          color: $second-dark;
        }
        .invoice {
          span {
            color: #FE4A00;
          }
          i {
            color: $third-grey;
            @include px2rem(margin-left, 100px);
          }
        }
        input {
          background-color: transparent;
          border: none;
        }
      }
      a:active {
        background-color: rgba(239, 234, 234, .5);
      }
    }
    .option-bar {
      position: fixed;
      bottom: 0;
      width: 100%;
      @include px2rem(height, 100px);
      background-color: $white;
      display: flex;
      align-items: center;
      .text {
        height: inherit;
        display: flex;
        align-items: center;
        flex: 1;
        @include px2rem(padding-left, 30px);
        border-top: 1px solid $third-grey;
        .money {
          color: #FE4A00;
        }
      }
      .pay-btn {
        height: inherit;
        @include px2rem(width, 190px);
        background-color: #FF4901;
      }
    }
  }
</style>
