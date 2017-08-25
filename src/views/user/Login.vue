<template>
  <section>
    <common-header
      :title="header"
      @back="goBack()">
    </common-header>
    <div class="login-container">
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
        <a @click="goRegister()">注册账号</a>
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
  import { AUTHORIZATION_TIME } from '../../constants/constant'
  import { Toast, MessageBox } from 'mint-ui'
  export default {
    data () {
      return {
        header: '登录',
        mobile: '',
        password: '',
        deviceDelegate: null,
        title: '提醒',
        time: AUTHORIZATION_TIME,
        tips: '登录请求已发送，请等待授权...',
        showDialog: false,
        user: null,
        interval: null,
        showRejectPopup: false
      }
    },
    components: {
      CommonHeader
    },
    methods: {
      goBack () {
        if (getStore('afterRegistration')) {
          removeStore('afterRegistration') // 注册成功设置完密码后，登录进入首页(优先级最高)
          this.$router.replace({name: 'See'})
        } else if (getStore('beforeLogin')) {
          removeStore('beforeLogin')
          this.$router.go(-1) // beforeLogin优先级较高
        } else if (getStore('Login_goHome')) {
          removeStore('Login_goHome')
          this.$router.replace({name: 'See'})
        } else {
          this.$router.go(-1)
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
              this.getSignature(res.data.authentication_token)
            }
          },
          reject: () => {
            Toast('手机号或密码错误')
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
            this.goBack()
          },
          reject: () => {
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
            this.getSignature(message.content._lcattrs.token)
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
      }
    },
    mounted () {
      this.$refs.mobileInput.focus()
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
    width: 100%;
    max-width: 540px;
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
    .text-btn {
      color: $third-dark;
      @include font-dpr(14px);
      @include pm2rem(margin, 0px, 54px, 0px, 54px);
      display: flex;
      justify-content: space-between;
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
