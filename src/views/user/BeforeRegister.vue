<template>
  <section>
    <mt-header
      title="注册"
      fixed
      class="header">
      <mt-button
        slot="left"
        @click="goBack()"
        class="button-text">
        <i class="iconfont icon-fanhui"></i>
      </mt-button>
    </mt-header>
    <div class="login-container">
      <div class="input-container">
        <input class="input"
               type="text"
               v-model="mobile"
               placeholder="输入手机号">
      </div>
      <div class="row-item">
        <input
          class="input"
          type="text"
          v-model="captcha"
          placeholder="请输入图片验证码">
        <img
          :src="imgSrc"
          @click="getValidCode()">
      </div>
      <div class="next-btn">
        <a @click="next()">
          下一步
        </a>
      </div>
      <div class="text-btn">
        <span>同意</span>
        <a @click="openProtocol()">《云庐平台服务协议》</a>
      </div>
    </div>
  </section>
</template>

<script>
  import { Toast } from 'mint-ui'
  import { getStore, removeStore } from '../../config/mUtils'
  export default {
    data () {
      return {
        mobile: '',
        captcha: '',
        imgSrc: ''
      }
    },
    methods: {
      goBack () {
        if (getStore('BeforeRegister_goHome')) {
          removeStore('BeforeRegister_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      next () {
        this.$store.dispatch('commonAction', {
          url: '/before_registrations',
          method: 'get',
          params: {
            mobile: this.mobile,
            captcha: this.captcha
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.success) {
              this.$router.push({name: 'Register', query: {mobile: this.mobile}})
            } else {
              this.getValidCode()
              Toast(res.data.msg)
            }
          },
          reject: () => {
          }
        })
      },
      getValidCode () {
        this.$store.dispatch('validCodeAction', {
          url: '/captcha',
          method: 'get',
          params: {
          },
          target: this,
          resolve: (state, res) => {
            this.imgSrc = window.URL.createObjectURL(res.data)
          },
          reject: () => {
          }
        })
      },
      openProtocol () {
        this.$router.push({name: 'Protocol'})
      }
    },
    mounted () {
      this.getValidCode()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin.scss";

  .header {
    background-color: $green;
    @include px2rem(height, 88px);
    @include pm2rem(padding, 0px, 30px, 0px, 30px);
    @include font-dpr(17px);
    position: fixed;
    z-index: 1002 !important;
    h1 {
      @include font-dpr(17px);
    }
    .button-text {
      @include font-dpr(15px);
    }
    i {
      @include font-dpr(20px);
    }
  }

  .login-container {
    position: fixed; // 不能用absolute,UC浏览器会白屏
    @include px2rem(top, 96px);
    @include pm2rem(padding, 40px, 0px, 0px, 0px);
    bottom: 0;
    left: 0;
    right: 0;
    background-color: $white;
    .input-container {
      @include pm2rem(padding, 0px, 50px, 0px, 50px);
      display: flex;
      .input {
        @include px2rem(border-radius, 40px);
        @include px2rem(height, 80px);
        @include pm2rem(padding, 0px, 34px, 0px, 34px);
        @include pm2rem(margin, 0px, 0px, 26px, 0px);
        color: #595959;
        @include font-dpr(14px);
        @include px2rem(line-height, 80px);
        border: none;
        background-color: #EFEFEF;
        width: 100%;
      }
    }
    .row-item {
      @include pm2rem(padding, 0px, 55px, 0px, 55px);
      @include px2rem(height, 80px);
      .input {
        float: left;
        @include px2rem(border-radius, 40px);
        @include px2rem(height, 80px);
        @include pm2rem(padding, 0px, 34px, 0px, 34px);
        color: #595959;
        @include font-dpr(14px);
        @include px2rem(line-height, 80px);
        border: none;
        background-color: #EFEFEF;
        @include px2rem(width, 326px);
      }
      img {
        float: right;
        @include px2rem(height, 80px);
        @include px2rem(width, 228px);
      }
    }
    ::-webkit-input-placeholder{
      color: #A6A6A6;
    }
    .next-btn {
      a {
        display: block;
        @include px2rem(width, 610px);
        margin: 0 auto;
        @include px2rem(height, 80px);
        @include px2rem(margin-top, 28px);
        @include px2rem(margin-bottom, 46px);
        background-color: #52CAA7;
        color: $white;
        @include font-dpr(16px);
        @include px2rem(line-height, 80px);
        text-align: center;
      }
      a:active {
        background-color: rgba(82, 202, 167, .5);
      }
    }
    .text-btn {
      color: #A6A6A6;
      @include font-dpr(13px);
      text-align: center;
      a {
        color: #52CAA7;
      }
    }
  }
</style>
