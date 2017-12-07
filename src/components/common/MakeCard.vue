<template>
  <transition name="router-fade">
    <section v-show="show" class="container full-width">
      <div class="dialog-bg full-width"></div>
      <div class="absolute-horizontal dialog-wrapper">
        <div class="content">
          <div class="dialog-body">
            <img src="../../assets/makeCard.png" class="gift">
            <div class="tips">
              <p class="primary-text main">{{tips}}</p>
              <p class="second-text sub">{{subTips}}</p>
            </div>
            <a class="flex btn" @click="makeCard()">
              知道了，马上去制作
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
    name: 'MakeCard',
    props: {
      show: {
        default: false
      }
    },
    data () {
      return {
        tips: '请下载云庐App注册，我们精心为你准备好个人专属名片，分享给朋友吧！',
        subTips: '(小秘密，手机注册最高可奖励10元云积分，可换购商品哦。)'
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
        @include px2rem(height, 685px);
        background-color: $white;
        @include px2rem(border-radius, 10px);
        @include pm2rem(padding, 48px, 30px, 0px, 30px);
        box-sizing: border-box;
        .gift {
          margin: 0 auto;
          @include px2rem(margin-bottom, 36px);
          @include px2rem(width, 407px);
          @include px2rem(height, 282px);
          display: block;
        }
        .tips {
          line-height: normal;
          .main {
            font-size: .36rem;
          }
          .sub {
            @include px2rem(margin-top, 20px);
            font-size: .32rem;
            color: #F75544;
          }
        }
        .btn {
          margin: 0 auto;
          @include px2rem(margin-top, 36px);
          @include px2rem(height, 80px);
          @include px2rem(width, 420px);
          @include px2rem(border-radius, 40px);
          background-color: $green;
          color: $white;
          font-size: .4rem;
          line-height: normal;
          box-shadow: 0px 4px 12px -2px rgba(88, 201, 167, 0.5);
        }
        & a:active {
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
