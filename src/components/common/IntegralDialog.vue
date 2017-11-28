<template>
  <transition name="router-fade">
    <section v-show="show" class="container full-width">
      <div class="dialog-bg full-width"></div>
      <div class="absolute-horizontal dialog-wrapper">
        <div class="content">
          <div class="dialog-body">
            <img src="../../assets/gift.png" class="absolute-horizontal gift">
            <div class="tips font-14 second-text">
              <p>{{tips}}</p>
              <p>{{subTips}}</p>
            </div>
            <div class="buttons">
              <a @click="regist"></a>
              <a @click="login"></a>
            </div>
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
        tips: '新用户注册即可获取积分奖励',
        subTips: '赶紧去注册吧！'
      }
    },
    props: ['show'],
    methods: {
      regist () {
        this.$emit('regist')
      },
      login () {
        this.$emit('login')
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
        @include px2rem(height, 596px);
        background: url("../../assets/registDialogBg.png") no-repeat;
        background-size: contain;
        .gift {
          @include px2rem(width, 425px);
          @include px2rem(height, 313px);
          @include px2rem(top, -120px);
        }
        .tips {
          text-align: center;
          @include pm2rem(padding, 250px, 0px, 20px, 0px);
        }
        .buttons {
          a {
            display: block;
            @include px2rem(width, 420px);
            @include px2rem(height, 88px);
            margin: 0 auto;
          }
          a:active {
            opacity: .8;
          }
          & a:first-child {
            background: url("../../assets/newRegistBtn.png") no-repeat;
            background-size: cover;
            @include px2rem(margin-bottom, 25px);
            box-shadow: 0px 0px 18px 2px rgba(254, 213, 79, 0.7);
            @include px2rem(border-radius, 50px);
          }
          & a:last-child {
            background: url("../../assets/oldLoginBtn.png") no-repeat;
            background-size: cover;
            box-shadow: 0px 0px 18px 2px rgba(88, 201, 167, .5);
            @include px2rem(border-radius, 50px);
          }
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
