<template>
  <section>
    <common-header
      :title="header"
      @back="goBack()">
    </common-header>
    <div class="login-container">
      <div class="input-container">
        <input class="input"
               type="text"
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
        <a @click="getValidCode()"
           v-bind:class="{'active': disabled, 'normal': !disabled}">{{validBtnText}}</a>
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
  import CommonHeader from '../../components/header/CommonHeader'
  import { mapGetters } from 'vuex'
  import { COUNT_DOWN_SECOND } from '../../constants/constant'
  import { Toast } from 'mint-ui'
  import { getStore, removeStore } from '../../config/mUtils'
  export default {
    data () {
      return {
        header: '忘记密码',
        mobile: '',
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
        if (getStore('ForgetPassword_goHome')) {
          removeStore('ForgetPassword_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      getValidCode () {
        this.$store.dispatch('commonAction', {
          url: '/password',
          method: 'post',
          params: {},
          data: {
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
          url: '/check_code',
          method: 'get',
          params: {
            login: this.mobile,
            code: this.code
          },
          data: {},
          target: this,
          resolve: (state, res) => {
            if (res.data.success) {
              this.$router.push({name: 'SetNewPassword', query: {code: this.code, mobile: this.mobile}})
            } else {
              Toast(res.data.msg)
            }
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
      this.$refs.mobileInput.focus()
    },
    computed: {
      ...mapGetters([
        'user'
      ])
    }
  }
</script>


<style lang="scss" scoped>
  @import '../../styles/mixin';

  .login-container {
    position: fixed; // 不能用absolute,UC浏览器会白屏
    @include px2rem(top, 96px);
    @include pm2rem(padding, 40px, 0px, 0px, 0px);
    bottom: 0;
    width: 100%;
    max-width: 540px;
    background-color: $white;
    .input-container {
      @include pm2rem(padding, 0px, 50px, 0px, 50px);
      display: flex;
      .input {
        @include px2rem(border-radius, 40px);
        @include px2rem(height, 80px);
        @include pm2rem(padding, 0px, 34px, 0px, 34px);
        @include pm2rem(margin, 0px, 0px, 26px, 0px);
        color: #A6A6A6;
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
        color: #A6A6A6;
        @include font-dpr(14px);
        @include px2rem(line-height, 80px);
        border: none;
        background-color: #EFEFEF;
        @include px2rem(width, 326px);
      }
      a {
        float: right;
        @include px2rem(width, 228px);
        @include font-dpr(13px);
        color: #52CAA7;
        border-color: #52CAA7;
        @include px2rem(border-width, 3px);
        @include px2rem(border-radius, 40px);
        border-style: solid;
        box-sizing: border-box;
        @include px2rem(height, 80px);
        display: flex;
        align-items: center;
        justify-content: center
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
