<template>
  <section>
    <mt-header
      title="购物车"
      fixed
      class="header">
      <mt-button
        slot="left"
        @click="goBack()"
        class="button-text">
        <i class="iconfont icon-fanhui"></i>
      </mt-button>
    </mt-header>
    <template v-if="purchaseItems && purchaseItems.length > 0">
      <shopping-cart-list
        class="list-container"
        :store="purchaseItems"
        @check-group="checkGroup"
        @check-item="checkItem"
        @increase="increase"
        @decrease="decrease">
      </shopping-cart-list>
    </template>
  </section>
</template>

<script>
  import { getStore, removeStore } from '../../config/mUtils'
  import ShoppingCartList from '../../components/product/ShoppingCartList'
  export default {
    data () {
      return {
        token: getStore('user') ? getStore('user').authentication_token : null,
        purchaseItems: []
      }
    },
    components: {
      ShoppingCartList
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
            let groupIds = this.handleIds(res.data.purchase_items, 'id')
            this.getProductGroups(groupIds, res.data.purchase_items)
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
            this.getFilesPublisheds(ids, products, res.data.teams, groups)
          },
          reject: () => {
          }
        })
      },
      getFilesPublisheds (ids, products, teams, groups) {
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
          tmpArr.push(arr[i].price.product.file_id)
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
      },
      checkItem (item) {
        for (let i = 0; i < this.purchaseItems.length; i++) {
          if (item.parentItem.id === this.purchaseItems[i].id) {
            for (let j = 0; j < this.purchaseItems[i].purchase_items.length; j++) {
              if (item.item.id === this.purchaseItems[i].purchase_items[j].id) {
                this.purchaseItems[i].purchase_items[j].checked = !item.checked
                this.purchaseItems[i].checked = this.isGroupChecked(this.purchaseItems[i].purchase_items)
              }
            }
          }
        }
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
        console.log(item)
      },
      decrease (item) {
        console.log(item)
      },
      goBack () {
        if (getStore('ShoppingCart_goHome')) {
          removeStore('ShoppingCart_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      commonRequest (url, method, params) {
        return new Promise((resolve, reject) => this.$store.dispatch('commonAction', {
          url: url,
          method: method,
          params: params,
          target: this,
          resolve: (state, res) => {
            resolve(res.data)
          },
          reject: () => {
            reject(new Error(''))
          }
        }))
      }
    },
    mounted () {
      this.getProducts()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

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
  .list-container {
    @include px2rem(padding-top, 88px);
    background-color: #E7E7E7;
  }
</style>
