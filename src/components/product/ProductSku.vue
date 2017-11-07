<template>
  <section class="container full-width">
    <transition
      name="custom-classes-transition"
      enter-active-class="fade-in-active"
      leave-active-class="fade-out-active">
      <div v-show="show">
        <div class="bg full-width" @click="closeSheet()">
        </div>
      </div>
    </transition>
    <transition name="slide-in">
      <div v-show="show" class="sheet white-bg">
        <div class="close-btn-wrapper">
          <div class="close-btn" @click="closeSheet()">
            <i class="iconfont icon-guanbi"></i>
          </div>
        </div>
        <div class="info-wrapper">
          <img
            v-if="img && img.length > 0 && img[0].thumb_urls && img[0].thumb_urls.length > 0"
            class="img"
            :src="img[0].thumb_urls[0]">
          <div class="img" v-else></div>
          <div class="name">
            <p class="font-16 primary-text">{{store.name}}</p>
            <div class="price-info">
              <div class="price">
                <span class="font-12">&yen;</span>
                <span class="font-18">{{price.money}}</span>
              </div>
              <div class="number third-text font-12">
                库存:{{price.amount}}
              </div>
            </div>
          </div>
        </div>
        <div class="price-wrapper">
          <p class="font-16 second-text">价格:</p>
          <tag
            :tags="store.prices"
            :price="price"
            :active="choosed"
            @tag-click="tagClick"></tag>
        </div>
        <div class="number-wrapper">
          <p class="font-16 second-text">数量</p>
          <div
            v-if="price.amount !== '定制' && price.money !== '赠品'"
            class="count-bar">
            <i
              v-if="quantity > 1"
              class="iconfont icon-jianshao"
              @click.stop="decrease()"></i>
            <i
              v-if="quantity === 1"
              class="iconfont icon-jianshao disabled"
              @click.stop="doNothing"></i>
            <div
              class="count"
              @click.stop="doNothing">
              <input
                v-if="parseInt(quantity + '') < parseInt(price.amount + '')"
                type="number"
                @blur="handleInput($event.target.value, price.amount)"
                :value="quantity">
              <span
                v-if="parseInt(quantity + '') === parseInt(price.amount + '')">
                {{quantity}}
              </span>
            </div>
            <i
              v-if="parseInt(quantity + '') < parseInt(price.amount + '')"
              class="iconfont icon-tianjia"
              @click.stop="increase()"></i>
            <i
              v-if="parseInt(quantity + '') === parseInt(price.amount + '')"
              class="iconfont icon-tianjia disabled"
              @click.stop="doNothing">
            </i>
          </div>
        </div>
        <div class="btn-wrapper">
          <a class="shopping-car" @click="addShoppingCar(quantity)">加入购物车</a>
          <a class="buy" @click="buy(quantity)">立即购买</a>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
  import Tag from './Tag'
  export default {
    props: ['show', 'store', 'img', 'price', 'choosed', 'quantity'],
    data () {
      return {

      }
    },
    components: {
      Tag
    },
    methods: {
      closeSheet () {
        this.$emit('close')
      },
      tagClick (item) {
        this.$emit('change-price', item)
      },
      doNothing () {
        // 空方法
      },
      decrease () {
        this.$emit('decrease')
      },
      handleInput (quantity, amount) {
        this.$emit('handle-quantity', {quantity, amount})
      },
      increase () {
        this.$emit('increase')
      },
      addShoppingCar (quantity) {
        this.$emit('add-shopping-cart', quantity)
      },
      buy (quantity) {
        this.$emit('buy-now', quantity)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .container {
    .bg {
      position: fixed;
      background-color: rgba(0, 0, 0, .5);
      top: 0;
      bottom: 0;
    }
    .sheet {
      position: fixed;
      margin: 0 auto;
      bottom: 0;
      top: 20%;
      width: 100%;
      max-width: 540px;
      .close-btn-wrapper {
        position: absolute;
        top: -10%;
        width: 100%;
        max-width: 540px;
        .close-btn {
          position: absolute;
          right: 0;
          @include px2rem(height, 100px);
          @include px2rem(width, 100px);
          display: flex;
          justify-content: center;
          align-items: center;
          line-height: normal;
          i {
            color: $white;
            @include font-dpr(30px);
          }
        }
      }
      .info-wrapper {
        @include pm2rem(margin, 0px, 30px, 0px, 30px);
        border-bottom: 1px solid $second-grey;
        .img {
          position: absolute;
          @include px2rem(top, -40px);
          @include px2rem(left, 40px);
          @include px2rem(width, 200px);
          @include px2rem(height, 200px);
          @include px2rem(border-radius, 8px);
          box-shadow: 0 0 12px 0 rgba(171, 171, 171, .5);
        }
        .name {
          @include pm2rem(padding, 20px, 0px, 30px, 230px);
          @include px2rem(height, 140px);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
          p {
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: normal;
            -webkit-box-orient: vertical;
            display: -webkit-box;
          }
          .price-info {
            line-height: normal;
            display: flex;
            align-items: center;
            .price {
              color: #FF5001;
              @include px2rem(margin-right, 40px);
            }
          }
        }
      }
      .price-wrapper {
        @include pm2rem(margin, 0px, 30px, 0px, 30px);
        @include pm2rem(padding, 30px, 10px, 30px, 10px);
        border-bottom: 1px solid $second-grey;
        p {
          @include px2rem(margin-bottom, 30px);
        }
      }
      .number-wrapper {
        @include pm2rem(margin, 0px, 30px, 0px, 30px);
        @include pm2rem(padding, 30px, 10px, 30px, 10px);
        border-bottom: 1px solid $second-grey;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .count-bar {
          display: flex;
          align-items: center;
          .count {
            display: block;
            @include px2rem(width, 120px);
            @include font-dpr(14px);
            color: $second-dark;
            line-height: 1;
            text-align: center;
            input {
              width: inherit;
              border: none;
              text-align: center;
            }
          }
          i {
            color: $second-dark;
            @include font-dpr(21px);
            line-height: 1;
          }
          .disabled {
            color: #DADADA;
          }
        }
      }
      .btn-wrapper {
        position: absolute;
        bottom: 0;
        width: 100%;
        max-width: 540px;
        display: flex;
        a {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          line-height: normal;
          color: $white;
          @include font-dpr(18px);
          @include px2rem(height, 97px);
        }
        & :first-child {
          background-color: $green;
        }
        & :last-child {
          background-color: #65b39c;
        }
        & a:active {
          opacity: .8;
        }
      }
    }
  }

  .slide-in-enter-active, {
    animation: fadeInUp .3s 0s 1 both;
	}

	.slide-in-leave-active {
    animation: fadeOutDown .3s 0s 1 both;
	}

  .fade-in-active {
    animation: fadeIn 0.3s 0s 1 both;
  }

  .fade-out-active {
    animation: fadeOut 0.3s 0s 1 both;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translate3d(0, 100%, 0);
    }

    to {
      opacity: 1;
      transform: none;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }

  @keyframes fadeOutDown {
    from {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }

    to {
      opacity: 0;
      transform: translate3d(0, 100%, 0);
    }
  }
</style>
