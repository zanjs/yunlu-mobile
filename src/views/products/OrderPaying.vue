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
                <span class="font-13">￥850</span>
              </div>
            </div>
            <div class="option">
              <label class="font-14 primary-text">购买数量</label>
              <div class="count"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="option-bar full-width">
      <div class="text font-17 primary-text">
        <span>合计：</span>
        <span class="money">￥850.00</span>
      </div>
      <a class="flex pay-btn white font-17">
        支付
      </a>
    </section>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import { getStore, removeStore } from '../../config/mUtils'
  export default {
    data () {
      return {
        header: '确认订单',
        deliverie: {},
        token: getStore('user') ? getStore('user').authentication_token : '',
        purchaseItems: getStore('buying') ? getStore('buying') : []
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
      }
    },
    mounted () {
      this.getDeliveries(this.token)
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
            @include px2rem(height, 42px);
            line-height: 1;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            @include px2rem(padding-bottom, 26px);
            label {
              @include px2rem(padding-left, 30px);
            }
          }
        }
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
        display: flex;
        flex: 1;
        @include px2rem(padding-left, 30px);
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
