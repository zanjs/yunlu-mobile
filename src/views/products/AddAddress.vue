<template>
  <section class="container full-width">
    <common-header
      :title="header"
      @back="goBack()">
    </common-header>
    <section class="form-container">
      <div class="row-item">
        <label>收货人</label>
        <input
          placeholder="必填"
          v-model="form.recipient">
      </div>
      <div class="row-item">
        <label>联系电话</label>
        <input
          placeholder="必填"
          v-model="form.phone">
      </div>
      <div class="row-item">
        <label>所在地区</label>
        <a
          class="font-14 ellipsis"
          @click="getAddressItems('province', '', 0, '')">
          {{form.zone_name}}
        </a>
      </div>
      <div class="row-item">
        <label>详细地址</label>
        <input
          placeholder="必填"
          v-model="form.address">
      </div>
    </section>
    <a
      class="option-bar"
      @click="check(checked)">
      <label>设为默认地址</label>
      <div class="icon-box">
        <i
          v-if="!checked"
          class="iconfont icon-weixuanzhong second-text"></i>
        <i
          v-if="checked"
          class="iconfont icon-xuanzhong"></i>
      </div>
    </a>
    <section class="footer full-width">
      <a
        class="flex primary-bg white"
        @click="save()">保存</a>
    </section>
    <section
      v-if="addressModal"
      class="absolute-horizontal modal white-bg">
      <address-picker
        :level="level"
        :province="provinces"
        :city="cities"
        :district="districts"
        @select="selectAddress">
      </address-picker>
    </section>
    <div
      v-if="addressModal"
      slot="header"
      class="absolute-horizontal modal-header second-text">
      <P class="second-text">
        {{form.zone_name}}
      </P>
      <a
        class="close-btn"
        @click="resetAddress()">
        <i class="iconfont icon-guanbi"></i>
      </a>
    </div>
    <div
      v-show="addressModal"
      class="picker-bg"
      id="picker-bg"></div>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import AddressPicker from '../../components/common/AddressPicker'
  import { Toast } from 'mint-ui'
  import { getStore, removeStore } from '../../config/mUtils'
  export default {
    data () {
      return {
        header: this.$route.query.type === 'edit' ? '编辑收货地址' : '添加收货地址',
        type: this.$route.query.type || 'add',
        from: this.$route.query.from || '',
        checked: getStore('editAddress') && getStore('editAddress').state && getStore('editAddress').state === 'default',
        addressModal: false,
        level: 0,
        provinces: [],
        cities: [],
        districts: [],
        token: getStore('user') ? getStore('user').authentication_token : '',
        form: {
          recipient: getStore('editAddress') ? getStore('editAddress').recipient : '',
          phone: getStore('editAddress') ? getStore('editAddress').phone : '',
          zone_code: getStore('editAddress') ? getStore('editAddress').zone_code : '',
          address: getStore('editAddress') ? getStore('editAddress').address : '',
          zone_name: getStore('editAddress') ? getStore('editAddress').zone_name : '必填',
          state: getStore('editAddress') ? getStore('editAddress').state : 'normal'
        }
      }
    },
    components: {
      CommonHeader,
      AddressPicker
    },
    methods: {
      goBack () {
        if (getStore('AddAddress_goHome')) {
          removeStore('AddAddress_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      check (bool) {
        this.checked = !this.checked
        this.checked = !bool
        this.form.state = bool ? 'normal' : 'default'
      },
      resetAddress () {
        this.form.zone_code = ''
        this.form.zone_name = '必填'
        this.addressModal = false
      },
      checkForm () {
        if (!this.form.recipient) {
          Toast({
            message: '联系人不能为空',
            duration: 500
          })
          return false
        } else if (!this.form.phone) {
          Toast({
            message: '联系电话不能为空',
            duration: 500
          })
          return false
        } else if (!this.form.zone_code) {
          Toast({
            message: '所在地区不能为空',
            duration: 500
          })
          return false
        } else if (!this.form.address) {
          Toast({
            message: '详细地址不能为空',
            duration: 500
          })
          return false
        } else {
          return true
        }
      },
      save () {
        if (this.checkForm()) {
          this.addDeliverie()
        }
      },
      getAddressItems (type = 'province', code = '', level = 0, name = '') {
        this.$store.dispatch('commonAction', {
          url: `/${type}`,
          method: 'get',
          params: {
            ...(level === 0 ? {} : {code: code})
          },
          target: this,
          resolve: (state, res) => {
            this.addressModal = true
            if (level === 0) {
              this.level = 0
              this.provinces = res.data.province
              this.form.zone_name = ''
            } else if (level === 1) {
              this.level = 1
              this.cities = res.data.district
              this.form.zone_name = this.form.zone_name + `${name}`
              this.form.zone_code = code
              if (res.data.district.length === 0) {
                this.addressModal = false
              }
            } else if (level === 2) {
              this.level = 2
              this.districts = res.data.district
              this.form.zone_name = this.form.zone_name + `--${name}`
              this.form.zone_code = code
              if (res.data.district.length === 0) {
                this.addressModal = false
              }
            } else if (level === 3) {
              this.districts = res.data.district
              this.form.zone_name = this.form.zone_name + `--${name}`
              this.form.zone_code = code
              this.addressModal = false
            }
          },
          reject: () => {
          }
        })
      },
      selectAddress (item) {
        this.getAddressItems('district', item.code, item.level, item.name)
      },
      addDeliverie () {
        this.$store.dispatch('commonAction', {
          url: this.type === 'add' ? '/deliveries' : `/deliveries/${getStore('editAddress').id}`,
          method: this.type === 'add' ? 'post' : 'put',
          params: {},
          data: {
            token: this.token,
            recipient: this.form.recipient,
            phone: this.form.phone,
            zone_code: this.form.zone_code,
            address: this.form.address,
            state: this.form.state
          },
          target: this,
          resolve: (state, res) => {
            this.saveNext()
          },
          reject: () => {
          }
        })
      },
      saveNext () {
        if (this.from === 'manage') {
          this.$router.go(-1)
        } else {
          if (getStore('buying')) {
            this.$router.push({name: 'OrderPaying'})
          } else {
            this.goBack()
          }
        }
      },
      addTouch () {
        let self = this
        document.getElementById('picker-bg').addEventListener('touchstart', (e) => {
          // e.preventDefault()
          setTimeout(() => {
            self.resetAddress()
            self.addressModal = false
          }, 500)
        })
        document.getElementById('picker-bg').addEventListener('click', (e) => {
          // e.preventDefault()
          setTimeout(() => {
            self.resetAddress()
            self.addressModal = false
          }, 500)
        })
        document.getElementById('picker-bg').addEventListener('touchstart', (e) => {
          // e.preventDefault()
          setTimeout(() => {
            self.resetAddress()
            self.addressModal = false
          }, 500)
        })
        document.getElementById('picker-bg').addEventListener('click', (e) => {
          // e.preventDefault()
          setTimeout(() => {
            self.resetAddress()
            self.addressModal = false
          }, 500)
        })
      }
    },
    mounted () {
      this.addTouch()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .container {
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    background-color: $tenth-grey;
    .form-container {
      @include px2rem(padding-top, 88px);
      background-color: $white;
      .row-item {
        display: flex;
        align-items: center;
        border-bottom: 1px solid $second-grey;
        @include px2rem(height, 96px);
        label {
          @include px2rem(width, 262px);
          @include px2rem(padding-left, 36px);
          color: $primary-dark;
          @include font-dpr(15px);
        }
        a {
          @include px2rem(line-height, 96px);
          display: block;
          flex: 1;
          color: $third-dark;
          height: inherit;
        }
        input {
          flex: 1;
          background-color: transparent;
          border: none;
          height: inherit;
          @include font-dpr(14px);
          color: $third-dark;
        }
        ::-webkit-input-placeholder{
          @include font-dpr(14px);
          color: $third-dark;
        }
      }
    }
    .option-bar {
      @include px2rem(margin-top, 20px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      @include px2rem(height, 96px);
      background-color: $white;
      label {
        @include px2rem(padding-left, 36px);
        color: $primary-dark;
        @include font-dpr(15px);
      }
      .icon-box {
        @include px2rem(margin-right, 36px);
        color: $green;
        i {
          @include font-dpr(20px);
        }
      }
    }
    a:active {
      background-color: rgba(239, 234, 234, .5);
    }
    .footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      a {
        @include px2rem(height, 100px);
        @include font-dpr(18px);
      }
      a:active {
        background-color: rgba(82, 202, 167, .5);
      }
    }
    .modal {
      position: fixed;
      @include px2rem(top, 190px);
      @include px2rem(bottom, 100px);
      @include px2rem(width, 620px);
      overflow-y: scroll;
      z-index: 1004;
    }
    .modal-header {
      z-index: 1004;
      position: fixed;
      @include px2rem(top, 100px);
      @include px2rem(width, 620px);
      @include px2rem(height, 90px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: $third-grey;
      @include font-dpr(15px);
      p {
        @include px2rem(padding-left, 36px);
      }
      a {
        display: flex;
        align-items: center;
        height: inherit;
        @include pm2rem(padding, 0px, 36px, 0px, 36px);
      }
    }
    .picker-bg {
      position: fixed;
      top: 0;
      bottom: 0;
      width: 100%;
      background-color: rgba(0, 0, 0, .5);
      z-index: 1002;
    }
  }
</style>
