<template>
  <section>
    <common-header
      :title="header"
      @back="goBack()">
    </common-header>
    <div class="login-container full-width">
      <div class="input-container">
        <input
          type="password"
          v-model="password"
          placeholder="输入至少8位密码">
      </div>
      <div class="input-container">
        <input
          type="password"
          v-model="password2"
          placeholder="请再次输入密码">
      </div>
      <div class="login-btn">
        <a @click="finish()">
          完成注册
        </a>
      </div>
    </div>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import { getStore, removeStore, setStore } from '../../config/mUtils'
  export default {
    name: 'RegisterNext',
    data () {
      return {
        header: '设置密码',
        password: '',
        password2: '',
        mobile: this.$route.params.mobile,
        token: this.$route.query.token
      }
    },
    components: {
      CommonHeader
    },
    methods: {
      goBack () {
        if (getStore('RegisterNext_goHome')) {
          removeStore('RegisterNext_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      finish () {
        this.$store.dispatch('commonAction', {
          url: '/password',
          method: 'put',
          params: {
            password: this.password,
            token: this.token,
            _method: 'put'
          },
          data: {
            login: this.mobile,
            password: this.password,
            token: this.token
          },
          target: this,
          resolve: (state, res) => {
            setStore('afterRegistration', 'true')
            this.autoLogin()
          },
          reject: () => {
          }
        })
      },
      getSignature (token) {
        this.$store.dispatch('commonAction', {
          url: '/im/sign',
          method: 'get',
          params: {
            token: token
          },
          target: this,
          resolve: (state, res) => {
            setStore('signature', res.data)
            this.$router.go(-3)
          },
          reject: () => {
          }
        })
      },
      autoLogin () {
        this.$store.dispatch('commonAction', {
          url: '/login',
          method: 'post',
          params: {},
          data: {
            login: this.mobile,
            password: this.password,
            dev_name: 'web',
            dev_class: 'web'
          },
          target: this,
          resolve: (state, res) => {
            // 有两个签名，一个是设备签名，一个是用户签名
            setStore('device_signature', res.data.sign)
            // 在App上注册的账号，在网页上登录没有token，需要主控设备授权，通过leancloud返回token给网页
            if (res.data.authentication_token) {
              setStore('user', res.data)
              this.getSignature(res.data.authentication_token)
            }
          },
          reject: () => {
          }
        })
      }
    }
  }
</script>


<style lang="scss" scoped>
  @import '../../styles/mixin';

  .login-container {
    position: fixed; // 不能用absolute,UC浏览器会白屏
    @include pm2rem(padding, 128px, 0px, 0px, 0px);
    bottom: 0;
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
        color: $second-dark;
        @include font-dpr(14px);
        line-height: normal;
        border: none;
        background-color: $primary-grey;
        flex: 1;
      }
    }
    ::-webkit-input-placeholder{
      color: $third-dark;
    }
    .login-btn {
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
