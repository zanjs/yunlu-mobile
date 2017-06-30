<template>
  <section>
    <mt-header title="设置新密码"
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
        <input type="password"
               v-model="password"
               placeholder="输入至少8位密码">
      </div>
      <div class="input-container">
        <input type="password"
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
  export default {
    data () {
      return {
        password: '',
        password2: '',
        mobile: this.$route.query.mobile,
        code: this.$route.query.code
      }
    },
    methods: {
      goBack () {
        if (window.history.length === 1) {
          this.$router.push({name: 'Home'})
        } else {
          this.$router.go(-1)
        }
        // this.$router.push({name: 'See', params: {backUrl: 'See'}})
      },
      done () {
        this.$store.dispatch('commonAction', {
          url: '/password',
          method: 'post',
          params: {
            password: this.password,
            mobile: this.mobile,
            temp_token: this.code,
            _method: 'put'
          },
          data: {
            password: this.password,
            mobile: this.mobile,
            temp_token: this.code,
            _method: 'put'
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.success) {
              let toast = Toast({
                message: '设置成功',
                duration: 2000
              })
              setTimeout(() => {
                toast.close()
                if (window.history.length === 1) {
                  this.$router.push({name: 'Home'})
                } else {
                  this.$router.go(-2)
                }
              }, 2000)
            } else {
              Toast(res.data.msg)
            }
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
        display: flex;
        justify-content: center;
        align-items: center;
        @include px2rem(width, 610px);
        margin: 0 auto;
        @include px2rem(height, 80px);
        @include px2rem(margin-top, 28px);
        @include px2rem(margin-bottom, 46px);
        background-color: #52CAA7;
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
