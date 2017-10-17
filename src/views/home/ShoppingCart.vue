<template>
  <section class="container">
    <common-header
      :title="header"
      @back="goBack()">
    </common-header>
    <template v-if="purchaseItems && purchaseItems.length > 0">
      <shopping-cart-list
        class="list-container"
        :store="purchaseItems"
        @check-group="checkGroup"
        @check-item="checkItem"
        @increase="increase"
        @decrease="decrease"
        @input="updateQuentity"
        @go-organization="goOrganization"
        @go-product-detail="goProductDetail">
      </shopping-cart-list>
      <div class="option-bar full-width">
        <a
          class="check-all-box"
          @click="handleAllCheck">
          <i
            v-if="checkAll"
            class="iconfont icon-xuanzhong font-21 primary"></i>
          <i
            v-if="!checkAll"
            class="iconfont icon-weixuanzhong font-21 third-text"></i>
          <span class="font-14 second-text">全选</span>
        </a>
        <a
          class="delete font-14 second-text"
          v-bind:class="{'disabled': !hasCheckItems}"
          @click="deleteConfirm()">删除</a>
        <p class="font-14 second">合计&nbsp;&nbsp;&yen;：{{totalMoney}}</p>
        <div
          v-if="!hasCheckItems"
          class="pay-btn white absolute-vertical flex font-15 pay-btn-disabled">
          支付
        </div>
        <a
          v-if="hasCheckItems"
          class="pay-btn white absolute-vertical flex font-15"
          @click="pay()">支付</a>
      </div>
      <confirm-dialog
        v-if="showConfirm"
        :msg="confirmMsg"
        @click="deleteItem">
      </confirm-dialog>
    </template>
    <template v-if="purchaseItems && purchaseItems.length === 0">
      <div class="empty-container">
        <div class="img-container">
          <img src="../../assets/empryShoppingCart.png">
        </div>
        <p class="font-16 third-text">您的购物车还没有宝贝呦~</p>
      </div>
    </template>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import { getStore, setStore, removeStore, mobileClient } from '../../config/mUtils'
  import ShoppingCartList from '../../components/product/ShoppingCartList'
  import ConfirmDialog from '../../components/common/ConfirmDialog'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        header: '购物车',
        token: getStore('user') ? getStore('user').authentication_token : null,
        purchaseItems: [],
        totalMoney: 0.00,
        checkAll: false,
        showConfirm: false,
        confirmMsg: '确定要删除选中的商品吗?',
        hasCheckItems: false,
        hasOnFocus: true
      }
    },
    components: {
      CommonHeader,
      ShoppingCartList,
      ConfirmDialog
    },
    methods: {
      getProducts () {
        this.$store.dispatch('commonAction', {
          url: '/purchase_items',
          method: 'get',
          params: {
            token: this.token
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.purchase_items.length > 0) {
              let groupIds = this.handleIds(res.data.purchase_items, 'id')
              if (groupIds.length > 0) {
                this.getProductGroups(groupIds, res.data.purchase_items)
              }
            } else {
              this.purchaseItems = []
            }
          },
          reject: () => {
          }
        })
      },
      getProductGroups (ids, products) {
        this.$store.dispatch('commonAction', {
          url: '/purchase_items/groups',
          method: 'get',
          params: {
            token: this.token,
            ids: ids
          },
          target: this,
          resolve: (state, res) => {
            let teamIds = this.handleIds(res.data.groups, 'organization_id')
            this.getTeams(teamIds, products, res.data.groups)
          },
          reject: () => {
          }
        })
      },
      getTeams (ids, products, groups) {
        this.$store.dispatch('commonAction', {
          url: '/links/teams',
          method: 'get',
          params: {
            token: this.token,
            ids: ids
          },
          target: this,
          resolve: (state, res) => {
            let ids = this.handleFileIds(products)
            this.getFilesPublisheds(ids, res.data.teams, groups)
          },
          reject: () => {
          }
        })
      },
      getFilesPublisheds (ids, teams, groups) {
        this.$store.dispatch('commonAction', {
          url: '/links/files/publisheds',
          method: 'get',
          params: {
            type: 'product',
            thumbs: ['general'],
            ids: ids
          },
          target: this,
          resolve: (state, res) => {
            let newTeams = this.handleGroups(teams, groups)
            this.purchaseItems = this.handleTeams(newTeams, res.data.files)
          },
          reject: () => {
          }
        })
      },
      handleGroups (teams, groups) {
        let tmpArr = [...teams]
        for (let i = 0; i < teams.length; i++) {
          for (let j = 0; j < groups.length; j++) {
            if (teams[i].id === groups[j].organization_id) {
              tmpArr[i].purchase_items = [...groups[j].purchase_items]
              tmpArr[i].checked = false
            }
          }
        }
        return tmpArr
      },
      handleTeams (teams, files) {
        let tmpArr = [...teams]
        for (let i = 0; i < teams.length; i++) {
          for (let j = 0; j < teams[i].purchase_items.length; j++) {
            for (let m = 0; m < files.length; m++) {
              if (teams[i].purchase_items[j].price.product.file_id === files[m].id) {
                tmpArr[i].purchase_items[j].price.product.file_url = files[m].url
                tmpArr[i].purchase_items[j].price.product.file_thumb_url = files[m].thumb_urls[0]
                tmpArr[i].purchase_items[j].checked = false
              }
            }
          }
        }
        return tmpArr
      },
      handleFileIds (arr) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].price) {
            tmpArr.push(arr[i].price.product.file_id)
          }
        }
        return tmpArr
      },
      handleIds (arr, prop) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          tmpArr.push(arr[i][prop])
        }
        return tmpArr
      },
      checkGroup (item) {
        for (let i = 0; i < this.purchaseItems.length; i++) {
          if (item.item.id === this.purchaseItems[i].id) {
            this.purchaseItems[i].checked = !item.checked
            for (let j = 0; j < this.purchaseItems[i].purchase_items.length; j++) {
              this.purchaseItems[i].purchase_items[j].checked = !item.checked
            }
          }
        }
        this.checkAll = this.isGroupChecked(this.purchaseItems)
        this.isItemChecked()
        this.handleTotalMoney()
      },
      checkItem (item) {
        for (let i = 0; i < this.purchaseItems.length; i++) {
          if (item.parentItem.id === this.purchaseItems[i].id) {
            for (let j = 0; j < this.purchaseItems[i].purchase_items.length; j++) {
              if (item.item.id === this.purchaseItems[i].purchase_items[j].id) {
                this.purchaseItems[i].purchase_items[j].checked = !item.checked
                this.purchaseItems[i].checked = this.isGroupChecked(this.purchaseItems[i].purchase_items)
                this.checkAll = this.isGroupChecked(this.purchaseItems)
              }
            }
          }
        }
        this.isItemChecked()
        this.handleTotalMoney()
      },
      isGroupChecked (arr) {
        let count = 0
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].checked) {
            count += 1
          }
        }
        return count === arr.length
      },
      increase (item) {
        for (let i = 0; i < this.purchaseItems.length; i++) {
          if (item.parentItem.id === this.purchaseItems[i].id) {
            for (let j = 0; j < this.purchaseItems[i].purchase_items.length; j++) {
              if (item.item.price.product.id === this.purchaseItems[i].purchase_items[j].price.product.id) {
                this.purchaseItems[i].purchase_items[j].quantity = parseInt(this.purchaseItems[i].purchase_items[j].quantity + '')
                this.purchaseItems[i].purchase_items[j].quantity += 1
              }
            }
          }
        }
        this.updateShoppingCartRequest(item.item.id, item.item.quantity)
        this.handleTotalMoney()
      },
      decrease (item) {
        for (let i = 0; i < this.purchaseItems.length; i++) {
          if (item.parentItem.id === this.purchaseItems[i].id) {
            for (let j = 0; j < this.purchaseItems[i].purchase_items.length; j++) {
              if (item.item.price.product.id === this.purchaseItems[i].purchase_items[j].price.product.id) {
                this.purchaseItems[i].purchase_items[j].quantity = parseInt(this.purchaseItems[i].purchase_items[j].quantity + '')
                this.purchaseItems[i].purchase_items[j].quantity -= 1
              }
            }
          }
        }
        this.updateShoppingCartRequest(item.item.id, item.item.quantity)
        this.handleTotalMoney()
      },
      isItemChecked () {
        let canDelete = false
        for (let i = 0; i < this.purchaseItems.length; i++) {
          if (this.purchaseItems[i].checked) {
            canDelete = true
            break
          }
          for (let j = 0; j < this.purchaseItems[i].purchase_items.length; j++) {
            if (this.purchaseItems[i].purchase_items[j].checked) {
              canDelete = true
              break
            }
          }
        }
        this.hasCheckItems = canDelete
      },
      deleteConfirm () {
        let canDelete = false
        for (let i = 0; i < this.purchaseItems.length; i++) {
          if (this.purchaseItems[i].checked) {
            canDelete = true
            break
          }
          for (let j = 0; j < this.purchaseItems[i].purchase_items.length; j++) {
            if (this.purchaseItems[i].purchase_items[j].checked) {
              canDelete = true
              break
            }
          }
        }
        this.showConfirm = canDelete
      },
      deleteItem (bool, ids) {
        this.showConfirm = false
        if (bool) {
          let ids = this.handleCheckedItems()
          this.deleteItemRequest(ids)
        }
      },
      handleCheckedItems () {
        let tmpArr = []
        for (let i = 0; i < this.purchaseItems.length; i++) {
          for (let j = 0; j < this.purchaseItems[i].purchase_items.length; j++) {
            if (this.purchaseItems[i].purchase_items[j].checked) {
              tmpArr.push(this.purchaseItems[i].purchase_items[j].id)
            }
          }
        }
        return tmpArr
      },
      deleteItemRequest (ids) {
        this.$store.dispatch('commonAction', {
          url: '/purchase_items',
          method: 'delete',
          params: {},
          data: {
            token: this.token,
            ids: ids
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.ids && res.data.ids.length > 0) {
              Toast({
                message: '删除成功',
                duration: 500
              })
              this.hasCheckItems = false
              this.getProducts()
            }
          },
          reject: () => {
            Toast({
              message: '删除失败',
              duration: 500
            })
          }
        })
      },
      goBack () {
        if (getStore('ShoppingCart_goHome')) {
          removeStore('ShoppingCart_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      goOrganization (item) {
        if (item.service.aliaz === 'association') {
          this.$router.push({name: 'ComityCarte', params: {id: item.id}})
        } else {
          this.$router.push({name: 'EnterpriseCarte', params: {id: item.id}})
        }
      },
      goProductDetail (item) {
        this.$router.push({name: 'ProductDetail', params: {id: item.price.product.id}})
      },
      handleAllCheck () {
        for (let i = 0; i < this.purchaseItems.length; i++) {
          this.purchaseItems[i].checked = !this.checkAll
          for (let j = 0; j < this.purchaseItems[i].purchase_items.length; j++) {
            this.purchaseItems[i].purchase_items[j].checked = !this.checkAll
          }
        }
        this.checkAll = !this.checkAll
        this.isItemChecked()
        this.handleTotalMoney()
      },
      handleTotalMoney () {
        let totalMoney = 0
        for (let i = 0; i < this.purchaseItems.length; i++) {
          for (let j = 0; j < this.purchaseItems[i].purchase_items.length; j++) {
            if (this.purchaseItems[i].purchase_items[j].checked && !isNaN(parseFloat(this.purchaseItems[i].purchase_items[j].price.money + ''))) {
              totalMoney += parseFloat(this.purchaseItems[i].purchase_items[j].price.money + '') * parseInt(this.purchaseItems[i].purchase_items[j].quantity + '')
            }
          }
        }
        this.totalMoney = totalMoney
      },
      updateQuentity (item) {
        this.hasOnFocus = true
        for (let i = 0; i < this.purchaseItems.length; i++) {
          if (item.parentItem.id === this.purchaseItems[i].id) {
            for (let j = 0; j < this.purchaseItems[i].purchase_items.length; j++) {
              if (item.item.price.product.id === this.purchaseItems[i].purchase_items[j].price.product.id) {
                this.purchaseItems[i].purchase_items[j].quantity = parseInt(item.quantity + '')
              }
            }
          }
        }
        this.updateShoppingCartRequest(item.item.id, item.quantity)
      },
      updateShoppingCartRequest (id, quantity) {
        this.$store.dispatch('commonAction', {
          url: `/purchase_items/${id}`,
          method: 'put',
          params: {},
          data: {
            token: this.token,
            quantity: quantity
          },
          target: this,
          resolve: (state, res) => {
            // 该机构新增了一条访客记录
            if (res.data.id === id) {
              // 更新购物车中商品数量成功
              this.hasOnFocus = false
            } else {
              let toast = Toast({
                message: '更改商品数量失败',
                duration: 1000
              })
              setTimeout(() => {
                clearTimeout(toast)
                this.getProducts()
              }, 1000)
            }
          },
          reject: () => {
          }
        })
      },
      pay () {
        Toast({
          message: '暂未开放',
          duration: 500
        })
      },
      goLogin () {
        setStore('beforeLogin', 'true')
        this.$router.push({name: 'Login'})
      },
      shouldLogin () {
        if (mobileClient() === 'weixin' && (!getStore('user') || !getStore('user').authentication_token)) {
          this.goLogin()
        } else {
          this.getProducts()
        }
      }
    },
    mounted () {
      this.shouldLogin()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .container {
    background-color: $sixth-grey;
    @include pm2rem(padding, 0px, 0px, 98px, 0px);
  }
  .list-container {
    @include pm2rem(padding, 88px, 0px, 0px, 0px);
    background-color: $primary-grey;
  }
  .option-bar {
    position: fixed;
    bottom: 0;
    @include px2rem(height, 98px);
    line-height: 1;
    background-color: $white;
    display: flex;
    align-items: center;
    border-top: 1px solid $third-grey;
    border-bottom: 1px solid $third-grey;
    .check-all-box {
      @include px2rem(padding-left, 28px);
      display: flex;
      align-items: center;
      height: inherit;
      @include px2rem(margin-right, 48px);
      line-height: normal;
      i {
        @include px2rem(margin-right, 12px);
      }
    }
    .delete {
      @include px2rem(margin-right, 34px);
      height: inherit;
      display: flex;
      align-items: center;
      line-height: normal;
    }
    .disabled {
      color: $fourth-grey;
    }
    p {
      font-weight: bold;
      line-height: normal;
    }
    .pay-btn {
      @include px2rem(width, 150px);
      @include px2rem(height, 70px);
      @include px2rem(border-radius, 35px);
      @include px2rem(right, 28px);
      background: linear-gradient(to bottom right, #ff7f46 , #ff5001);
    }
    .pay-btn-disabled {
      background: $fourth-grey;
    }
  }
   .empty-container {
    @include pm2rem(padding, 176px, 0px, 0px, 0px);
    .img-container {
      @include pm2rem(padding, 90px, 0px, 40px, 0px);
      text-align: center;
      img {
        @include px2rem(width, 278px);
        @include px2rem(height, 341px);
      }
    }
    p {
      text-align: center;
    }
  }
</style>
