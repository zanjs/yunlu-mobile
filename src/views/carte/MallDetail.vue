<template>
  <section>
    <div class="container full-width">
      <common-header
        :title="header"
        @back="goBack()">
      </common-header>
      <div class="container" ref="mallDetail" :style="{height: scrollHeight}">
        <div class="card-container">
          <enterprise-card
            :store="teams"
            :products="products"
            @icon-click="iconClick"
            @click="goEnterpriseDetail">
          </enterprise-card>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import EnterpriseCard from '../../components/common/EnterpriseCard'
  import { getStore, removeStore } from '../../config/mUtils'
  export default {
    props: ['id'],
    name: 'MallDetail',
    data () {
      return {
        header: '商城详情',
        teams: null,
        products: [],
        productLoading: true,
        productPageIndex: 1,
        productPageSize: 10,
        scrollHeight: '15rem'
      }
    },
    components: {
      CommonHeader,
      EnterpriseCard
    },
    methods: {
      iconClick (item) {
        switch (item.type) {
          case 'chat':
            if (!this.hasLogin) {
              this.goLogin()
            } else {
              this.$router.push({name: 'Chat', query: {type: 'Product', productId: item.value}})
            }
            break
          case 'email':
            this.showPopDialog(2, '邮箱地址', item.value)
            break
          case 'website':
            window.location.href = item.value.indexOf('http') > -1 ? item.value : `http://${item.value}`
            break
          case 'qq':
            this.showPopDialog(0, 'QQ号', item.value)
            break
          case 'address':
            if (item.value.latitude && item.value.longitude) {
              this.$router.push({name: 'Maps', query: {lat: item.value.latitude, lng: item.value.longitude, title: this.teams.company}})
            } else {
              this.$router.push({name: 'Maps', query: {lat: '', lng: '', title: this.teams.company, address: item.value.address}})
            }
            break
        }
      },
      goLogin () {
        this.$store.dispatch('switchIntegralDialog', {status: true})
      },
      goEnterpriseDetail (id) {
        if (!this.hasLogin) {
          this.goLogin()
        } else {
          this.$router.push({name: 'EnterpriseDetail', params: {id: id}})
        }
      },
      getEnterpriseDetail () {
        this.$store.dispatch('commonAction', {
          url: '/links/teams',
          method: 'get',
          params: {
            ids: this.id
          },
          target: this,
          resolve: (state, res) => {
            this.teams = res.data.teams[0]
            this.getProducts()
          },
          reject: () => {
          }
        })
      },
      getProducts () {
        this.productLoading = true
        this.$store.dispatch('commonAction', {
          url: '/products',
          method: 'get',
          params: {
            team_id: this.id,
            page: this.productPageIndex,
            per_page: this.productPageSize
          },
          target: this,
          resolve: (state, res) => {
            this.productLoading = false
            this.products = res.data.products
          },
          reject: () => {
            this.productLoading = false
          }
        })
      },
      goBack () {
        if (getStore('MallDetail_goHome')) {
          removeStore('MallDetail_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      }
    },
    mounted () {
      let appHeight = document.getElementById('app').offsetHeight
      let rootFontSize = document.documentElement.style.fontSize.split('p')[0]
      let divHeight = (appHeight / parseFloat(rootFontSize + '')).toFixed(2)
      this.scrollHeight = `${Math.round(divHeight * 100) / 100}rem`
      this.getEnterpriseDetail(this.id)
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

</style>
