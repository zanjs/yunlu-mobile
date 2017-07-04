<template>
  <section>
    <mt-header title="注册"
               fixed
               class="header">
      <mt-button slot="left"
                 @click="goBack()"
                 class="button-text">
        <i class="iconfont icon-fanhui"></i>
      </mt-button>
    </mt-header>
    <div class="login-container">
      <div class="input-container">
        <input class="input"
               type="text"
               disabled
               v-model="mobile"
               placeholder="输入手机号">
      </div>
      <div class="row-item">
        <input class="input"
                type="text"
                v-model="code"
                placeholder="请输入短信验证码">
        <a @click="getCode()"
           v-bind:class="{'active': disabled, 'normal': !disabled}">{{validBtnText}}</a>
      </div>
      <div class="next-btn">
        <a @click="next()">
          下一步
        </a>
      </div>
    </div>
  </section>
</template>

<script>
  import { COUNT_DOWN_SECOND } from '../../constants/constant'
  import { Toast } from 'mint-ui'
  import { getStore, removeStore } from '../../config/mUtils'
  export default {
    data () {
      return {
        mobile: this.$route.query.mobile,
        code: '',
        validBtnText: '获取验证码',
        disabled: false
      }
    },
    methods: {
      goBack () {
        if (getStore('Register_goHome')) {
          removeStore('Register_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      next () {
        this.$router.push({name: 'RegisterNext'})
      },
      getCode () {
        this.$store.dispatch('commonAction', {
          url: '/sms_code',
          method: 'get',
          params: {
            mobile: this.mobile
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.success) {
              this.countDown()
            } else {
              Toast(res.data.msg)
            }
          },
          reject: () => {
          }
        })
      },
      countDown () {
        if (this.disabled) {
          return false
        }
        let seconds = COUNT_DOWN_SECOND
        this.interval = setInterval(() => {
          seconds -= 1
          if (seconds === 0) {
            this.disabled = false
            this.validBtnText = '获取验证码'
            clearInterval(this.interval)
          } else {
            this.disabled = true
            this.validBtnText = `剩余${seconds}秒`
          }
        }, 1000)
      },
      login () {
        this.$store.dispatch('commonAction', {
          url: '/registrations',
          method: 'post',
          params: {},
          data: {
            mobile: this.mobile,
            code: this.code,
            name: this.this.mobile
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.success) {
              this.$router.push({name: 'SetPassword', query: {mobile: this.mobile, token: res.data.authentication_token}})
            } else {
              Toast(res.data.msg)
            }
          },
          reject: () => {
          }
        })
      }
    },
    mounted () {
      this.countDown()
    }
  }
</script>


<style lang="scss" scoped>
  @import '../../styles/mixin';

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
      a {
        float: right;
        display: block;
        @include px2rem(width, 228px);
        color: #52CAA7;
        border-color: #52CAA7;
        @include px2rem(border-width, 3px);
        @include px2rem(border-radius, 40px);
        border-style: solid;
        box-sizing: border-box;
        @include px2rem(height, 80px);
        @include px2rem(line-height, 80px);
        text-align: center;
      }
      a:active {
        color: rgba(82, 202, 167, .5);
        border-color: rgba(82, 202, 167, .5);
      }
      .active {
        color: #A6A6A6;
        border-color: #DEDEDE;
        background-color: #DEDEDE;
      }
      .normal {
        color: #52CAA7;
        border-color: #52CAA7;
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
  }
</style>
