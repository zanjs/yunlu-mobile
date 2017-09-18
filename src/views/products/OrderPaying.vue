<template>
  <section class="full-width container">
    <common-header
      :title="header"
      @back="goBack()">
    </common-header>
    <section
      class="address full-width"
      @click="goManageAddress()">
      <div
        v-if="deliverie"
        class="flex icon-box">
        <i class="iconfont icon-dingwei1 primary font-25"></i>
      </div>
      <div
        v-else
        class="img-box">
        <img src="../../assets/addressLogo.png">
      </div>
      <div
        v-if="deliverie"
        class="content">
        <div class="row primary-text font-15 top">
          <span>收货人：{{deliverie.recipient}}</span>
          <span class="phone">{{deliverie.phone}}</span>
        </div>
        <div class="row second-text font-13 text">
          收货地址：{{deliverie.zone_name}}{{deliverie.address}}
        </div>
      </div>
      <div
        v-else
        class="tips">
        <span>您还没有收货地址，赶快</span>
        <span class="danger">去添加</span>
        <span>吧！</span>
      </div>
    </section>
    <div class="line">
      <img src="../../assets/addressLine.png">
    </div>
    <section class="order">
      <div
        v-for="(p, index) in purchaseItems"
        :key="index">
        <a
          class="title"
          @click="goEnterpriseCarte(p.team.id)">
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
            class="row"
            @click="goProductDetail(item.price.product.id)">
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
                  @click.stop="decrease(item)">-</a>
                <a
                  v-if="item.quantity === 1"
                  class="flex disabled"
                  @click.stop="doNothing()">-</a>
                <div @click.stop="doNothing()">
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
                </div>
                <a
                  v-if="parseInt(item.quantity + '') < parseInt(item.price.amount + '')"
                  class="flex"
                  @click.stop.prevent.self="increase(item)">+</a>
                <a
                  v-if="parseInt(item.quantity + '') === parseInt(item.price.amount + '')"
                  class="flex disabled"
                  @click.stop.prevent.self="doNothing()">+</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="others">
      <a class="flex-between item">
        <label>配送方式</label>
        <span class="second-text">包邮</span>
      </a>
      <a
        class="flex-between item"
        @click="changeInvoice()">
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
        v-if="!deliverie"
        class="flex pay-btn white font-17 disabled">
        支付
      </a>
      <a
        v-else
        class="flex pay-btn white font-17"
        @click="pay()">
        支付
      </a>
    </section>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import { getStore, setStore, removeStore } from '../../config/mUtils'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        header: '确认订单',
        deliverie: null,
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
      goEnterpriseCarte (id) {
        this.$router.push({path: `/enterprises/${id}`})
      },
      goProductDetail (id) {
        this.$router.push({path: `/products/${id}`})
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
            this.deliverie = this.selectDefaultDeliverie(res.data.deliveries)
          },
          reject: () => {
          }
        })
      },
      selectDefaultDeliverie (arr) {
        let obj = null
        let hasDefault = false
        if (getStore('selectedAddressId')) {
          obj = arr.filter(i => i.id === parseInt(getStore('selectedAddressId')))[0]
          removeStore('selectedAddressId')
        } else {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].state === 'default') {
              obj = {...arr[i]}
              hasDefault = true
              break
            }
          }
          if (!hasDefault) {
            return arr[0]
          }
        }
        return obj
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
        // 在产品详情页，点击立即购买，此id为空
        if (priceItem.id) {
          this.updateShoppingCartRequest(priceItem.id, quantity)
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
        // 在产品详情页，点击立即购买，此id为空
        if (item.id) {
          this.updateShoppingCartRequest(item.id, item.quantity)
        }
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
        // 在产品详情页，点击立即购买，此id为空
        if (item.id) {
          this.updateShoppingCartRequest(item.id, item.quantity)
        }
      },
      doNothing () {
        // 空事件，避免点击穿透而导致跳转商品详情页。
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
            if (res.data.id === id) {
              setStore('buying', this.purchaseItems)
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
      changeInvoice () {
        Toast({
          message: '需要纸质发票，请线下联系商家',
          duration: 1000
        })
      },
      handlePayingItems (arr) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          let obj = {
            items: [],
            organization_id: arr[i].team.id
          }
          for (let j = 0; j < arr[i].products.length; j++) {
            obj.items.push({price_id: arr[i].products[j].price.id, quantity: arr[i].products[j].quantity})
          }
          tmpArr.push(obj)
        }
        return tmpArr
      },
      pay () {
        Toast({
          message: '暂未开放',
          duration: 500
        })
        /* let groups = this.handlePayingItems(this.purchaseItems)
        setStore('paying', groups)
        this.$router.push({name: 'Pay', query: {id: this.deliverie.id}}) */
      },
      goManageAddress () {
        if (this.deliverie) {
          removeStore('editAddress')
          this.$router.push({name: 'Address', query: {from: 'orderpaying'}})
        } else {
          this.$router.push({name: 'AddAddress', query: {from: 'manage'}})
        }
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
      background-color: $white;
      .icon-box {
        height: inherit;
        @include px2rem(width, 120px);
      }
      .content {
        flex: 1;
        @include pm2rem(padding, 0px, 70px, 20px, 0px);
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
          line-height: 1.5;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          word-break: break-all;
          float: left;
        }
      }
      .img-box {
        @include px2rem(width, 205px);
        @include px2rem(height, 150px);
        display: flex;
        align-items: center;
        img {
          @include px2rem(width, 90px);
          @include px2rem(height, 91px);
          @include px2rem(margin-left, 75px);
        }
      }
      .tips {
        display: flex;
        flex: 1;
        align-items: center;
        line-height: normal;
        span {
          @include font-dpr(15px);
          color: $primary-dark;
        }
        .danger {
          color: #FF5001;
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
        line-height: normal;
        border-bottom: 1px solid $twelfth-grey;
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
              p {
                text-align: left;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                word-break: break-all;
              }
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
                border-top: 1px solid $third-grey;
                border-bottom: 1px solid $third-grey;
                border: none;
              }
              span {
                display: block;
                @include px2rem(height, 50px);
                @include px2rem(width, 90px);
                @include px2rem(line-height, 50px);
                text-align: center;
                background-color: $twelfth-grey;
                border-top: 1px solid $third-grey;
                border-bottom: 1px solid $third-grey;
                border: none;
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
        line-height: normal;
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
          flex: 1;
          height: inherit;
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
      .disabled {
        background-color: $eighth-grey;
      }
    }
  }
</style>
