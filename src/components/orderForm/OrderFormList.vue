<template>
  <section>
    <div
      class="row"
      v-for="(item, index) in store"
      :key="index">
      <div class="title">
        <div
          v-if="selectable"
          @click.stop="handleChecked(item.checked, item.code)"
          class="left flex">
          <i
            v-if="item.checked"
            class="iconfont icon-xuanzhong font-18 checked"></i>
          <i
            v-if="!item.checked"
            class="iconfont icon-weixuanzhong font-18"></i>
        </div>
        <a
          class="right flex-between flex-1"
          @click="handleClick(item.organization.id)">
          <div class="name flex">
            <div
              class="icon-box"
              :class="{'name-icon': selectable}">
              <i class="iconfont icon-shangjia second-text"></i>
            </div>
            <span
              class="primary-text font-14 ellipsis"
              :class="{'width': selectable}">
              {{item.organization.name}}
            </span>
            <i class="iconfont icon-you arrow"></i>
          </div>
          <div class="flex tips font-13">
            {{item.state | status}}
          </div>
        </a>
      </div>
      <a
        v-for="(i, indexI) in item.items"
        :key="indexI"
        class="item"
        :class="{'item-last': indexI === item.items.length - 1}"
        @click="itemClick(item)">
        <img
          v-lazy="{
            src: i.logo,
            error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
            loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
          }">
        <div class="content">
          <div class="name second-text font-15">{{i.name}}</div>
          <div class="bar">
            <span>&yen;{{i.price}}</span>
            <span>x{{i.quantity}}</span>
          </div>
        </div>
      </a>
      <div
        class="footer"
        :class="{'last': index === store.length - 1}">
        <div class="total">
          <span class="third-text">共计{{handleTotoalCount(item.items)}}件商品  合计：</span>
          <span class="money font-16">￥{{item.amount}}</span>
        </div>
        <div class="option-bar">
          <a
            v-if="item.state === 'delivered' || item.state === 'receipted' || item.state === 'finished'"
            class="btn"
            @click="handleLogistics(item)">查看物流</a>
          <a
            v-if="item.state === 'submitted' || item.state === 'paid' || item.state === 'reminded'"
            class="btn"
            @click="contact(item.items[0].product_id)">联系卖家</a>
          <a
            v-if="item.state === 'submitted'"
            class="btn"
            @click="cancel(item.code)">取消订单</a>
          <a
            v-if="item.state === 'canceled'"
            class="btn"
            @click="deleteOrder(item.code)">删除订单</a>
          <a
            v-if="item.state === 'submitted'"
            class="btn danger"
            @click="pay(item)">付款</a>
          <a
            v-if="item.state === 'paid' || item.state === 'reminded'"
            class="btn danger"
            @click="remind(item.code)">提醒发货</a>
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
      handleChecked (bool, id) {
        this.$emit('checked', {bool: bool, id: id})
      },
      handleTotoalCount (items) {
        let count = 0
        for (let i = 0; i < items.length; i++) {
          count += parseInt(items[i].quantity + '')
        }
        return count
      },
      // 前往企业名片
      handleClick (id) {
        this.$emit('go-enterprise', id)
      },
      // 前往订单详情
      itemClick (item) {
        this.$emit('go-detail', item)
      },
      // 查看物流
      handleLogistics (item) {
        this.$emit('action', {type: 'trace', params: item})
      },
      // 联系卖家客服
      contact (item) {
        this.$emit('action', {type: 'contact', params: item})
      },
      // 取消订单
      cancel (code) {
        this.$emit('action', {type: 'cancel', params: code})
      },
      // 付款
      pay (item) {
        this.$emit('action', {type: 'pay', params: item})
      },
      // 提醒发货
      remind (code) {
        this.$emit('action', {type: 'remind', params: code})
      },
      // 删除订单
      deleteOrder (code) {
        this.$emit('action', {type: 'delete', params: code})
      }
    },
    filters: {
      status: function (val) {
        switch (val) {
          case 'submitted':
            return '等待买家付款'
          case 'reminded':
            return '等待卖家发货' // 待发货（已提醒）
          case 'paid':
            return '等待卖家发货' // 待发货
          case 'delivered':
            return '已发货'
          case 'receipted':
            return '已收货'
          case 'canceled':
            return '交易取消'
          case 'finished':
            return '交易成功'
          case 'settling':
            return '交易成功'
          case 'settlement':
            return '交易成功'
          default:
            return ''
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import ".././../styles/mixin";

  .row {
    a:active {
      background-color: rgba(239, 234, 234, .5);
    }
    .title {
      background-color: $white;
      @include px2rem(height, 97px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      a:active {
        background-color: rgba(239, 234, 234, .5);
      }
      .left {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        height: inherit;
        @include pm2rem(padding, 0px, 30px, 0px, 30px);
        i {
          color: $third-dark;
          border-color: $third-dark;
        }
        .checked {
          color: $green;
          border-color: $green;
        }
      }
      .right {
        height: inherit;
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
          .name-icon {
            @include px2rem(padding-left, 10px);
          }
          span {
            @include px2rem(margin-right, 42px);
            line-height: normal;
            @include px2rem(max-width, 340px);
          }
          .width {
            @include px2rem(max-width, 260px);
          }
          .arrow {
            color: $second-grey;
          }
        }
        .tips {
          @include px2rem(margin-right, 40px);
          line-height: normal;
          color: $second-red;
        }
      }
    }
    .item {
      background-color: #F8F8F8;
      display: flex;
      align-items: center;
      @include pm2rem(padding, 18px, 30px, 18px, 30px);
      border-bottom: 1px solid $third-grey;
      img {
        display: block;
        @include px2rem(height, 146px);
        @include px2rem(width, 146px);
        @include px2rem(margin-right, 25px);
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
        @include px2rem(height, 130px);
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
          color: $second-dark;
          @include font-dpr(15px);
        }
      }
    }
    .item-last {
      border-bottom: none;
    }
    .footer {
      background-color: $white;
      @include px2rem(margin-bottom, 20px);
      .total {
        @include px2rem(height, 86px);
        @include px2rem(padding-right, 30px);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        line-height: normal;
        @include font-dpr(13px);
        border-bottom: 1px solid $tenth-grey;
        .money {
          color: $second-dark;
        }
      }
      .option-bar {
        @include px2rem(height, 110px);
        @include px2rem(padding-right, 30px);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        line-height: normal;
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
          border-color: $second-red;
          color: $second-red;
        }
        a:active {
          background-color: rgba(239, 234, 234, .5);
        }
      }
    }
    .last {
      margin-bottom: 0;
    }
  }
</style>
