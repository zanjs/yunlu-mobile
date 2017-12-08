<template>
  <transition name="router-fade">
    <section v-show="show" class="container full-width">
      <div class="dialog-bg full-width"></div>
      <div class="absolute-horizontal dialog-wrapper">
        <div class="content">
          <div class="dialog-body">
            <img src="../../assets/validPhone.png" class="gift">
            <div class="tips">
              <p class="second-text main">{{tips}}</p>
            </div>
            <a class="flex btn" @click="makeCard()">
              去验证
            </a>
          </div>
          <div class="close" @click="close()">
            <img src="../../assets/registClose.png">
          </div>
        </div>
      </div>
    </section>
  </transition>
</template>

<script>
  export default {
    name: 'ValidMobileDialog',
    props: {
      show: {
        default: false
      }
    },
    data () {
      return {
        tips: '为了您的购物安全，购物前请先完成手机号的验证。'
      }
    },
    methods: {
      makeCard () {
        this.$emit('click')
      },
      close () {
        this.$emit('close')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .container {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 1005; // 覆盖云视首页的tabbar
    .dialog-bg {
      position: fixed;
      top: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, .45);
    }
    .dialog-wrapper {
      top: 20%;
      .dialog-body {
        position: relative;
        @include px2rem(width, 562px);
        @include px2rem(height, 542px);
        background-color: $white;
        @include px2rem(border-radius, 10px);
        @include pm2rem(padding, 32px, 30px, 0px, 30px);
        box-sizing: border-box;
        .gift {
          margin: 0 auto;
          @include px2rem(margin-bottom, 46px);
          @include px2rem(width, 198px);
          @include px2rem(height, 198px);
          display: block;
        }
        .tips {
          line-height: normal;
          .main {
            font-size: .37rem;
          }
        }
        .btn {
          margin: 0 auto;
          @include px2rem(margin-top, 50px);
          @include px2rem(height, 88px);
          @include px2rem(width, 420px);
          @include px2rem(border-radius, 44px);
          background-color: #FFD63F;
          color: #FF6000;
          font-size: .42rem;
          line-height: normal;
          box-shadow: 0px 4px 12px -2px rgba(255, 214, 63, .5);
          cursor: pointer;
        }
        a:active {
          opacity: .8;
        }
      }
      .close {
        text-align: center;
        @include px2rem(padding-top, 44px);
        img {
          @include px2rem(width, 58px);
          @include px2rem(height, 58px);
          margin: 0 auto;
        }
      }
    }
  }
</style>
