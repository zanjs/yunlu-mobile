<template>
  <section class="container">
    <common-header
      :title="header"
      @back="goBack()"
      :right-text="rightBtnText"
      @right-click="goRegister()">
    </common-header>
    <div class="social-login">
      <p>第三方账号登录</p>
      <div class="icons">
        <a
          class="icon-box"
          :href="qqLogin">
          <img src="../../assets/qqLogin.png">
          <span>QQ</span>
        </a>
        <a
          class="icon-box"
          :href="weixinLogin">
          <img src="../../assets/weixinLogin.png">
          <span>微信</span>
        </a>
        <a
          class="icon-box"
          :href="weiboLogin">
          <img src="../../assets/weiboLogin.png">
          <span>微博</span>
        </a>
      </div>
    </div>
    <div class="login-container">
      <p>手机号登录</p>
      <div class="input-container">
        <input
          type="text"
          v-model="mobile"
          placeholder="输入手机号"
          ref="mobileInput">
      </div>
      <div class="input-container">
        <input
          type="password"
          v-model="password"
          placeholder="请输入密码">
      </div>
      <div class="login-btn">
        <a @click="login()">
          登录
        </a>
      </div>
      <div class="text-btn">
        <a @click="forgetPassword()">忘记密码?</a>
      </div>
    </div>
    <div
      v-show="showDialog"
      class="popup-dialog full-width">
      <div class="dialog absolute-horizontal">
        <header>
          {{title}}
        </header>
        <div class="content">
          <p>{{tips}}</p>
          <div>
            <i class="iconfont icon-shizhong"></i>
            <span>{{time}}</span>
          </div>
        </div>
        <footer @click="closeDialog()">
          取消
        </footer>
      </div>
    </div>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import { getStore, setStore, removeStore } from '../../config/mUtils'
  import { AUTHORIZATION_TIME, QQ_AUTHORIZATION_CODE_URL, QQ_LOGIN_APP_ID, QQ_LOGIN_REDIRECT_URL, WEIBO_LOGIN_APP_ID, WEIBO_AUTHORIZATION_CODE_URL, WEIBO_LOGIN_REDIRECT_URL, WEIXIN_AUTHORIZATION_CODE_RUL, WEIXIN_LOGIN_APP_ID, WEIXIN_LOGIN_REDIRECT_URL } from '../../constants/constant'
  import { Toast, MessageBox, Indicator } from 'mint-ui'
  export default {
    data () {
      return {
        header: '登录',
        rightBtnText: '注册账号',
        mobile: '',
        password: '',
        deviceDelegate: null,
        title: '提醒',
        time: AUTHORIZATION_TIME,
        tips: '登录请求已发送，请等待授权...',
        showDialog: false,
        user: null,
        interval: null,
        showRejectPopup: false,
        qqLogin: `${QQ_AUTHORIZATION_CODE_URL}?which=Login&display=mobile&client_id=${QQ_LOGIN_APP_ID}&response_type=code&redirect_uri=${QQ_LOGIN_REDIRECT_URL}%2F%23%2Flogin&state=qq_connect`,
        weiboLogin: `${WEIBO_AUTHORIZATION_CODE_URL}?client_id=${WEIBO_LOGIN_APP_ID}&response_type=code&redirect_uri=${WEIBO_LOGIN_REDIRECT_URL}%2F%23%2Flogin&state=weibo`,
        weixinLogin: `${WEIXIN_AUTHORIZATION_CODE_RUL}?appid=${WEIXIN_LOGIN_APP_ID}&redirect_uri=${WEIXIN_LOGIN_REDIRECT_URL}%2F%23%2Flogin&response_type=code&scope=snsapi_userinfo&state=wechat#wechat_redirect`
      }
    },
    components: {
      CommonHeader
    },
    methods: {
      goBack (social = false) {
        if (getStore('afterRegistration')) {
          console.log('111', social)
          removeStore('afterRegistration') // 注册成功设置完密码后，登录进入首页(优先级最高)
          this.$router.replace({name: 'See'})
        } else if (getStore('beforeLogin')) {
          console.log('222', social)
          removeStore('beforeLogin')
          this.$router.go(social ? -2 : -1) // beforeLogin优先级较高
        } else if (getStore('Login_goHome')) {
          console.log('333', social)
          removeStore('Login_goHome')
          this.$router.replace({name: 'See'})
        } else {
          console.log('444', social)
          this.$router.go(social ? -2 : -1)
        }
      },
      login () {
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
            if (!res.data.authentication_token) {
              this.user = res.data
              this.countDown(AUTHORIZATION_TIME, 1000)
              this.showDialog = true
              this.initImClient(res.data.device_id)
            } else {
              setStore('user', res.data)
              this.getSignature(res.data.authentication_token, false)
            }
          },
          reject: () => {
            Toast('手机号或密码错误')
          }
        })
      },
      getSignature (token, social = false) {
        this.$store.dispatch('commonAction', {
          url: '/im/sign',
          method: 'get',
          params: {
            token: token
          },
          target: this,
          resolve: (state, res) => {
            setStore('signature', res.data)
            Indicator.close()
            this.goBack(social)
          },
          reject: () => {
            Indicator.close()
          }
        })
      },
      async initImClient (id) {
        this.deviceDelegate = await this.$realtime.createIMClient(`dev_${id}`, {
          signatureFactory: () => {
            return new Promise((resolve, reject) => {
              return resolve({
                signature: getStore('device_signature').signature,
                timestamp: getStore('device_signature').timestamp / 1,
                nonce: getStore('device_signature').nonce
              })
            })
          },
          conversationSignatureFactory: () => {
            return new Promise((resolve, reject) => {
              return resolve({
                signature: getStore('device_signature').signature,
                timestamp: getStore('device_signature').timestamp / 1,
                nonce: getStore('device_signature').nonce
              })
            })
          }
        })
        this.$store.dispatch('setDeviceDelegate', this.deviceDelegate)
        this.deviceDelegate.on('message', message => {
          if (message.from && message.from === 'system' && message.content && message.content._lcattrs && message.content._lcattrs.token) {
            this.user.authentication_token = message.content._lcattrs.token
            setStore('user', this.user)
            this.getSignature(message.content._lcattrs.token, false)
            this.closeDialog()
          } else if (message.from && message.from === 'system' && message._lcattrs && message._lcattrs.clazz === 'sign_devices.rejected') {
            this.closeDialog()
            this.showRejectPopup = true
            MessageBox.alert('主控设备拒绝了您的登录请求！').then(action => {
              this.showRejectPopup = false
            })
          }
        })
      },
      closeDialog () {
        if (this.interval) {
          clearInterval(this.interval)
        }
        this.showDialog = false
      },
      goRegister () {
        this.$router.push({name: 'BeforeRegister'})
      },
      forgetPassword () {
        this.$router.push({name: 'ForgetPassword'})
      },
      countDown (seconds, speed = 1000) {
        const count = () => {
          let minute = Math.floor(seconds / 60)
          let second = seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60
          if (seconds < 3600) {
            this.time = `${minute} : ${second}`
            seconds -= 1
            if (this.time === '0 : 00' && this.interval) {
              clearInterval(this.interval)
              if (this.deviceDelegate) {
                this.deviceDelegate.close().then(() => {
                  // 下线成功（倒计时走完后，没有授权则注销，点击登录，重新登录leancloud）
                }).catch(console.error.bind(console))
              }
              this.closeDialog()
              return false
            }
          }
        }
        count()
        this.interval = setInterval(count, speed)
      },
      sendCode (code, state) {
        this.$store.dispatch('authAction', {
          url: `/member/auth/${state}/callback`,
          method: 'get',
          params: {
            code: code
          },
          data: {},
          target: this,
          resolveFn: (state, res) => {
            setStore('device_signature', res.data.sign)
            if (!res.data.authentication_token && res.data.id) {
              this.user = res.data
              this.countDown(AUTHORIZATION_TIME, 1000)
              this.showDialog = true
              this.initImClient(res.data.device_id)
            } else if (res.data.authentication_token && res.data.id) {
              setStore('user', res.data)
              Indicator.open({
                text: '正在登录...',
                spinnerType: 'fading-circle'
              })
              this.getSignature(res.data.authentication_token, true)
            } else {
              Toast('授权登录出错')
            }
          },
          rejectFn: () => {
            Toast('授权登录出错')
          }
        })
      },
      shouldSendCode () {
        if (window.location.search) {
          let codeStr = window.location.search.split('&')[0]
          let stateStr = window.location.search.split('&')[1]
          let state = stateStr.replace('state=', '')
          let code = codeStr.replace('?code=', '')
          this.sendCode(code, state)
        } else if (this.$route.query.code && this.$route.query.state) {
          this.sendCode(this.$route.query.code, this.$route.query.state)
        }
      }
    },
    mounted () {
      this.shouldSendCode()
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .container {
    background-color: $twelfth-grey;
    position: absolute;;
    top: 0;
    bottom: 0;
    width: 100%;
    max-width: 540px;
  }
  .social-login {
    background-color: $white;
    @include px2rem(padding-top, 88px);
    p {
      @include font-dpr(16px);
      color: $eleventh-grey;
      @include pm2rem(margin, 42px, 0px, 42px, 0px);
      text-align: center;
    }
    .icons {
      display: flex;
      @include pm2rem(padding, 0px, 96px, 0px, 96px);
      justify-content: space-between;
      .icon-box {
        text-align: center;
        display: block;
        img {
          @include px2rem(width, 86px);
          @include px2rem(height, 86px);
        }
        span {
          display: block;
          @include pm2rem(margin, 16px, 0px, 50px, 0px);
          @include font-dpr(13px);
          color: $second-dark;
        }
      }
    }
  }
  .login-container {
    width: 100%;
    max-width: 540px;
    p {
      @include font-dpr(16px);
      color: $eleventh-grey;
      @include pm2rem(margin, 42px, 0px, 42px, 0px);
      text-align: center;
    }
    .input-container {
      @include pm2rem(padding, 0px, 50px, 0px, 50px);
      display: flex;
      input {
        @include px2rem(border-radius, 40px);
        @include px2rem(height, 80px);
        @include pm2rem(padding, 0px, 34px, 0px, 34px);
        @include pm2rem(margin, 0px, 0px, 40px, 0px);
        color: $second-dark;
        @include font-dpr(14px);
        line-height: normal;
        border: 1px solid $green;
        background-color: $twelfth-grey;
        flex: 1;
      }
    }
    ::-webkit-input-placeholder{
      color: $fifth-grey;
    }
    .login-btn {
      a {
        display: block;
        @include px2rem(width, 650px);
        margin: 0 auto;
        @include px2rem(height, 80px);
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
      color: $green;
      @include font-dpr(15px);
      @include pm2rem(margin, 0px, 54px, 0px, 54px);
      display: flex;
      justify-content: flex-end;
      align-content: center;
    }
  }
  .popup-dialog {
    position: fixed;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .45);
    z-index: 1004 !important;
    .dialog {
      @include px2rem(width, 500px);
      @include px2rem(top, 300px);
      background-color: $white;
      header {
        background-color: $green;
        color: $white;
        @include px2rem(height, 80px);
        text-align: center;
        @include px2rem(line-height,80px);
        @include font-dpr(15px);
      }
      .content {
        background-color: $white;
        p {
          @include font-dpr(13px);
          color: $primary-dark;
          text-align: center;
          @include pm2rem(padding, 40px, 0px, 30px, 0px);
        }
        div {
          text-align: center;
          color: $green;
          @include pm2rem(padding, 0px, 0px, 30px, 0px);
          i {
            @include font-dpr(14px);
          }
          span {
            @include font-dpr(14px);
          }
        }
      }
      footer {
        text-align: center;
        line-height: 1;
        border-top: 1px solid $second-grey;
        @include pm2rem(padding, 20px, 0px, 20px, 0px);
        @include font-dpr(15px);
        color: $primary-dark;
      }
    }
  }
</style>
