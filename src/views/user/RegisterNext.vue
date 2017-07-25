<template>
  <section>
    <common-header
      :title="header"
      @back="goBack()">
    </common-header>
    <div class="login-container">
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
            this.$router.replace({name: 'Login'})
          },
          reject: () => {
          }
        })
      }
    },
    mounted () {
    }
  }
</script>


<style lang="scss" scoped>
  @import '../../styles/mixin';

  .login-container {
    position: fixed; // 不能用absolute,UC浏览器会白屏
    @include pm2rem(padding, 128px, 0px, 0px, 0px);
    bottom: 0;
    width: 100%;
    max-width: 540px;
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
        color: #595959;
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
  }
</style>
