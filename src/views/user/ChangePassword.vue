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
        <a @click="login()">
          完成
        </a>
      </div>
    </div>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import { mapGetters } from 'vuex'
  import { setStore, getStore, removeStore } from '../../config/mUtils'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        header: '修改密码',
        password: '',
        password2: '',
        token: getStore('user') ? getStore('user').authentication_token : null
      }
    },
    components: {
      CommonHeader
    },
    methods: {
      goBack () {
        if (getStore('ChangePassword_goHome')) {
          removeStore('ChangePassword_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      login () {
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
            password: this.password
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.success) {
              state.user = res.data
              setStore('user', res.data)
              let toast = Toast({
                message: '修改成功',
                duration: 1000
              })
              setTimeout(() => {
                toast.close()
                this.goBack()
              }, 1000)
            } else {
              Toast(res.data.msg)
            }
          },
          reject: () => {
            Toast({
              message: '非主控设备没有授权此操作',
              duration: 1000
            })
          }
        })
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
  }
</style>
