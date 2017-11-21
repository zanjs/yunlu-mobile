<template>
  <section class="full-width">
    <div class="absolute-horizontal top-bg"></div>
    <mall-header
      class="mall-header"
      @back="goBack()"
      @search="handleSearchBtn(queryParams)"
      @click-categories="goCategories()"
      @report="goReport()">
      <input
        slot="input"
        type="search"
        v-model="queryParams"
        @keyup.enter.prevent="handleSearchBtn(queryParams)"
        :placeholder="placeholder">
    </mall-header>
    <div
      class="full-width fixed-nav-bar"
      :class="{'nav-show': hideIcon}">
      <div class="flex nav-bars">
        <a class="bar" :class="{'selected': activeIndex === 0}" @click="selectTab(0)">
          <div class="icon-box nav-icon">
            <i class="iconfont icon-shangjia"></i>
            <span>商城首页</span>
          </div>
          <div class="icon-box nav-text">
            <span>商城首页</span>
          </div>
          <div class="border"></div>
        </a>
        <a class="bar" :class="{'selected': activeIndex === 1}" @click="selectTab(1)">
          <div class="icon-box nav-icon">
            <i class="iconfont icon-shangjia"></i>
            <span>全部产品</span>
          </div>
          <div class="icon-box nav-text">
            <span>全部产品</span>
          </div>
          <div class="border"></div>
        </a>
        <a class="bar" :class="{'selected': activeIndex === 2}" @click="selectTab(2)">
          <div class="icon-box nav-icon">
            <i class="iconfont icon-shangjia"></i>
            <span>企业会员</span>
          </div>
          <div class="icon-box nav-text">
            <span>企业会员</span>
          </div>
          <div class="border"></div>
        </a>
        <a class="bar" :class="{'selected': activeIndex === 3}" @click="selectTab(3)">
          <div class="icon-box nav-icon">
            <i class="iconfont icon-shangjia"></i>
            <span>个人会员</span>
          </div>
          <div class="icon-box nav-text">
            <span>个人会员</span>
          </div>
          <div class="border"></div>
        </a>
      </div>
    </div>
    <div class="container" ref="newMallContainer" :style="{height: scrollHeight}">
      <div class="flex card">
        <div class="flex content">
          <div v-if="homeLoading || !teams || (teams && !teams.logo)" class="empty-img"></div>
          <img v-else :src="teams.logo">
          <div class="name">
            <span v-if="teams && teams.name" class="font-16">{{teams.name}}</span>
            <span v-else class="font-16">&nbsp;</span>
            <div class="flex favorite" @click="favoriteAction()">
              <i v-if="hasAddFavorites" class="iconfont icon-xuanzhong1 active"></i>
              <i v-else class="iconfont icon-shoucang2"></i>
              <span class="font-12">{{favoratesText}}</span>
            </div>
          </div>
        </div>
        <a class="flex btn">
          商城详情
        </a>
      </div>
      <div class="nav-container" :class="{'full-width nav-hide': hideIcon, 'noshadow': activeIndex === 1}">
        <div class="flex nav-bars">
          <a class="bar" :class="{'selected': activeIndex === 0}" @click="selectTab(0)">
            <div class="icon-box nav-icon">
              <i class="iconfont icon-shangjia"></i>
              <span>商城首页</span>
            </div>
            <div class="icon-box nav-text">
              <span>商城首页</span>
            </div>
            <div class="border"></div>
          </a>
          <a class="bar" :class="{'selected': activeIndex === 1}" @click="selectTab(1)">
            <div class="icon-box nav-icon">
              <p>{{allProductsLength | lengthFilter}}</p>
              <span>全部产品</span>
            </div>
            <div class="icon-box nav-text">
              <span>全部产品</span>
            </div>
            <div class="border"></div>
          </a>
          <a class="bar" :class="{'selected': activeIndex === 2}" @click="selectTab(2)">
            <div class="icon-box nav-icon">
              <p>{{enterprisesLength | lengthFilter}}</p>
              <span>企业会员</span>
            </div>
            <div class="icon-box nav-text">
              <span>企业会员</span>
            </div>
            <div class="border"></div>
          </a>
          <a class="bar" :class="{'selected': activeIndex === 3}" @click="selectTab(3)">
            <div class="icon-box nav-icon">
              <p>{{personLength | lengthFilter}}</p>
              <span>个人会员</span>
            </div>
            <div class="icon-box nav-text">
              <span>个人会员</span>
            </div>
            <div class="border"></div>
          </a>
        </div>
      </div>
      <div class="full-width mall-order">
        <mall-order
          v-show="activeIndex === 1"
          class="full-width order"
          :class="{'order-hide': hideIcon}"
          :sort-type="sortType"
          :order-up="orderUp"
          :show-list="showList"
          :hasFilter="selectedArea"
          @order-change="orderChange"
          @switch="showListChange"
          @sort-type-change="changeSortType"
          @switch-filter="switchFilter">
        </mall-order>
      </div>
      <transition name="fade" mode="out-in">
        <section v-if="activeIndex === 0" key="one">
          <div
            v-if="homeLoading && categories.length === 0"
            class="section-wrapper  empty-wrapper"
            :class="{'icon-hide': hideIcon}">
            <div class="flex section-title">
              <hr>
              <span class="font-14 third-text">推荐类别</span>
              <hr>
            </div>
            <div class="section-content">
              <a
                v-for="(item, index) in preLoadCategoriesLength"
                :key="index"
                class="flex item">
                <div class="empty-img"></div>
                <p class="flex ellipsis font-12"></p>
              </a>
            </div>
          </div>
          <div v-if="!homeLoading && categories.length > 0" class="section-wrapper" :class="{'icon-hide': hideIcon}">
            <div class="section-content">
              <a
                v-for="(item, index) in categories"
                :key="index"
                class="flex item">
                <img :src="item.thumb">
                <p class="flex ellipsis font-12">{{item.name}}</p>
              </a>
            </div>
          </div>
          <div  v-if="homeLoading || products.length > 0" class="section-wrapper">
            <div class="flex section-title">
              <hr>
              <span class="font-14 third-text">热卖爆款</span>
              <hr>
            </div>
            <product-grid
              :store="products"
              :loading="homeLoading"
              :num="productPageSize"
              @click="goProductDetail"
              @favorite="handleFavorite">
            </product-grid>
          </div>
          <div class="section-wrapper">
            <div class="flex section-title">
              <hr>
              <span class="font-14 third-text">商城推荐</span>
              <hr>
            </div>
            <mall-grid
              :store="malls"
              :loading="homeLoading"
              :num="preLoadMallsLength"
              @click="goMall">
            </mall-grid>
          </div>
        </section>
        <section
          v-if="activeIndex === 1"
          key="two"
          :class="{'product-icon-hide': hideIcon}">
          <transition name=fade mode="out-in">
            <div>
              <product-grid
                :store="allProducts"
                :loading="productLoading"
                :num="productPageSize"
                @click="goProductDetail"
                @favorite="handleFavorite">
              </product-grid>
              <mugen-scroll
                key="product"
                :handler="loadProductBottom"
                :handle-on-mount="false"
                :should-handle="!productLoading"
                :threshold="0.1"
                scroll-container="newMallContainer">
                <div class="loading">
                  <mt-spinner
                    v-show="!noMoreProducts"
                    type="snake"
                    :size="18">
                  </mt-spinner>
                  <p>{{productLoadingText}}</p>
                </div>
              </mugen-scroll>
            </div>
          </transition>
        </section>
        <section v-if="activeIndex === 2" key="three"></section>
        <section v-if="activeIndex === 3" key="four"></section>
      </transition>
    </div>
    <mall-order
      v-show="activeIndex === 1"
      class="full-width order"
      :class="{'order-hide': hideIcon}"
      :sort-type="sortType"
      :order-up="orderUp"
      :show-list="showList"
      :hasFilter="selectedArea"
      @order-change="orderChange"
      @switch="showListChange"
      @sort-type-change="changeSortType"
      @switch-filter="switchFilter">
    </mall-order>
    <product-filter
      :show="activeIndex === 1 && useFilter"
      :areas="areas"
      :selected-area="selectedArea"
      @close="closeFilter"
      @choose-area="choooseArea"
      @reset="resetArea"
      @save="filterProducts">
    </product-filter>
    <back-to-top :show="showGoTopBtn" @click="goScroll(0)">
    </back-to-top>
  </section>
</template>

<script>
  import MallHeader from '../../components/header/MallHeader'
  import ProductGrid from '../../components/product/ProductGrid'
  import MallGrid from '../../components/enterprise/MallGrid'
  import MallOrder from '../../components/product/MallOrder'
  import BackToTop from '../../components/common/BackToTop'
  import ProductFilter from '../../components/product/ProductFilter'
  import { showBack, getStore, removeStore, setScrollTop } from '../../config/mUtils'
  import { requestFn } from '../../config/request'
  import { Toast } from 'mint-ui'
  import MugenScroll from 'vue-mugen-scroll'
  export default {
    props: ['id'],
    name: 'Mall',
    data () {
      return {
        activeIndex: 0,
        height: 65,
        scrollActive: false,
        hideIcon: false,
        scrollHeight: '15rem',
        showGoTopBtn: false,
        queryParams: '',
        placeholder: '请输入关键字',
        token: getStore('user') ? getStore('user').authentication_token : '',
        hasLogin: !!getStore('user'),
        favoratesText: '收藏',
        hasAddFavorites: false,
        teams: null,
        homeLoading: true,
        productLoading: true,
        enterpriseLoading: true,
        personLoading: true,
        productPageIndex: 1,
        productPageSize: 10,
        enterprisePageIndex: 1,
        enterprisePageSize: 10,
        personPageIndex: 1,
        personPageSize: 20,
        sortType: 0, // 0:综合 1:销量 2:价格
        orderUp: true,
        showList: false,
        useFilter: false, // 使用价格区间或者城市过滤
        areas: [],
        selectedArea: '',
        preLoadCategoriesLength: 8,
        preLoadMallsLength: 6,
        categories: [],
        malls: [],
        products: [],
        allProducts: [],
        allProductsLength: 0,
        enterprises: [],
        enterprisesLength: 0,
        person: [],
        personLength: 0,
        noMoreProducts: false,
        productLoadingText: '加载中...'
      }
    },
    components: {
      MallHeader,
      BackToTop,
      ProductGrid,
      MallGrid,
      MallOrder,
      ProductFilter,
      MugenScroll
    },
    methods: {
      selectTab (index) {
        this.activeIndex = index
      },
      handleNavBar () {
        if (!this.scrollActive) {
          showBack((status) => {
            this.hideIcon = status
            this.showGoTopBtn = status
            this.scrollActive = true // 滚动监听被激活，不需要再次监听
          }, this.height, this.$refs.newMallContainer, 0, 0)
        }
      },
      handleScrollHeight () {
        let appHeight = document.getElementById('app').offsetHeight
        let rootFontSize = document.documentElement.style.fontSize.split('p')[0]
        let divHeight = (appHeight / parseFloat(rootFontSize + '')).toFixed(2)
        this.scrollHeight = `${Math.round(divHeight * 100) / 100}rem`
        this.height = rootFontSize * 130 / 75
      },
      goScroll (scroll) {
        setScrollTop(scroll, this.$refs.newMallContainer)
      },
      goBack () {
        if (getStore('Mall_goHome')) {
          removeStore('Mall_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      handleSearchBtn (queryParams) {
        this.productPageIndex = 1
        this.getProducts(queryParams, this.selectedArea)
        document.activeElement.blur()
      },
      goCategories () {
        this.$router.push({name: 'Categories'})
      },
      goReport () {
        this.$router.push({name: 'Report', query: {resourceId: this.teams.enterprise_id, resourceClass: 'product'}})
      },
      goMall (item) {
        this.$router.push({path: `/malls/${item.id}`})
      },
      getMall () {
        this.$store.dispatch('commonAction', {
          url: `/mall/${this.id}`,
          method: 'get',
          params: {
            ...(this.token ? {token: this.token} : {})
          },
          target: this,
          resolve: (state, res) => {
            this.categories = res.data.categories
            this.malls = res.data.malls
            this.products = res.data.products
            this.homeLoading = false
            this.getProducts()
            this.shouldGetAreas()
            this.handleFavoriteStatus(res.data.teams[0].enterprise_id)
          },
          reject: () => {
          }
        })
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
            this.getMall()
            this.handleFavoriteStatus(res.data.teams[0].enterprise_id)
          },
          reject: () => {
          }
        })
      },
      goProductDetail (item) {
        this.$router.push({name: 'ProductDetail', params: {id: item.id}})
      },
      goLogin () {
        this.$store.dispatch('switchIntegralDialog', {status: true})
      },
      favoriteAction () {
        if (!this.hasLogin) {
          this.goLogin()
        } else if (!this.hasAddFavorites) {
          this.favoritesRequest(this.teams.id, {team_id: this.teams.id}, 'mall')
        } else {
          this.removeFavorites(this.teams.id, {type: 'Organization'}, 'mall')
        }
      },
      handleFavorite (item) {
        if (!this.hasLogin) {
          this.goLogin()
        } else if (!item.favorable) {
          this.favoritesRequest(item.id, {product_id: item.id}, 'product')
        } else {
          this.removeFavorites(item.id, {type: 'Product'}, 'product')
        }
      },
      handleRemoveFavorites (id, res, str) {
        if (str === 'product') {
          if (res.data.favorable_type && res.data.favorable_type === 'Product') {
            Toast({
              message: '你已成功取消收藏该产品',
              duration: 500
            })
            let index = this.handleIndex(this.products, id)
            this.products[index].favorable = !this.products[index].favorable
            this.$set(this.products, index, this.products[index])
          } else {
            Toast({
              message: '取消收藏该产品失败',
              duration: 1000
            })
          }
        } else {
          if (res.data.favorable_id + '' === id + '') {
            this.hasAddFavorites = false
            this.favoratesText = '收藏'
            Toast({
              message: '您已取消收藏该商城',
              duration: 500
            })
          }
        }
      },
      handleAddFavorites (id, res, str) {
        if (str === 'product') {
          if (res.data.favorites && res.data.favorites.id === parseInt(id)) {
            Toast({
              message: '你已成功收藏该产品',
              className: 'toast-content',
              iconClass: 'iconfont icon-caozuochenggong toast-icon-big',
              duration: 1000
            })
            let index = this.handleIndex(this.products, res.data.favorites.id)
            this.products[index].favorable = !this.products[index].favorable
            this.$set(this.products, index, this.products[index])
          } else {
            Toast({
              message: '收藏该产品失败',
              duration: 1000
            })
          }
        } else {
          if (res.data.favorites && res.data.favorites.id === parseInt(id)) {
            this.hasAddFavorites = true
            this.favoratesText = '已收藏'
            Toast({
              message: '你已成功收藏该商城',
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
        }
      },
      removeFavorites (id, obj, str) {
        this.$store.dispatch('commonAction', {
          url: `/favorites/${id}`,
          method: 'delete',
          params: {},
          data: {
            token: this.token,
            ...obj
          },
          target: this,
          resolve: (state, res) => {
            this.handleRemoveFavorites(id, res, str)
          },
          reject: () => {
          }
        })
      },
      favoritesRequest (id, obj, str) {
        this.$store.dispatch('commonAction', {
          url: '/favorites',
          method: 'post',
          params: {},
          data: {
            token: this.token,
            ...obj
          },
          target: this,
          resolve: (state, res) => {
            this.handleAddFavorites(id, res, str)
          },
          reject: () => {
          }
        })
      },
      handleIndex (arr, item) {
        let index = 0
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id === item) {
            index = i
            break
          }
        }
        return index
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
      },
      getProducts (q = this.queryParams, zoneCode = '') {
        this.queryParams = q
        this.productLoading = true
        this.$store.dispatch('commonAction', {
          url: '/products',
          method: 'get',
          params: {
            team_id: this.id,
            page: this.productPageIndex,
            per_page: this.productPageSize,
            ...(this.sortType === 2 ? {sort: this.orderUp ? 1 : -1} : {}),
            ...(q === '' ? {} : {q: q}),
            ...(zoneCode === '' ? {} : {zone_code: zoneCode})
          },
          target: this,
          resolve: (state, res) => {
            this.productLoading = false
            this.hasSearch = q !== ''
            if (res.data.products.length < this.productPageSize) {
              this.productLoadingText = '没有更多数据了...'
              this.noMoreProducts = true
            }
            this.allProducts = this.productPageIndex === 1 ? res.data.products : [...this.allProducts, ...res.data.products]
            this.allProductsLength = res.data.meta.total
          },
          reject: () => {
            this.productLoading = false
          }
        })
      },
      shouldGetAreas () {
        if (this.areas.length === 0) {
          this.getAreas()
        }
      },
      getAreas () {
        this.$store.dispatch('commonAction', {
          url: '/easy_zone',
          method: 'get',
          params: {},
          target: this,
          resolve: (state, res) => {
            this.areas = res.data
          },
          reject: () => {
            this.productLoading = false
          }
        })
      },
      orderChange (val) {
        this.orderUp = val
        this.sortType = 2
        this.productPageIndex = 1 // 调整价格排序后，需要从第一页重新开始获取产品数据
        this.getProducts(this.queryParams, this.selectedArea)
      },
      showListChange (val) {
        this.showList = val
      },
      changeSortType (num) {
        this.sortType = num
      },
      switchFilter (val) {
        this.useFilter = val
      },
      closeFilter () {
        this.useFilter = false
      },
      choooseArea (code) {
        this.selectedArea = code
      },
      resetArea () {
        this.selectedArea = ''
        this.getProducts(this.queryParams, this.selectedArea)
        this.closeFilter()
      },
      filterProducts () {
        this.getProducts(this.queryParams, this.selectedArea)
        this.closeFilter()
      },
      loadProductBottom () {
        if (!this.noMoreProducts) {
          this.productPageIndex += 1
          this.getProducts(this.queryParams, this.selectedArea)
        }
      }
    },
    mounted () {
      this.handleScrollHeight()
      this.handleNavBar()
    },
    filters: {
      lengthFilter (num) {
        if (num > 999) {
          return '999+'
        }
        return num
      }
    },
    activated () {
      this.hideIcon = false
      this.showGoTopBtn = false
      if (!this.$store.state.popState || this.$store.state.fromLogin) {
        setScrollTop(0, this.$refs.newMallContainer)
        this.hasLogin = !!getStore('user')
        this.token = getStore('user') ? getStore('user').authentication_token : null
        this.getEnterpriseDetail()
        if (getStore('shareIntegral')) {
          this.$store.dispatch('switchRegistDialog', {status: getStore('shareIntegral')})
          removeStore('shareIntegral')
          removeStore('shareRegist')
        }
      } else {
        setScrollTop(this.$store.state.scrollMap.Mall || 0, this.$refs.newMallContainer)
      }
    },
    beforeRouteLeave (to, from, next) {
      this.$store.dispatch('saveScroll', {name: 'Mall', value: this.$refs.newMallContainer.scrollTop})
      if (to.name !== 'ProductDetail' && to.name !== 'InformationFolders' && to.name !== 'Chat' && to.name !== 'PersonCarte' && to.name !== 'EnterpriseCarte' && to.name !== 'Login' && to.name !== 'BeforeRegister' && to.name !== 'Help' && to.name !== 'Maps' && to.name !== 'ShoppingCart' && to.name !== 'EnterpriseDetail' && to.name !== 'Report') {
        this.showGoTopBtn = false
        this.hideIcon = false
        this.scrollActive = false
        this.queryParams = ''
        this.hasAddFavorites = false
        this.favoratesText = '收藏'
        this.homeLoading = true
        this.teams = null
        this.productPageIndex = 1
        this.categories = []
        this.malls = []
        this.products = []
      }
      next()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .container {
    overflow-y: scroll;
    padding-bottom: 1px; // 避免安卓手机QQ浏览器，滑动到底部后第一次不能直接上滑的bug
    -webkit-overflow-scrolling: touch;
    z-index: 2;
  }
  .top-bg {
    @include px2rem(height, 210px);
    width: 100%;
    max-width: 540px;
    z-index: 2;
  }
  .mall-header {
    z-index: 3;
  }
  .fixed-nav-bar {
    position: fixed;
    @include px2rem(top, 70px);
    @include px2rem(height, 110px);
    overflow: hidden;
    z-index: 2;
    display: none;
  }
  .card {
    @include px2rem(padding-top, 100px);
    background-color: transparent;
    position: relative;
    background: url("../../assets/mallBg.png") no-repeat;
    background-size: cover;
    z-index: 2;
    .content {
      flex: 1;
      @include px2rem(height, 110px);
      img {
        @include px2rem(width, 80px);
        @include px2rem(height, 80px);
        @include px2rem(border-radius, 20px);
        @include pm2rem(margin, 0px, 20px, 0px, 30px);
      }
      .empty-img {
        @include px2rem(width, 80px);
        @include px2rem(height, 80px);
        @include px2rem(border-radius, 20px);
        @include pm2rem(margin, 0px, 20px, 0px, 30px);
        background-color: $ninth-grey;
      }
      .name {
        flex: 1;
        flex-direction: column;
        color: $white;
        .favorite {
          justify-content: flex-start;
          line-height: normal;
          @include px2rem(max-width, 140px);
          i {
            @include font-dpr(16px);
          }
          span {
            @include px2rem(margin-left, 20px);
          }
          .active {
            color: $second-red;
          }
        }
      }
    }
    .btn {
      @include px2rem(width, 160px);
      @include px2rem(height, 60px);
      @include pm2rem(margin, 0px, 40px, 0px, 30px);
      @include px2rem(border-radius, 40px);
      color: #F75541;
      line-height: normal;
      background-color: $white;
    }
  }
  .nav-container {
    overflow: hidden;
    @include px2rem(height, 110px);
    position: relative;
    z-index: 2;
    box-shadow: 0px 4px 4px -2px rgba(199, 194, 194, .4);
  }
  .noshadow {
    box-shadow: none;
  }
  .nav-hide {
    position: fixed;
    @include px2rem(top, 70px);
    z-index: 1;
    .nav-bars {
      transform: translateY(-100%);
    }
    .nav-icon {
      transform: translateY(-100%);
    }
    .nav-text {
      transform: translateY(-100%);
    }
  }
  .nav-show {
    display: block;
    .nav-icon {
      transform: translateY(-100%);
    }
    .nav-text {
      transform: translateY(-100%);
    }
  }
  .nav-bars {
    background-color: $white;
    @include px2rem(height, 110px);
    .bar {
      flex: 1;
      position: relative;
      height: inherit;
      .icon-box {
        flex: 1;
        height: inherit;
        transition: transform .3s;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        p {
          @include font-dpr(16px);
          @include line-height(27px);
        }
        i {
          @include font-dpr(18px);
        }
        span {
          @include font-dpr(12px);
        }
      }
      .nav-text {
        height: inherit;
        span {
          display: block;
          height: inherit;
          @include px2rem(padding-top, 30px);
          @include px2rem(line-height, 80px);
          @include font-dpr(12px);
          box-sizing: border-box;
        }
      }
      .border {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 0;
        background-color: #F96B09;
      }
    }
    .selected {
      .icon-box {
        color: #F96B09;
      }
      .border {
        @include px2rem(height, 4px);
      }
    }
  }
  .section-wrapper {
    @include px2rem(margin-top, 20px);
    background-color: $white;
    .section-title {
      line-height: normal;
      @include px2rem(height, 60px);
      hr {
        @include px2rem(width, 60px);
        color: $third-dark;
        border-top: 1px solid $third-dark;
        border-bottom: none;
      }
      span {
        @include pm2rem(margin, 0px, 30px, 0px, 30px);
      }
    }
    .section-content {
      @include pm2rem(padding, 20px, 0px, 0px, 18px);
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .item {
        @include pm2rem(margin, 0px, 18px, 20px, 0px);
        flex-direction: column;
        img {
          @include px2rem(width, 165px);
          @include px2rem(height, 165px);
          @include px2rem(border-radius, 10px);
        }
        .empty-img {
          @include px2rem(width, 165px);
          @include px2rem(height, 165px);
          @include px2rem(border-radius, 10px);
          background-color: $ninth-grey;
        }
        p {
          @include px2rem(width, 165px);
          @include px2rem(height, 60px);
        }
      }
    }
  }
  .empty-wrapper {
    .section-content {
      .item {
        p {
          @include px2rem(width, 125px);
          @include px2rem(height, 40px);
          @include pm2rem(margin, 10px, 0px, 10px, 0px);
          background-color: $ninth-grey;
        }
      }
    }
  }
  .icon-hide {
    @include px2rem(padding-top, 110px);
  }
  .order {
    @include px2rem(top, 320px);
  }
  .order-hide {
    position: fixed;
    @include px2rem(top, 180px);
  }
  .product-icon-hide {
    @include px2rem(padding-top, 180px);
  }
  .mall-order {
    z-index: 2;
  }
  .loading {
    @include px2rem(height, 120px);
    @include font-dpr(15px);
    color: $second-dark;
    line-height: normal;
    display: flex;
    align-items: center;
    justify-content: center;
    p {
      @include px2rem(margin-left, 20px);
    }
  }
</style>
