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
      <a
        class="title"
        @click="goEnterpriseCarte(team.id)">
        <div class="icon-box">
          <i class="iconfont icon-shangjia second-text font-21"></i>
        </div>
        <span class="name font-14">{{team.name}}</span>
        <i class="iconfont icon-you arrow"></i>
      </a>
      <div class="rows">
        <div
          v-for="(item, indexI) in purchaseItems"
          :key="indexI"
          class="row"
          @click="goProductDetail(item.product_id)">
          <div class="info">
            <img
              v-lazy="{
                src: item.logo,
                error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
                loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
              }">
            <div class="content second-text">
              <p class="font-13">{{item.name}}</p>
              <div class="flex-between">
                <span class="font-13">￥{{parseFloat(item.price + '') * item.quantity}}</span>
                <span class="font-13">x{{item.quantity}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="order-info">
      <div class="option">
        <div class="flex-between item">
          <span class="third-text">商品总价</span>
          <span class="primary-text">￥{{handleTotalMoney(purchaseItems)}}</span>
        </div>
        <div class="flex-between item">
          <span class="third-text">运费</span>
          <span class="primary-text">包邮</span>
        </div>
        <div class="flex-between item">
          <span class="third-text">发票</span>
          <span class="primary-text">明细(纸质)-个人</span>
        </div>
      </div>
      <div class="flex-between money">
        <span class="primary-text">订单总价</span>
        <span class="num">￥{{handleTotalMoney(purchaseItems)}}</span>
      </div>
    </section>
    <section class="order-time">
      <div class="item">订单编号：{{orderDetail.code}}</div>
      <div class="item">创建时间：{{orderDetail.created_at}}</div>
      <div class="item">付款时间：{{orderDetail.paid_at}}</div>
    </section>
    <section class="option-bar full-width">
      <div class="bar-container">
        <a
          v-if="orderDetail.state === 'delivered' || orderDetail.state === 'receipted' || orderDetail.state === 'finished'"
          class="btn"
          @click="handleLogistics(orderDetail)">查看物流</a>
        <a
          v-if="orderDetail.state === 'submitted' || orderDetail.state === 'paid' || orderDetail.state === 'reminded'"
          class="btn"
          @click="contact(orderDetail.items[0].product_id)">联系卖家</a>
        <a
          v-if="orderDetail.state === 'submitted'"
          class="btn"
          @click="cancelOrder(orderDetail.code)">取消订单</a>
        <a
          v-if="orderDetail.state === 'canceled'"
          class="btn"
          @click="deleteOrder(orderDetail.code)">删除订单</a>
        <a
          v-if="orderDetail.state === 'submitted'"
          class="btn danger"
          @click="pay(orderDetail)">付款</a>
        <a
          v-if="orderDetail.state === 'paid' || orderDetail.state === 'reminded'"
          class="btn danger"
          @click="remind(orderDetail.code)">提醒发货</a>
      </div>
    </section>
    <confirm-dialog
      v-if="showConfirm"
      :msg="confirmMsg"
      @click="handleConfirm">
    </confirm-dialog>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import ConfirmDialog from '../../components/common/ConfirmDialog'
  import { getStore, removeStore } from '../../config/mUtils'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        header: '订单详情',
        deliverie: getStore('orderDetailParams').consignee,
        purchaseItems: getStore('orderDetailParams').items,
        team: getStore('orderDetailParams').organization,
        orderDetail: getStore('orderDetailParams'),
        token: getStore('user') ? getStore('user').authentication_token : '',
        cancelOrderId: '',
        showConfirm: false,
        confirmMsg: '确定取消订单？'
      }
    },
    components: {
      CommonHeader,
      ConfirmDialog
    },
    methods: {
      goBack () {
        if (getStore('OrderDetail_goHome')) {
          removeStore('OrderDetail_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      handleTotalMoney (arr) {
        let count = 0
        for (let i = 0; i < arr.length; i++) {
          count += parseFloat(arr[i].price + '') * parseInt(arr[i].quantity + '')
        }
        return count
      },
      contact (id) {
        this.$router.push({name: 'Chat', query: {type: 'Product', productId: id}})
      },
      deleteOrder (id) {
        this.notOpen()
      },
      handleLogistics (id) {
        this.notOpen()
      },
      remind (id) {
        this.$store.dispatch('commonAction', {
          url: `/order_forms/${id}/remind`,
          method: 'put',
          params: {},
          data: {
            token: this.token,
            number: id
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.code) {
              Toast({
                mesasge: res.data.detail || '提醒失败',
                duration: 500
              })
            }
          },
          reject: (state, err) => {
            if (err.status && err.status === 204) {
              Toast({
                message: '您已成功提醒发货~',
                className: 'toast-content',
                iconClass: 'iconfont icon-caozuochenggong toast-icon-big',
                position: 'bottom',
                duration: 1000
              })
            }
          }
        })
      },
      pay (item) {
        this.notOpen()
      },
      notOpen () {
        Toast({
          message: '暂未开放',
          duration: 500
        })
      },
      cancelOrder (id) {
        this.showConfirm = true
        this.cancelOrderId = id
      },
      // 取消订单
      cancelOrderRequest (id) {
        this.$store.dispatch('commonAction', {
          url: `/order_forms/${id}/cancel`,
          method: 'put',
          params: {},
          data: {
            token: this.token,
            number: id
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.code) {
              Toast({
                mesasge: res.data.detail || '取消订单失败',
                duration: 500
              })
            } else {
              Toast({
                message: '您已成功取消订单',
                duration: 500
              })
            }
          },
          reject: (state, res) => {
            if (res.status && res.status === 204) {
              Toast({
                message: '您已成功取消订单',
                duration: 500
              })
            }
          }
        })
      },
      handleConfirm (bool) {
        this.showConfirm = false
        if (bool) {
          this.cancelOrderRequest(this.cancelOrderId)
        }
      },
      goProductDetail (id) {
        this.$router.push({path: `/products/${id}`})
      },
      goEnterpriseCarte (id) {
        this.$router.push({path: `/enterprises/${id}`})
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
      background-color: $sixth-grey;
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
        background-color: $white;
        .row {
          border-bottom: 1px solid $third-grey;
          .info {
            display: flex;
            img {
              @include px2rem(height, 146px);
              @include px2rem(width, 146px);
              @include pm2rem(margin, 18px, 25px, 18px, 30px);
            }
            img[lazy=loading] {
              @include px2rem(height, 146px);
              @include px2rem(width, 146px);
              background-position: center center!important;
              background: url("../../assets/imgLoading3.jpg");
              background-repeat: no-repeat;
              background-size: cover;
            }
            img[lazy=error] {
              @include px2rem(height, 146px);
              @include px2rem(width, 146px);
              background-position: center center!important;
              background: url("../../assets/imgLoadingError.png");
              background-repeat: no-repeat;
              background-size: cover;
            }
            img[lazy=loaded] {
              @include px2rem(height, 146px);
              @include px2rem(width, 146px);
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
        }
      }
    }
    .order-info {
      background-color: $white;
      @include pm2rem(margin, 20px, 0px, 20px, 0px);
      .option {
        @include pm2rem(padding, 14px, 0px, 14px, 0px);
        border-bottom: 1px solid $tenth-grey;
        .item {
          align-items: center;
          line-height: normal;
          @include pm2rem(padding, 10px, 30px, 10px, 30px);
          span {
            @include font-dpr(13px);
          }
        }
      }
      .money {
        @include px2rem(height, 100px);
        align-items: center;
        line-height: normal;
        @include font-dpr(18px);
        @include pm2rem(padding, 10px, 30px, 10px, 30px);
        .num {
          color: #FF5001;
        }
      }
    }
    .order-time {
      @include pm2rem(padding, 21px, 30px, 21px, 30px);
      @include px2rem(margin-bottom, 120px);
      background-color: $white;
      .item {
        @include font-dpr(13px);
        line-height: 1;
        @include pm2rem(padding, 9px, 0px, 9px, 0px);
        color: $third-dark;
      }
    }
    .option-bar {
      position: fixed;
      bottom: 0;
      width: 100%;
      background-color: $white;
      .bar-container {
        @include px2rem(height, 100px);
        display: flex;
        justify-content: flex-end;
        align-items: center;
        line-height: normal;
        @include px2rem(padding-right, 30px);
        .btn {
          @include px2rem(height, 60px);
          @include px2rem(width, 152px);
          @include font-dpr(13px);
          display: flex;
          justify-content: center;
          align-items: center;
          color: $primary-dark;
          border: 1px solid $fifth-grey;
          @include px2rem(margin-left, 20px);
          @include px2rem(border-radius, 8px);
        }
        .danger {
          border-color: #FF5001;
          color: #FF5001;
        }
        a:active {
          background-color: rgba(239, 234, 234, .5);
        }
      }
    }
  }
</style>
