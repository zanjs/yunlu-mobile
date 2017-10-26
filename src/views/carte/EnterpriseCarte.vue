<template>
  <section
    class="container full-width"
    ref="enterpriseCarte"
    :style="{height: scrollHeight}">
    <common-header
      :title="header"
      :icon-class="iconClass"
      :right-text="rightBtnText"
      @right-click="goReport(teams)"
      @back="goBack()">
    </common-header>
    <div class="card-container">
      <enterprise-card
        :store="teams"
        :products="products"
        @icon-click="iconClick"
        @click="goEnterpriseDetail">
      </enterprise-card>
    </div>
    <div class="four-nav-tabs">
      <div class="tab-bar primary flex font-17">
        <div
          class="left flex-1 white-bg"
          v-bind:class="{'active-bg white': showProduct}"
          @click.prevent="tabClick(0)">产品</div>
        <div
          class="middle right flex-1 white-bg"
          v-bind:class="{'active-bg white': !showProduct}"
          @click.prevent="tabClick(1)">资讯</div>
      </div>
      <div class="tab-container">
        <transition
          name="fade"
          :appear="true"
          mode="out-in">
          <template v-if="showProduct">
            <template v-if="products && products.length > 0">
              <div>
                <transition
                  name="fade"
                  :appear="true"
                  mode="out-in">
                  <product-list-mode
                    v-if="showList"
                    :store="products"
                    @click="goProductDetail">
                  </product-list-mode>
                  <product-thumbnail-mode
                    v-else
                    :store="products"
                    @click="goProductDetail">
                  </product-thumbnail-mode>
                </transition>
                <mugen-scroll
                  :handler="loadProductBottom"
                  :handle-on-mount="false"
                  :should-handle="!loading"
                  scroll-container="enterpriseCarte">
                  <div
                    v-if="loading || noMoreProducts"
                    class="loading">
                    <mt-spinner
                      v-show="loading"
                      type="snake"
                      :size="18">
                    </mt-spinner>
                    <p>{{loadingText}}</p>
                  </div>
                </mugen-scroll>
              </div>
            </template>
            <div
              v-else
              key="product1"
              class="no-data">
                <img src="../../assets/noProduct.png">
            </div>
          </template>
          <template v-else>
            <template v-if="enterpriseInfoFiles && enterpriseInfoFiles.length > 0">
              <information-list
                key="information"
                :store="enterpriseInfoFiles"
                @click="openInformationFolders">
              </information-list>
            </template>
            <div
              v-else
              key="information1"
              class="no-data">
              <img src="../../assets/noInformation.png">
            </div>
          </template>
        </transition>
        <favorite-btn
          :show="teams"
          :single="!showGoTopBtn"
          :text="favoratesText"
          @click="favoriteAction()">
        </favorite-btn>
        <back-to-top
          :show="showGoTopBtn"
          @click="goScroll(0)">
        </back-to-top>
      </div>
    </div>
    <search
      :show="showSearchBar"
      @search="handleSearchBtn(queryParams)">
      <input
        slot="input"
        type="search"
        v-model="queryParams"
        @keyup.enter.prevent="handleSearchBtn(queryParams)"
        :placeholder="placeholder">
    </search>
    <order
      :show="showSearchBar && showProduct"
      :order-up="orderUp"
      :show-list="showList"
      @order-change="orderChange"
      @switch="showListChange">
    </order>
    <template v-if="showDialog">
      <pop-dialog
        :store="message"
        @close="closeDialog">
      </pop-dialog>
    </template>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import EnterpriseCard from '../../components/common/EnterpriseCard'
  import ProductThumbnailMode from '../../components/product/Thumbnail'
  import ProductListMode from '../../components/product/List'
  import InformationList from '../../components/common/InformationList'
  import { getStore, setStore, showBack, removeStore, setScrollTop } from '../../config/mUtils'
  import PopDialog from '../../components/common/PopDialog'
  import Search from '../../components/common/Search'
  import Order from '../../components/common/Order'
  import BackToTop from '../../components/common/BackToTop'
  import FavoriteBtn from '../../components/common/FavoriteBtn'
  import { Toast } from 'mint-ui'
  import { requestFn } from '../../config/request'
  import MugenScroll from 'vue-mugen-scroll'
  export default {
    props: ['id'],
    name: 'EnterpriseCarte',
    data () {
      return {
        teamId: this.$route.params.id,
        header: '名片',
        rightBtnText: '投诉',
        iconClass: 'icon-jubao',
        height: 153,
        hasLogin: !!getStore('user'),
        token: getStore('user') ? getStore('user').authentication_token : null,
        hasSearch: false,
        showProduct: true,
        showSearchBar: false,
        placeholder: '搜索产品',
        productPageIndex: 1,
        productPageSize: 10,
        queryParams: '',
        orderUp: true,
        productOrder: 1,
        showList: false,
        currentIndex: 0,
        showGoTopBtn: false,
        showDialog: false,
        message: null,
        loading: true,
        loadingText: '加载中...',
        noMoreProducts: false,
        favoratesText: '收藏',
        hasAddFavorites: false,
        scrollHeight: '14rem',
        scrollActive: false,
        teams: null,
        products: [],
        productsThumbnails: [],
        enterpriseInfoFiles: [],
        enterpriseDocuments: []
      }
    },
    components: {
      CommonHeader,
      EnterpriseCard,
      ProductThumbnailMode,
      ProductListMode,
      InformationList,
      PopDialog,
      Search,
      Order,
      BackToTop,
      FavoriteBtn,
      MugenScroll
    },
    methods: {
      async getTeams (teamId = this.id) {
        let {res} = await requestFn({
          url: '/links/teams',
          params: {
            ids: teamId
          }
        })
        if (res.data) {
          this.teams = res.data.teams[0]
          this.getProducts()
          this.handleFavoriteStatus(res.data.teams[0].enterprise_id)
        }
      },
      async getProducts (q = this.queryParams, order = this.productOrder) {
        this.loading = true
        this.queryParams = q
        this.productOrder = order
        let {res} = await requestFn({
          url: '/products',
          params: {
            team_id: this.id,
            page: this.productPageIndex,
            per_page: this.productPageSize,
            sort: order || '',
            q: q || ''
          }
        })
        if (res.data) {
          this.hasSearch = q !== ''
          let tmppArr = this.handleProductThumbnails(res.data.products)
          if (res.data.products.length === 0) {
            this.loading = false
            if (this.productPageIndex !== 1) {
              this.loadingText = '没有更多数据了...'
              this.noMoreProducts = true
            } else {
              this.products = []
            }
          } else {
            this.getFilesPublisheds(tmppArr, res.data.products, q)
          }
        } else {
          this.loading = false
        }
      },
      // 手机QQ浏览器不支持array.findIndex方法
      handleProducts (arr, arr2) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          tmpArr.push({
            ...arr[i],
            file_url: '',
            file_thumb_urls: ''
          })
        }
        for (let i = 0; i < arr2.length; i++) {
          for (let j = 0; j < tmpArr.length; j++) {
            if (arr2[i].id === tmpArr[j].file_id) {
              tmpArr[j].file_url = arr2[i].url
              tmpArr[j].file_thumb_urls = arr2[i].thumb_urls[0]
              break
            }
          }
        }
        return tmpArr
      },
      handleProductThumbnails (arr) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          tmpArr.push(arr[i].file_id)
        }
        return tmpArr
      },
      getInformation (ids) {
        this.$store.dispatch('commonAction', {
          url: '/links/files/publisheds',
          method: 'get',
          params: {
            type: 'document',
            team_id: this.id,
            thumbs: ['general'],
            ids: ids
          },
          target: this,
          resolve: (state, res) => {
            this.enterpriseInfoFiles = this.handleEnterpriseInfoFiles(this.enterpriseDocuments, res.data.files)
          },
          reject: () => {
          }
        })
      },
      // 手机QQ浏览器及UC浏览器不支持array.findIndex方法
      handleEnterpriseInfoFiles (enterpriseDocuments, files) {
        for (let i = 0; i < files.length; i++) {
          for (let j = 0; j < enterpriseDocuments.length; j++) {
            if (files[i].id === enterpriseDocuments[j].file_id) {
              files[i].name = enterpriseDocuments[j].name
              files[i].count = enterpriseDocuments[j].count
              switch (enterpriseDocuments[j].name) {
                case null:
                  files[i].cnname = '其他'
                  break
                case 'Certificate':
                  files[i].cnname = '社会身份'
                  break
                case 'Case':
                  files[i].cnname = '案例'
                  break
                case 'Information':
                  files[i].cnname = '资讯'
                  break
                case 'Notification':
                  files[i].cnname = '通知'
                  break
                case 'SaleCertificate':
                  files[i].cnname = '销售资质'
                  break
                default:
                  files[i].cnname = '其他'
                  break
              }
            }
          }
        }
        return files
      },
      // 获取指定组织已发布的公司档分类概况(公司/企业名片资讯)
      getEnterpriseDocument (teamId) {
        this.$store.dispatch('commonAction', {
          url: '/archives/stat/types',
          method: 'get',
          params: {
            team_id: this.id
          },
          target: this,
          resolve: (state, res) => {
            this.enterpriseDocuments = res.data.types.filter(i => i.file_id !== null)
            this.getInformation(this.handleDocumentIds(this.enterpriseDocuments))
          },
          reject: () => {
          }
        })
      },
      handleDocumentIds (arr) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          tmpArr.push(arr[i].file_id)
        }
        return tmpArr
      },
      async getFilesPublisheds (ids, arr, q) {
        let {res} = await requestFn({
          url: '/links/files/publisheds',
          params: {
            type: 'product',
            team_id: this.id,
            thumbs: ['general'],
            ids: ids
          }
        })
        this.loading = false
        if (res.data) {
          if (this.productPageIndex === 1) {
            this.products = this.handleProducts(arr, res.data.files)
            this.productsThumbnails = res.data.files
          } else {
            this.products = [...this.products, ...this.handleProducts(arr, res.data.files)]
            this.productsThumbnails = [...this.productsThumbnails, ...res.data.files]
          }
          this.getEnterpriseDocument()
        }
      },
      goBack () {
        if (this.hasSearch) {
          setScrollTop(0, this.$refs.enterpriseCarte)
          this.getProducts('', 'price')
        } else if (getStore('EnterpriseCarte_goHome')) {
          removeStore('EnterpriseCarte_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      goReport (item) {
        this.$router.push({name: 'Report', query: {resourceId: item.enterprise_id, resourceClass: 'product'}})
      },
      tabClick (val) {
        this.showProduct = val === 0
        this.placeholder = val === 0 ? '搜索产品' : '搜索资讯'
        this.currentIndex = val
        this.handleSearchBar()
      },
      search (res) {
        if (this.showProduct) {
          this.getProducts(res)
        }
      },
      handleSearchBtn (res) {
        // 每次搜索需重置分页索引，并滚动到指定高度(让搜索框显示出来，表明这是搜索结果)
        this.productPageIndex = 1
        setScrollTop(158, this.$refs.enterpriseCarte)
        this.search(res)
        document.activeElement.blur()
      },
      handleSearchBar () {
        if (!this.scrollActive) {
          showBack((status) => {
            this.showGoTopBtn = status
            this.scrollActive = true // 滚动监听被激活，不需要再次监听
            if (this.currentIndex === 1) {
              this.showSearchBar = false
              this.header = '名片'
            } else {
              this.showSearchBar = status
              this.header = status ? '产品' : '名片'
            }
          }, this.height, this.$refs.enterpriseCarte)
        }
      },
      goScroll (scroll) {
        setScrollTop(scroll, this.$refs.enterpriseCarte)
      },
      goProductDetail (item) {
        this.$router.push({name: 'ProductDetail', params: {id: item.id}})
      },
      goEnterpriseDetail (id) {
        if (!this.hasLogin) {
          this.goLogin()
        } else {
          this.$router.push({name: 'EnterpriseDetail', params: {id: id}})
        }
      },
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
        setStore('beforeLogin', 'true')
        this.$router.push({name: 'Login'})
      },
      showPopDialog (type, name, value) {
        this.message = {
          type: type,
          name: name,
          value: value
        }
        this.showDialog = true
      },
      openInformationFolders (item) {
        this.$router.push({name: 'InformationFolders', params: {id: this.id}, query: {type: item.name || ''}})
      },
      showListChange (val) {
        this.showList = val
      },
      orderChange (val) {
        this.orderUp = val
        this.productOrder = val ? 1 : -1
        this.productPageIndex = 1 // 调整价格排序后，需要从第一页重新开始获取产品数据
        this.getProducts(this.queryParams, this.productOrder)
      },
      loadProductBottom (infinite) {
        if (!this.noMoreProducts) {
          this.productPageIndex += 1
          this.getProducts()
        }
      },
      closeDialog () {
        this.showDialog = false
      },
      favoriteAction () {
        if (!this.hasLogin) {
          this.goLogin()
        } else if (!this.hasAddFavorites) {
          this.favoriteRequest()
        } else {
          this.removeFavorites()
        }
      },
      removeFavorites () {
        this.$store.dispatch('commonAction', {
          url: `/favorites/${this.id}`,
          method: 'delete',
          params: {},
          data: {
            token: this.token,
            id: this.id,
            type: 'Organization'
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.favorable_id === this.id) {
              this.hasAddFavorites = false
              this.favoratesText = '收藏'
              Toast({
                message: '您已取消收藏该企业',
                duration: 500
              })
            }
          },
          reject: () => {
            Toast({
              message: '取消收藏失败，请重试',
              duration: 500
            })
          }
        })
      },
      favoriteRequest () {
        this.$store.dispatch('commonAction', {
          url: '/favorites',
          method: 'post',
          params: {},
          data: {
            token: this.token,
            team_id: this.id
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.favorites && res.data.favorites.id === parseInt(this.id)) {
              this.hasAddFavorites = true
              this.favoratesText = '已收藏'
              Toast({
                message: '你已成功收藏该企业',
                className: 'toast-content',
                iconClass: 'iconfont icon-caozuochenggong toast-icon-big',
                duration: 1000
              })
            } else {
              Toast({
                message: '收藏该企业失败',
                duration: 1000
              })
            }
          },
          reject: () => {
          }
        })
      },
      handleFavoriteStatus (id) {
        if (this.hasLogin) {
          this.getTeamDetail(id)
        }
      },
      async getTeamDetail (id) {
        let { res } = await requestFn({
          url: `/enterprises/${id}/details`,
          params: {
            token: this.token
          }
        })
        if (res.data) {
          this.hasAddFavorites = res.data.enterprises.organization.favorable
          this.favoratesText = res.data.enterprises.organization.favorable ? '已收藏' : '收藏'
        }
      }
    },
    mounted () {
      let appHeight = document.getElementById('app').offsetHeight
      let rootFontSize = document.documentElement.style.fontSize.split('p')[0]
      let divHeight = (appHeight / parseFloat(rootFontSize + '')).toFixed(2)
      this.scrollHeight = `${Math.round(divHeight * 100) / 100}rem`
    },
    activated () {
      if (!this.$store.state.popState || this.$store.state.fromLogin) {
        setScrollTop(0, this.$refs.enterpriseCarte)
        this.hasLogin = !!getStore('user')
        this.token = getStore('user') ? getStore('user').authentication_token : null
        this.getTeams(this.id)
        this.handleSearchBar()
      } else {
        setScrollTop(this.$store.state.scrollMap.EnterpriseCarte || 0, this.$refs.enterpriseCarte)
      }
    },
    beforeRouteLeave (to, from, next) {
      this.$store.dispatch('saveScroll', {name: 'EnterpriseCarte', value: this.$refs.enterpriseCarte.scrollTop})
      if (to.name !== 'ProductDetail' && to.name !== 'InformationFolders' && to.name !== 'Chat' && to.name !== 'Login') {
        this.showGoTopBtn = false
        this.showSearchBar = false
        this.productPageIndex = 1
        this.noMoreProducts = false
        this.currentIndex = 0
        this.favoratesText = '收藏'
        this.loadingText = '加载中...'
        this.hasAddFavorites = false
        this.teams = null
        this.products = []
        this.productsThumbnails = []
        this.enterpriseInfoFiles = []
        this.enterpriseDocuments = []
      }
      next()
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .container {
    position: absolute;
    top: 0;
    overflow-y: scroll;
    background-color: $tenth-grey;
  }
</style>
