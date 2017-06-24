<template>
  <section>
    <mt-header title="登录"
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
        <input type="text"
               v-model="mobile"
               placeholder="输入手机号">
      </div>
      <div class="input-container">
        <input type="password"
               v-model="password"
               placeholder="请输入密码">
      </div>
      <div class="login-btn">
        <a @click="login()">
          登录
        </a>
      </div>
      <div class="text-btn">
        <a @click="goRegister()">注册账号</a>
        <a @click="forgetPassword()">忘记密码?</a>
      </div>
    </div>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { setStore, getStore } from '../../config/mUtils'
  import { Indicator } from 'mint-ui'
  export default {
    data () {
      return {
        mobile: '',
        password: ''
      }
    },
    methods: {
      goBack () {
        this.$router.push({name: 'Home', params: {}})
      },
      login () {
        Indicator.open()
        this.$store.dispatch('commonAction', {
          url: '/login',
          method: 'post',
          params: {},
          data: {
            login: this.mobile,
            password: this.password
          },
          target: this,
          resolve: (state, res) => {
            state.user = res.data
            setStore('user', res.data)
            Indicator.close()
            let beforeLogin = getStore('beforeLogin')
            if (beforeLogin) {
              this.$router.push({name: beforeLogin.urlName, params: beforeLogin.params})
            } else {
              this.$router.push({name: 'Home', params: {}})
            }
          },
          reject: () => {
            Indicator.close()
          }
        })
      },
      goRegister () {
        this.$router.push({name: 'Register'})
      },
      forgetPassword () {
        console.log('2')
      }
    },
    mounted () {
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
    @include pm2rem(padding, 128px, 0px, 0px, 0px);
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    background-color: $white;
    .input-container {
      @include pm2rem(padding, 0px, 50px, 0px, 50px);
      display: flex;
      input {
        @include px2rem(border-radius, 40px);
        @include px2rem(height, 80px);
        @include pm2rem(padding, 0px, 34px, 0px, 34px);
        @include pm2rem(margin, 0px, 0px, 26px, 0px);
        color: #A6A6A6;
        @include font-dpr(14px);
        line-height: 1;
        border: none;
        background-color: #EFEFEF;
        flex: 1;
      }
    }
    ::-webkit-input-placeholder{
      color: #A6A6A6;
    }
    .login-btn {
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
      @include font-dpr(14px);
      @include pm2rem(margin, 0px, 54px, 0px, 54px);
      display: flex;
      justify-content: space-between;
      align-content: center;
    }
  }
</style>
