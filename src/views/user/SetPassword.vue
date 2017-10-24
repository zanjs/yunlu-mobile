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
        <a @click="done()">
          完成
        </a>
      </div>
    </div>
  </section>
</template>

<script>
  import { Toast } from 'mint-ui'
  import CommonHeader from '../../components/header/CommonHeader'
  import { getStore, removeStore } from '../../config/mUtils'
  export default {
    data () {
      return {
        header: '设置密码',
        password: '',
        password2: '',
        mobile: this.$route.query.mobile,
        token: this.$route.query.token
      }
    },
    components: {
      CommonHeader
    },
    methods: {
      goBack () {
        if (getStore('SetPassword_goHome')) {
          removeStore('SetPassword_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      done () {
        this.$store.dispatch('commonAction', {
          url: '/password',
          method: 'put',
          params: {
            password: this.password,
            token: this.token,
            _method: 'put'
          },
          data: {
            password: this.password,
            token: this.token,
            _method: 'put'
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.success) {
              this.$router.push({name: 'Login'})
            } else {
              Toast(res.data.msg)
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
        color: $third-dark;
        @include font-dpr(14px);
        line-height: 1;
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
        display: flex;
        justify-content: center;
        align-items: center;
        @include px2rem(width, 610px);
        margin: 0 auto;
        @include px2rem(height, 80px);
        @include px2rem(margin-top, 28px);
        @include px2rem(margin-bottom, 46px);
        background-color: $green;
        color: $white;
        @include font-dpr(16px);
        text-align: center;
      }
      a:active {
        background-color: rgba(82, 202, 167, .5);
      }
    }
  }
</style>
