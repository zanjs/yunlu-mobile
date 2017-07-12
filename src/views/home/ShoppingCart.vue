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
  </section>
</template>

<script>
  import { getStore, removeStore } from '../../config/mUtils'
  export default {
    data () {
      return {
        token: getStore('user') ? getStore('user').authentication_token : null,
        purchaseItems: []
      }
    },
    methods: {
      async getPucrhaseItems () {
        let productResults = await this.commonRequest('/purchase_items', 'get', {token: this.token})
        if (productResults && productResults.purchase_items && productResults.purchase_items.length > 0) {
          let ids = this.handleIds(productResults.purchase_items, 'id')
          let fileIds = this.handleFileIds(productResults.purchase_items)
          let fileResults = await this.commonRequest('/links/files/publisheds', 'get', {type: 'product', thumbs: ['general'], ids: fileIds})
          let groupResults = await this.commonRequest('/purchase_items/groups', 'get', {token: this.token, ids: ids})
          if (groupResults && groupResults.groups && groupResults.groups.length > 0) {
            let teamIds = this.handleIds(groupResults.groups, 'organization_id')
            let teamResults = await this.commonRequest('/links/teams', 'get', {ids: teamIds})
            console.log(teamResults, fileResults, groupResults)
            if (teamResults && teamResults.teams && teamResults.teams.length > 0) {
              let newTeams = this.handleGroups(teamResults.teams, groupResults.groups)
              if (fileResults && fileResults.files && fileResults.files.length > 0) {
                this.purchaseItems = this.handleTeams(newTeams, fileResults.files)
              }
            }
          }
          // this.handlePurchaseItems(res.purchase_items, result.groups)
        }
      },
      getPucrhaseItemsRequest () {
        return new Promise((resolve, reject) => this.$store.dispatch('commonAction', {
          url: '/purchase_items',
          method: 'get',
          params: {
            token: this.token
          },
          target: this,
          resolve: (state, res) => {
            resolve(res.data.purchase_items)
          },
          reject: () => {
            reject(new Error(''))
          }
        }))
      },
      getFilesPublishedsRequest (ids) {
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
            this.productFiles = res.data.files
          },
          reject: () => {
          }
        })
      },
      getGroupPurchaseItemsRequest (ids) {
        return new Promise((resolve, reject) => this.$store.dispatch('commonAction', {
          url: '/purchase_items/groups',
          method: 'get',
          params: {
            token: this.token,
            ids: ids
          },
          target: this,
          resolve: (state, res) => {
            resolve(res.data.groups)
          },
          reject: () => {
            reject(new Error(''))
          }
        }))
      },
      getTeamDetail (ids) {
        this.$store.dispatch('commonAction', {
          url: '/links/teams',
          method: 'get',
          params: {
            ids: []
          },
          target: this,
          resolve: (state, res) => {
            this.teams = res.data.teams
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
      this.getPucrhaseItems()
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
</style>
