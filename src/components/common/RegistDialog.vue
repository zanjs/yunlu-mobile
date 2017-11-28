<template>
  <transition name="router-fade">
    <section v-show="show" class="container full-width">
      <div class="dialog-bg full-width"></div>
      <div class="absolute-horizontal dialog-wrapper">
        <div class="content">
          <div class="dialog-body">
            <img src="../../assets/receiveSuccess.png" class="absolute-horizontal success">
            <div class="absolute-horizontal tips">
              <p>{{tips}}</p>
              <div class="font-15">
                <span class="third-text">奖励</span>
                <span class="num">{{num || 600}}</span>
                <span class="third-text">云积分</span>
              </div>
            </div>
            <div class="absolute-horizontal num-bg">
              <div class="text-wrapper">
                <p>可抵扣购物金额</p>
                <p>&yen;&nbsp;{{money || 6}}</p>
              </div>
            </div>
            <div class="help">
              <a @click="help">积分购物？</a>
            </div>
          </div>
          <div class="button">
            <img src="../../assets/integralBtn.png" @click="viewIntegral">
          </div>
          <div class="close" @click="close">
            <img src="../../assets/registClose.png">
          </div>
        </div>
      </div>
    </section>
  </transition>
</template>

<script>
  export default {
    data () {
      return {
        tips: '注册成功'
      }
    },
    props: ['num', 'money', 'show'],
    methods: {
      close () {
        this.$emit('close')
      },
      help () {
        this.$emit('help')
      },
      viewIntegral () {
        this.$emit('view-integral')
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
        @include px2rem(width, 520px);
        @include px2rem(height, 582px);
        background: url("../../assets/receiveSuccessBg.png") no-repeat;
        background-size: contain;
        .success {
          @include px2rem(width, 337px);
          @include px2rem(height, 324px);
          @include px2rem(top, -120px);
        }
        .tips {
          text-align: center;
          @include px2rem(top, 200px);
          p {
            color: #F82424;
            @include font-dpr(18px);
            font-weight: bold;
          }
          .num {
            color: #F82424;
          }
        }
        .num-bg {
          @include px2rem(width, 308px);
          @include px2rem(height, 150px);
          background: url("../../assets/integralBg.png") no-repeat;
          background-size: contain;
          margin: 0 auto;
          @include px2rem(bottom, 80px);
          .text-wrapper {
            width: inherit;
            height: inherit;
            @include pm2rem(padding, 10px, 80px, 10px, 10px);
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            p {
              color: #FA7F7F;
              line-height: normal;
              @include font-dpr(8px);
            }
            & p:last-child {
              color: #F82424;
              @include font-dpr(30px);
            }
          }
        }
        .help {
          text-align: right;
          position: absolute;
          @include px2rem(bottom, 22px);
          width: inherit;
          a {
            color: $second-dark;
            @include font-dpr(14px);
            @include px2rem(margin-right, 30px);
          }
        }
      }
      .button {
        @include pm2rem(margin, 32px, 0px, 38px, 0px);
        text-align: center;
        img {
          @include px2rem(width, 361px);
          @include px2rem(height, 81px);
        }
      }
      .close {
        text-align: center;
        img {
          @include px2rem(width, 58px);
          @include px2rem(height, 58px);
          margin: 0 auto;
        }
      }
    }
  }
</style>
