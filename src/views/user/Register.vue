<template>
  <section>
    <common-header
      :title="header"
      @back="goBack()">
    </common-header>
    <div class="login-container full-width">
      <div class="input-container">
        <input
          class="input"
          type="text"
          disabled
          v-model="mobile"
          placeholder="输入手机号"
          ref="mobileInput">
      </div>
      <div class="row-item">
        <input
          class="input"
          type="text"
          v-model="code"
          placeholder="请输入短信验证码">
        <a
          @click="getCode()"
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
  import CommonHeader from '../../components/header/CommonHeader'
  import { COUNT_DOWN_SECOND } from '../../constants/constant'
  import { Toast } from 'mint-ui'
  import { getStore, removeStore } from '../../config/mUtils'
  export default {
    name: 'Register',
    data () {
      return {
        header: '注册',
        mobile: this.$route.query.mobile,
        code: '',
        validBtnText: '获取验证码',
        disabled: false
      }
    },
    components: {
      CommonHeader
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
      next () {
        this.$store.dispatch('commonAction', {
          url: '/registrations',
          method: 'post',
          params: {},
          data: {
            mobile: this.mobile,
            code: this.code,
            name: this.mobile,
            dev_name: 'iPhone 6',
            dev_class: 'web',
            ...(getStore('shortUuid') ? {short_uuid: getStore('shortUuid')} : {})
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.success) {
              this.$router.push({name: 'RegisterNext', params: {mobile: this.mobile}, query: {token: res.data.authentication_token}})
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
      this.$refs.mobileInput.focus()
    }
  }
</script>


<style lang="scss" scoped>
  @import '../../styles/mixin';

  .login-container {
    position: fixed; // 不能用absolute,UC浏览器会白屏
    @include pm2rem(padding, 128px, 0px, 0px, 0px);
    top: 0;
    bottom: 0;
    background-color: $white;
    .input-container {
      @include pm2rem(padding, 0px, 50px, 0px, 50px);
      display: flex;
      .input {
        @include px2rem(border-radius, 40px);
        @include px2rem(height, 80px);
        @include pm2rem(padding, 0px, 34px, 0px, 34px);
        @include pm2rem(margin, 0px, 0px, 26px, 0px);
        color: $second-dark;
        @include font-dpr(14px);
        line-height: normal;
        border: none;
        background-color: $primary-grey;
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
        color: $second-dark;
        @include font-dpr(14px);
        line-height: normal;
        border: none;
        background-color: $primary-grey;
        @include px2rem(width, 326px);
      }
      a {
        float: right;
        display: block;
        @include px2rem(width, 228px);
        color: $green;
        border-color: $green;
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
        color: $third-dark;
        border-color: $fourth-grey;
        background-color: $fourth-grey;
      }
      .normal {
        color: $green;
        border-color: $green;
      }
    }
    ::-webkit-input-placeholder{
      color: $third-dark;
    }
    .next-btn {
      a {
        display: block;
        @include px2rem(width, 610px);
        margin: 0 auto;
        @include px2rem(height, 80px);
        @include px2rem(margin-top, 28px);
        @include px2rem(margin-bottom, 46px);
        background-color: $green;
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
