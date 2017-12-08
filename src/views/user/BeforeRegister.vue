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
          v-model="mobile"
          placeholder="输入手机号"
          ref="mobileInput">
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
  import CommonHeader from '../../components/header/CommonHeader'
  import { Toast } from 'mint-ui'
  import { getStore, removeStore } from '../../config/mUtils'
  import { API_URL, VALID_CODE_IMG_URL } from '../../constants/constant'
  export default {
    name: 'BeforeRegister',
    data () {
      return {
        header: '注册',
        mobile: '',
        captcha: '',
        imgSrc: VALID_CODE_IMG_URL
      }
    },
    components: {
      CommonHeader
    },
    methods: {
      goBack () {
        if (getStore('fromShoppingCart')) {
          removeStore('fromShoppingCart')
          this.$router.replace({name: 'See'})
        } else if (getStore('BeforeRegister_goHome')) {
          removeStore('BeforeRegister_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      next () {
        let xhr = new XMLHttpRequest()
        xhr.open('GET', `${API_URL}/api/v1/before_registrations?mobile=${this.mobile}&captcha=${this.captcha}`)
        xhr.withCredentials = true
        xhr.onload = (e) => {
          if (e && e.target && e.target.readyState === 4 && e.target.status === 200 && JSON.parse(e.target.response) && JSON.parse(e.target.response).success) {
            this.$router.push({name: 'Register', query: {mobile: this.mobile}})
          } else if (e && e.target && JSON.parse(e.target.response) && JSON.parse(e.target.response).msg) {
            let toast = Toast(JSON.parse(e.target.response).msg)
            setTimeout(() => {
              clearTimeout(toast)
              window.location.reload()
            }, 1000)
          } else {
            let toast = Toast('网络异常，请重试')
            setTimeout(() => {
              clearTimeout(toast)
              window.location.reload()
            }, 1000)
          }
        }
        xhr.send()
      },
      getValidCode () {
        window.location.reload()
      },
      openProtocol () {
        this.$router.push({name: 'Protocol', query: {name: 'service_protocol.html', title: '云庐服务协议', from: 'web'}})
      }
    },
    mounted () {
      this.$refs.mobileInput.focus()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin.scss";

  .login-container {
    position: fixed; // 不能用absolute,UC浏览器会白屏
    @include pm2rem(padding, 120px, 0px, 0px, 0px);
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
      img {
        float: right;
        @include px2rem(height, 80px);
        @include px2rem(width, 228px);
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
    .text-btn {
      color: $third-dark;
      @include font-dpr(13px);
      text-align: center;
      a {
        color: $green;
      }
    }
  }
</style>
