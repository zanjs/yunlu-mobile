<template>
  <section class="container">
    <common-header
      :title="header"
      @back="goBack()"
      :right-text="rightBtnText"
      @right-click="goRegister()">
    </common-header>
    <div class="normal-login">
      <div class="item top-item">
        <img src="../../assets/inputName.png">
        <input
          type="text"
          v-model="mobile"
          placeholder="输入手机号"
          ref="mobileInput">
      </div>
      <div class="item">
        <img src="../../assets/inputPassword.png">
        <input
          type="password"
          v-model="password"
          placeholder="请输入密码">
      </div>
    </div>
    <div class="text-btn">
      <a @click="forgetPassword()">忘记密码?</a>
    </div>
    <div class="login-btn">
      <a @click="login()">
        登录
      </a>
    </div>
    <div class="social-login">
      <div class="title">
        <hr size=1>
        <p>第三方账号登录</p>
        <hr size=1>
      </div>
      <div class="icons">
        <a
          class="icon-box"
          :href="qqLogin">
          <img src="../../assets/qqLogin.png">
        </a>
        <a
          class="icon-box"
          :href="weixinLogin">
          <img src="../../assets/weixinLogin.png">
        </a>
        <a
          class="icon-box"
          :href="weiboLogin">
          <img src="../../assets/weiboLogin.png">
        </a>
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
  import { AUTH_URL, AUTHORIZATION_TIME } from '../../constants/constant'
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
        qqLogin: `${AUTH_URL}/member/auth/qq_connect?url=${encodeURIComponent('/#/login?provider=qq&tmp_token=')}`,
        weiboLogin: `${AUTH_URL}/member/auth/weibo?url=${encodeURIComponent('/#/login?provider=weibo&tmp_token=')}`,
        weixinLogin: `${AUTH_URL}/member/auth/wechat?url=${encodeURIComponent('/#/login?provider=wechat&tmp_token=')}`
      }
    },
    components: {
      CommonHeader
    },
    methods: {
      goBack (social = false, type = '') {
        if (getStore('afterRegistration')) {
          removeStore('afterRegistration') // 注册成功设置完密码后，登录进入首页(优先级最高)
          this.$router.replace({name: 'See'})
        } else if (getStore('beforeLogin')) {
          removeStore('beforeLogin')
          this.$router.go(social ? (type === 'weibo' ? -2 : -3) : -1) // beforeLogin优先级较高
        } else if (getStore('Login_goHome')) {
          removeStore('Login_goHome')
          this.$router.replace({name: 'See'})
        } else {
          this.$router.go(social ? (type === 'weibo' ? -2 : -3) : -1)
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
              this.getSignature(res.data.authentication_token, false, '')
            }
          },
          reject: () => {
            Toast('手机号或密码错误')
          }
        })
      },
      getSignature (token, social = false, type = '') {
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
            this.goBack(social, type)
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
            this.getSignature(message.content._lcattrs.token, false, '')
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
      authLogin (token, type) {
        this.$store.dispatch('commonAction', {
          url: '/login_info',
          method: 'get',
          params: {
            token: token
          },
          data: {},
          target: this,
          resolve: (state, res) => {
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
              this.getSignature(res.data.authentication_token, true, type)
            } else {
              Toast('授权登录出错')
            }
          },
          reject: () => {
            Toast('授权登录出错')
          }
        })
      },
      shouldLogin () {
        if (this.$route.query.tmp_token) {
          this.authLogin(this.$route.query.tmp_token, this.$route.query.provider)
        }
      },
      // 使用微博登录的时候，会改变路由栈(路由栈中有两个登录页面路由)，有时在本页面返回任然会跳转本页面，需要再次返回
      autoGoBack () {
        if (getStore('user') && getStore('user').authentication_token) {
          this.goBack()
        }
      }
    },
    mounted () {
      this.shouldLogin()
      this.autoGoBack()
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
  .normal-login {
    @include px2rem(padding-top, 147px);
    .item {
      @include px2rem(width, 612px);
      @include px2rem(height, 80px);
      margin: 0 auto;
      position: relative;
      img {
        position: absolute;
        bottom: 0;
        @include px2rem(width, 612px);
        @include px2rem(height, 65px);
      }
      input {
        position: absolute;
        @include px2rem(left, 116px);
        @include px2rem(height, 80px);
        @include px2rem(width, 480px);
        background-color: transparent;
        border: none;
        @include font-dpr(14px);
        color: $second-dark;
      }
      ::-webkit-input-placeholder{
        color: $thirteenth-grey;
      }
    }
    .top-item {
      @include px2rem(margin-bottom, 39px);
    }
  }
  .text-btn {
    color: $fourteenth-grey;
    @include font-dpr(15px);
    @include pm2rem(margin, 28px, 69px, 36px, 0px);
    display: flex;
    justify-content: flex-end;
    align-content: center;
    line-height: 1;
  }
  .login-btn {
    a {
      display: block;
      @include px2rem(width, 650px);
      margin: 0 auto;
      @include px2rem(height, 86px);
      @include px2rem(margin-bottom, 84px);
      background-color: $green;
      color: $white;
      @include font-dpr(16px);
      @include px2rem(line-height, 86px);
      text-align: center;
    }
    a:active {
      background-color: rgba(82, 202, 167, .5);
    }
  }
  .social-login {
    .title {
      display: flex;
      align-items: center;
      justify-content: center;
      @include px2rem(margin-bottom, 34px);
      color: $third-dark;
      p {
        @include font-dpr(15px);
        @include pm2rem(margin, 0px, 34px, 0px, 34px);
        text-align: center;
      }
      hr {
        @include px2rem(width, 120px);
      }
    }
    .icons {
      display: flex;
      @include pm2rem(padding, 0px, 96px, 0px, 96px);
      flex-direction: column;
      align-items: center;
      .icon-box {
        text-align: center;
        display: block;
        @include px2rem(margin-bottom, 44px);
        img {
          @include px2rem(width, 400px);
          @include px2rem(height, 74px);
        }
      }
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
