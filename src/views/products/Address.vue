<template>
  <section class="container">
    <common-header
      :title="header"
      @back="goBack()">
    </common-header>
    <div class="address-list">
      <address-item
        v-for="(item, index) in deliveries"
        :key="index"
        :store="item"
        @click="itemSelected"
        @checked="itemChecked"
        @delete="itemDelete"
        @edit="itemEdit">
      </address-item>
    </div>
    <confirm-dialog
      v-if="showConfirm"
      :msg="confirmMsg"
      @click="handleConfirm">
    </confirm-dialog>
    <footer class="footer full-width">
      <a @click="goAddAddress()">添加收获地址</a>
    </footer>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import AddressItem from '../../components/product/AddressItem'
  import ConfirmDialog from '../../components/common/ConfirmDialog'
  import { getStore, setStore, removeStore } from '../../config/mUtils'
  export default {
    data () {
      return {
        header: '管理收获地址',
        token: getStore('user') ? getStore('user').authentication_token : '',
        deliveries: [],
        confirmMsg: '是否要删除该地址？',
        showConfirm: false,
        deleteItemId: null
      }
    },
    components: {
      CommonHeader,
      AddressItem,
      ConfirmDialog
    },
    methods: {
      goBack () {
        if (getStore('Address_goHome')) {
          removeStore('Address_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
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
            this.deliveries = res.data.deliveries
          },
          reject: () => {
          }
        })
      },
      setDefaultAddress (id) {
        this.$store.dispatch('commonAction', {
          url: `/deliveries/${id}`,
          method: 'put',
          params: {},
          data: {
            token: this.token,
            id: id,
            state: 'default'
          },
          target: this,
          resolve: (state, res) => {
            this.getDeliveries(this.token)
          },
          reject: () => {
          }
        })
      },
      itemSelected (id) {
        if (this.$route.query.from === 'orderpaying') {
          setStore('selectedAddressId', id)
          this.$router.go(-1)
        }
      },
      itemChecked (item) {
        if (item.state !== 'default') {
          this.setDefaultAddress(item.id)
        }
      },
      itemDelete (id) {
        this.deleteItemId = id
        this.showConfirm = true
      },
      handleConfirm (bool) {
        this.showConfirm = false
        if (bool) {
          this.deleteItemRequest(this.deleteItemId)
        }
      },
      deleteItemRequest (id) {
        this.$store.dispatch('commonAction', {
          url: `/deliveries/${id}`,
          method: 'delete',
          params: {},
          data: {
            token: this.token,
            id: id
          },
          target: this,
          resolve: (state, res) => {
            this.getDeliveries(this.token)
          },
          reject: () => {
          }
        })
      },
      goAddAddress () {
        removeStore('editAddress')
        this.$router.push({name: 'AddAddress', query: {from: 'manage', type: 'add'}})
      },
      itemEdit (item) {
        setStore('editAddress', item)
        this.$router.push({name: 'AddAddress', query: {from: 'manage', type: 'edit'}})
      }
    },
    mounted () {
      this.getDeliveries(this.token)
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .container {
    background-color: $tenth-grey;
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
  }
  .address-list {
    @include px2rem(padding-top, 88px);
    @include px2rem(margin-bottom, 100px);
  }
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    @include px2rem(height, 100px);
    a {
      height: inherit;
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      background-color: #FF5001;
      color: $white;
      @include font-dpr(18px);
    }
  }
</style>
