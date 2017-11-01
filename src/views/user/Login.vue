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
        <p class="primary-text">手机号</p>
        <input
          type="text"
          v-model="mobile"
          placeholder="输入手机号"
          ref="mobileInput">
      </div>
      <div class="item">
        <p class="primary-text">密码</p>
        <input
          type="password"
          v-model="password"
          placeholder="请输入密码">
        <a @click="forgetPassword()">忘记密码?</a>
      </div>
    </div>
    <div class="login-btn">
      <a @click="login()">
        登录
      </a>
    </div>
    <div class="tips">
      <span class="third-text font-13">点击登录代表您已同意</span>
      <a class="primary font-13" @click="openProtocol()">《云庐平台服务协议》</a>
    </div>
    <div class="social-login">
      <p class="third-text font-13">更多登录方式</p>
      <div class="icons">
        <a
          class="icon-box"
          :href="qqLogin">
          <img src="../../assets/qq.png">
        </a>
        <a
          class="icon-box"
          :href="weixinLogin">
          <img src="../../assets/weixin.png">
        </a>
        <a
          class="icon-box"
          :href="weiboLogin">
          <img src="../../assets/weibo.png">
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
  import { getStore, getLocalStore, setStore, setLocalStore, removeStore, removeLocalStore, mobileClient } from '../../config/mUtils'
  import { AUTH_URL, AUTHORIZATION_TIME } from '../../constants/constant'
  import { Toast, MessageBox, Indicator } from 'mint-ui'
  export default {
    name: 'Login',
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
        qqLogin: `${AUTH_URL}/member/auth/qq_connect?url=${encodeURIComponent('/login?provider=qq&tmp_token=')}`,
        weiboLogin: `${AUTH_URL}/member/auth/weibo`,
        weixinLogin: `${AUTH_URL}/member/auth/wechat?url=${encodeURIComponent('/login?provider=wechat&tmp_token=')}`
      }
    },
    components: {
      CommonHeader
    },
    methods: {
      goBack (social = false, provider = '') {
        if (getStore('afterRegistration')) {
          removeStore('afterRegistration') // 注册成功设置完密码后，登录进入首页(优先级最高)
          this.$router.replace({name: 'See'})
        } else if (getStore('beforeLogin')) {
          removeStore('beforeLogin')
          if (getStore('user') && getStore('user').authentication_token && getStore('buying')) { // 产品详情页正在购买的产品信息
            this.getDeliveries(getStore('user').authentication_token)
          } else {
            this.$router.go(social ? (provider === 'qq' ? -3 : -2) : -1) // beforeLogin优先级较高
          }
        } else if (getStore('Login_goHome')) {
          removeStore('Login_goHome')
          this.$router.replace({name: 'See'})
        } else {
          this.$router.go(social ? (provider === 'qq' ? -3 : -2) : -1)
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
      getSignature (token, social = false, provider = '') {
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
            this.goBack(social, provider)
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
      authLogin (token, provider) {
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
            removeLocalStore('weixinLogin')
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
              this.getSignature(res.data.authentication_token, true, provider)
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
        } else if (getLocalStore('weixinLogin')) {
          Toast({
            message: '自动登录失败，请手动登录',
            duration: 1000
          })
          return false
        } else if (mobileClient() === 'weixin' && !getLocalStore('weixinLogin')) {
          setLocalStore('weixinLogin', 'true')
          window.location.href = this.weixinLogin
        }
      },
      // 使用微博登录的时候，会改变路由栈(路由栈中有两个登录页面路由)，有时在本页面返回任然会跳转本页面，需要再次返回
      autoGoBack () {
        if (getStore('user') && getStore('user').authentication_token) {
          this.goBack()
        } else {
          this.shouldLogin()
        }
      },
      // 获取收货地址（只有从商品详情页，点击立即购买进入登录页，返回时才需要获取收货地址）
      getDeliveries (token) {
        this.$store.dispatch('commonAction', {
          url: '/deliveries',
          method: 'get',
          params: {
            token: token
          },
          target: this,
          resolve: (state, res) => {
            state.deliveries = res.data.deliveries
            this.$router.replace({name: 'AddAddress'})
            this.buyingBack(state.deliveries)
          },
          reject: () => {
          }
        })
      },
      buyingBack (deliveries) {
        if (deliveries.length > 0) {
          this.$router.replace({name: 'OrderPaying'})
        } else {
          this.$router.replace({name: 'AddAddress'})
        }
      },
      openProtocol () {
        this.$router.push({name: 'Protocol'})
      }
    },
    mounted () {
      this.autoGoBack()
    },
    activated () {
      this.mobile = ''
      this.password = ''
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
    @include px2rem(padding-top, 138px);
    .item {
      @include px2rem(width, 582px);
      margin: 0 auto;
      position: relative;
      p {
        @include font-dpr(16px);
        line-height: 1;
      }
      input {
        @include px2rem(margin-top, 30px);
        @include pm2rem(padding, 18px, 160px, 18px, 0px);
        @include px2rem(max-width, 582px);
        @include px2rem(width, 422px);
        background-color: transparent;
        border: none;
        @include font-dpr(14px);
        color: $second-dark;
        border-bottom: 1px solid $fifth-grey;
        line-height: 1;
      }
      ::-webkit-input-placeholder{
        color: $third-dark;
      }
      a {
        position: absolute;
        @include px2rem(bottom, 18px);
        right: 0;
        line-height: normal;
        @include font-dpr(14px);
        color: $green;
      }
      a:active {
        opacity: .5;
      }
    }
    .top-item {
      @include px2rem(margin-bottom, 39px);
    }
  }
  .login-btn {
    @include pm2rem(margin, 52px, 85px, 78px, 85px);
    a {
      display: block;
      @include px2rem(width, 580px);
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
      opacity: .5;
    }
  }
  .tips {
    text-align: center;
    a:active {
      color: rgba(82, 202, 167, .5);
    }
  }
  .social-login {
    display: flex;
    justify-content: center;
    align-items: center;
    @include pm2rem(margin, 260px, 0px, 60px, 0px);
    p {
      @include px2rem(margin-right, 16px);
      line-height: normal;
    }
    .icons {
      display: inline-flex;
      align-items: center;
      .icon-box {
        display: flex;
        justify-content: center;
        align-items: center;
        @include pm2rem(margin, 0px, 40px, 0px, 40px);
        @include px2rem(width, 40px);
        @include px2rem(height, 40px);
        img {
          @include px2rem(width, 40px);
          @include px2rem(height, 40px);
          display: block;
        }
      }
      a:active {
        opacity: .5;
      }
      a:last-child {
        margin-right: 0;
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
      @include px2rem(width, 562px);
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
        @include px2rem(height, 80px);
        line-height: normal;
        display: flex;
        align-items: center;
        justify-content: center;
        border-top: 1px solid $second-grey;
        @include font-dpr(15px);
        color: $primary-dark;
      }
    }
  }
</style>
