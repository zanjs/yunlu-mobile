<template>
  <section>
    <div
      v-for="(item, index) in store"
      :key="index"
      class="item-list">
      <div class="title">
        <div
          class="title-check-box"
          @click.stop="handleGropChecked(item, item.checked)">
          <i
            v-if="!item.checked"
            class="iconfont icon-weixuanzhong"></i>
          <i
            v-if="item.checked"
            class="iconfont icon-xuanzhong checked"></i>
        </div>
        <div
          class="title-container"
          @click.stop="handleTitleClick(item)">
          <img :src="item.logo">
          <p>{{item.company}}</p>
        </div>
      </div>
      <div
        v-for="(i, index) in item.purchase_items"
        :key="index"
        class="row-item">
        <div
          class="check-box"
          @click.stop="handleItemChecked(i, item, i.checked)">
          <i
            v-if="i.checked"
            class="iconfont icon-xuanzhong checked"></i>
          <i
            v-if="!i.checked"
            class="iconfont icon-weixuanzhong"></i>
        </div>
        <div class="container">
          <img :src="i.price.product.file_thumb_url">
          <div
            class="content"
            @click.stop="handleItemClick(i)">
            <p>{{i.price.product.name}}</p>
            <div class="price-container">
              <div class="price">
                {{i.price.money}}
              </div>
              <div class="count-bar">
                <i
                  v-if="i.quantity > 1"
                  class="iconfont icon-jianshao"
                  @click.stop="decrease(i, item)"></i>
                <i
                  v-if="i.quantity === 1"
                  class="iconfont icon-jianshao disabled"
                  @click.stop="doNothing"></i>
                <div
                  class="count"
                  @click.stop="doNothing">
                  <input
                    v-if="parseInt(i.quantity + '') < parseInt(i.price.amount + '')"
                    type="number"
                    @input="handleInput($event.target.value, i.price.amount, i, item)"
                    :value="i.quantity">
                    <span
                      v-if="parseInt(i.quantity + '') === parseInt(i.price.amount + '')">{{i.quantity}}</span>
                </div>
                <i
                  v-if="parseInt(i.quantity + '') < parseInt(i.price.amount + '')"
                  class="iconfont icon-tianjia"
                  @click.stop="increase(i, item)"></i>
                <i
                  v-if="parseInt(i.quantity + '') === parseInt(i.price.amount + '')"
                  class="iconfont icon-tianjia disabled"
                  @click.stop="doNothing">
                </i>
              </div>
            </div>
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
  props: ['store'],
  methods: {
    handleGropChecked (item, bool) {
      this.$emit('check-group', {item: item, checked: bool})
    },
    handleItemChecked (i, item, bool) {
      this.$emit('check-item', {item: i, parentItem: item, checked: bool})
    },
    decrease (i, item) {
      this.$emit('decrease', {item: i, parentItem: item})
    },
    increase (i, item) {
      this.$emit('increase', {item: i, parentItem: item})
    },
    handleTitleClick (item) {
      this.$emit('go-organization', item)
    },
    handleItemClick (item) {
      this.$emit('go-product-detail', item)
    },
    handleInput (quantity, amount, i, item) {
      console.log(amount, quantity)
      if (parseInt(quantity + '') >= parseInt(amount + '')) {
        this.$emit('input', {quantity: amount, item: i, parentItem: item})
      }
    },
    doNothing () {

    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .item-list {
    border-bottom: 1px solid #E7E7E7;
    @include px2rem(margin-bottom, 10px);
    background-color: #E7E7E7;
    .title {
      @include px2rem(height, 88px);
      display: flex;
      align-items: center;
      background-color: $white;
      .title-check-box {
        @include px2rem(width, 80px);
        height: inherit;
        display: flex;
        align-items: center;
        @include px2rem(padding-left, 28px);
        i {
          @include font-dpr(21px);
          color: #D1D1D1;
          line-height: 1;
        }
        .checked {
          color: #52CAA7;
        }
      }
      .title-container {
        display: flex;
        align-items: center;
        background-color: $white;
        height: inherit;
        flex: 1;
        img {
          @include px2rem(width, 60px);
          @include px2rem(height, 60px);
          @include px2rem(margin-right, 22px);
        }
        p {
          @include font-dpr(14px);
          line-height: 1;
          color: #262626;
        }
      }
    }
    .row-item {
      border-top: 1px solid #E0E0E0;
      @include px2rem(height, 140px);
      display: flex;
      align-items: center;
      background-color: $white;
      .check-box {
        @include px2rem(width, 72px);
        @include px2rem(padding-left, 28px);
        display: flex;
        align-items: center;
        height: inherit;
        i {
          @include font-dpr(21px);
          color: #A6A6A6;
          line-height: 1;
        }
        .checked {
          color: #52CAA7;
        }
      }
      .container {
        display: flex;
        align-items: center;
        flex: 1;
        height: inherit;
        img {
          @include px2rem(width, 118px);
          @include px2rem(width, 118px);
          @include px2rem(margin-right, 30px);
        }
        .content {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          height: inherit;
          flex: 1;
          line-height: 1;
          p {
            line-height: 1;
            @include font-dpr(14px);
            color: #595959;
          }
          .price-container {
            display: flex;
            align-items: center;
            line-height: 1;
            .price {
              @include px2rem(width, 160px);
              color: #F75544;
              line-height: 1;
              @include font-dpr(15px);
            }
            .count-bar {
              display: flex;
              align-items: center;
              .count {
                display: block;
                @include px2rem(width, 64px);
                @include font-dpr(14px);
                color: #595959;
                line-height: 1;
                text-align: center;
                input {
                  width: inherit;
                  border: none;
                  text-align: center;
                }
              }
              i {
                color: #595959;
                @include font-dpr(21px);
                line-height: 1;
              }
              .disabled {
                color: #DADADA;
              }
            }
            .count {
              display: flex;
              align-items: center;
            }
          }
        }
      }
    }
  }
</style>
