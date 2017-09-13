<template>
  <section>
    <div class="list">
      <div
        class="row"
        v-for="(item, index) in store"
        :key="index">
        <div class="title">
          <div class="flex-1 left">
            <a
              v-if="selectable"
              class="check-box flex">
              <i class="iconfont icon-weixuanzhong font-18"></i>
            </a>
            <div class="name flex">
              <div class="icon-box">
                <i class="iconfont icon-shangjia second-text"></i>
              </div>
              <span class="primary-text font-14">{{item.organization.name}}</span>
              <i class="iconfont icon-you arrow"></i>
            </div>
          </div>
          <div class="tips font-14">
            {{item.items[0].state | status}}
          </div>
        </div>
        <div
          class="item"
          v-for="(i, indexI) in item.items"
          :key="indexI">
          <img :src="i.logo">
          <div class="content">
            <div class="name second-text font-13">{{i.name}}</div>
            <div class="bar">
              <span>￥{{i.price}}</span>
              <span>x{{i.quantity}}</span>
            </div>
          </div>
        </div>
        <div class="footer">
          <div class="total">
            <span class="second-text">共计{{handleTotoalCount(item.items)}}件商品  合计：</span>
            <span class="money font-14">￥{{handleTotalMoney(item.items)}}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    data () {
      return {

      }
    },
    props: ['store', 'selectable'],
    methods: {
      handleTotoalCount (items) {
        let count = 0
        for (let i = 0; i < items.length; i++) {
          count += parseInt(items[i].quantity + '')
        }
        return count
      },
      handleTotalMoney (items) {
        let money = ''
        for (let i = 0; i < items.length; i++) {
          money += parseFloat(items[i].price + '') * parseInt(items[i].quantity + '')
        }
        return money
      }
    },
    filters: {
      status: function (val) {
        switch (val) {
          case 'submitted':
            return '等待买家付款'
          case 'mounted':
            return '等待卖家发货'
          case 'refunding':
            return '请求售后'
          case 'accepted':
            return '同意售后'
          case 'rejected':
            return '拒绝售后'
          case 'commented':
            return '评论'
          default:
            return '交易关闭'
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import ".././../styles/mixin";

  .list {
    .row {
      .title {
        background-color: $white;
        @include px2rem(height, 97px);
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid $third-grey;
        border-bottom: 1px solid $third-grey;
        .left {
          display: flex;
          align-items: center;
          height: inherit;
          .check-box {
            @include px2rem(padding-left, 30px);
            @include px2rem(width, 60px);
            height: inherit;
          }
          .name {
            height: inherit;
            align-items: center;
            .icon-box {
              @include px2rem(width, 72px);
              @include px2rem(padding-left, 30px);
              height: inherit;
              display: flex;
              align-items: center;
              i {
                @include font-dpr(21px);
              }
            }
            span {
              @include px2rem(margin-right, 42px);
              line-height: normal;
            }
            .arrow {
              color: $second-grey;
            }
          }
        }
        .tips {
          @include px2rem(margin-right, 30px);
          line-height: normal;
          color: #FF5001;
        }
      }
      .item {
        background-color: $twelfth-grey;
        border-bottom: 1px solid $third-grey;
        display: flex;
        @include pm2rem(padding, 20px, 30px, 20px, 30px);
        img {
          display: block;
          @include px2rem(height, 125px);
          @include px2rem(width, 125px);
          @include px2rem(margin-right, 25px);
        }
        .content {
          @include px2rem(height, 125px);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
          .name {
            text-align: left;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-all;
          }
          .bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: $third-dark;
            @include font-dpr(12px);
          }
        }
      }
      .footer {
        background-color: $white;
        @include px2rem(margin-bottom, 20px);
        border-bottom: 1px solid $third-grey;
        @include px2rem(padding-right, 30px);
        .total {
          @include px2rem(height, 97px);
          display: flex;
          align-items: center;
          justify-content: flex-end;
          line-height: normal;
          @include font-dpr(14px);
          .money {
            color: #F75001;
          }
        }
      }
    }
  }
</style>
