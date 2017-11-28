<template>
  <section class="full-width">
    <mall-header
      class="mall-header"
      :show-clear="hasSearch"
      @back="goBack()"
      @search="handleSearchBtn(queryParams)"
      @click-categories="goCategories()"
      @clear="clearSearch()"
      @report="goReport()">
      <input
        slot="input"
        type="search"
        @input="handleInput"
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
            <span v-if="teams && teams.name" class="font-16 team-name">{{teams.name}}</span>
            <span v-else class="font-16">&nbsp;</span>
            <div class="flex favorite" @click="favoriteAction()">
              <i v-if="hasAddFavorites" class="iconfont icon-xuanzhong1 active"></i>
              <i v-else class="iconfont icon-shoucang2"></i>
              <span class="font-12">{{favoratesText}}</span>
            </div>
          </div>
        </div>
        <a class="flex btn" @click="goMallDetail()">
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
          :hasFilter="selectedArea || priceRange"
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
                class="flex item"
                @click="goSingleCategory(item.id)">
                <img :src="item.thumb">
                <p class="flex ellipsis font-12">{{item.name}}</p>
              </a>
            </div>
          </div>
          <div  v-if="homeLoading || products.length > 0" class="section-wrapper">
            <div class="flex section-title">
              <hr>
              <p>
                <i class="iconfont icon-huo"></i>
                <span class="font-14 third-text">热卖爆款</span>
              </p>
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
              <p>
                <i class="iconfont icon-tuijian"></i>
                <span class="font-14 third-text">商城推荐</span>
              </p>
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
          <transition name="fade" mode="out-in">
            <div v-if="productLoading || allProducts && allProducts.length > 0">
              <transition
                name="fade"
                :appear="false"
                mode="out-in">
                <product-grid
                  key="productGrid"
                  v-if="!showList"
                  :store="allProducts"
                  :loading="productLoading"
                  :num="productPageSize"
                  @click="goProductDetail"
                  @favorite="handleFavorite">
                </product-grid>
                <product-list
                  key="productList"
                  v-if="showList"
                  :store="allProducts"
                  @click="goProductDetail"
                  @favorite="handleFavorite">
                </product-list>
              </transition>
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
            <div
              v-else
              key="noProduct"
              class="no-data">
              <img src="../../assets/noProduct.png">
            </div>
          </transition>
        </section>
        <section v-if="activeIndex === 2" key="three" :class="{'list-icon-hide': hideIcon}">
          <transition name="fade" mode="out-in">
            <div v-if="enterprises.length > 0">
              <enterprise-list
                :store="enterprises"
                :loading="false"
                :num="10"
                @click="goEnterprise">
              </enterprise-list>
              <mugen-scroll
                key="enterprise"
                :handler="loadEnterpriseBottom"
                :handle-on-mount="false"
                :should-handle="!enterpriseLoading"
                :threshold="0.1"
                scroll-container="newMallContainer">
                <div class="loading">
                  <mt-spinner
                    v-show="!noMoreEnterprises"
                    type="snake"
                    :size="18">
                  </mt-spinner>
                  <p>{{enterpriseLoadingText}}</p>
                </div>
              </mugen-scroll>
            </div>
            <div
              v-else
              key="noEnterprise"
              class="no-data">
              <img src="../../assets/noEnterprise.png">
            </div>
          </transition>
        </section>
        <section v-if="activeIndex === 3" key="four" :class="{'list-icon-hide': hideIcon}">
          <template v-if="hasLogin">
            <div v-if="person.length > 0">
              <person-members
                :store="person"
                :loading="false"
                :num="10"
                @click="goPersonCarte">
              </person-members>
              <mugen-scroll
                key="person"
                :handler="loadPersonBottom"
                :handle-on-mount="false"
                :should-handle="!personLoading"
                :threshold="0.1"
                scroll-container="newMallContainer">
                <div class="loading">
                  <mt-spinner
                    v-show="!noMorePerson"
                    type="snake"
                    :size="18">
                  </mt-spinner>
                  <p>{{personLoadingText}}</p>
                </div>
              </mugen-scroll>
            </div>
            <div
              v-else
              key="noPerson"
              class="no-data">
              <img src="../../assets/noPerson.png">
            </div>
          </template>
          <template v-else>
            <div key="noLogin" class="tab-tips-container">
              <p class="second-text">登录后才能查看</p>
              <div class="login-btn">
                <a @click="goLogin()" class="primary-bg white font-13">登录</a>
              </div>
            </div>
          </template>
        </section>
      </transition>
    </div>
    <mall-order
      v-show="activeIndex === 1 && hideIcon"
      class="full-width order"
      :class="{'order-hide': hideIcon}"
      :sort-type="sortType"
      :order-up="orderUp"
      :show-list="showList"
      :hasFilter="selectedArea || priceRange"
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
      <input
        class="flex input-filter"
        placeholder="最低价"
        slot="input-left"
        v-model.number="minPrice"
        type="number">
      <input
        class="flex input-filter"
        placeholder="最高价"
        slot="input-right"
        v-model.number="maxPrice"
        type="number">
    </product-filter>
    <add-btn
      v-show="activeIndex === 3 && canJoin"
      :single="!showGoTopBtn"
      @click="joinMember">
    </add-btn>
    <back-to-top :show="showGoTopBtn" @click="goScroll(0)">
    </back-to-top>
  </section>
</template>

<script>
  import MallHeader from '../../components/header/MallHeader'
  import ProductGrid from '../../components/product/ProductGrid'
  import ProductList from '../../components/product/ProductList'
  import MallGrid from '../../components/enterprise/MallGrid'
  import MallOrder from '../../components/product/MallOrder'
  import BackToTop from '../../components/common/BackToTop'
  import AddBtn from '../../components/common/AddBtn'
  import PersonMembers from '../../components/common/PersonMembers'
  import EnterpriseList from '../../components/enterprise/EnterpriseList'
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
        hasSearch: false,
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
        minPrice: '',
        maxPrice: '',
        priceRange: '',
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
        productLoadingText: '加载中...',
        noMoreEnterprises: false,
        enterpriseLoadingText: '加载中...',
        personLoadingText: '加载中...',
        noMorePerson: false,
        canJoin: false
      }
    },
    components: {
      MallHeader,
      BackToTop,
      ProductGrid,
      MallGrid,
      MallOrder,
      ProductFilter,
      MugenScroll,
      ProductList,
      EnterpriseList,
      AddBtn,
      PersonMembers
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
        document.activeElement.blur()
        switch (this.activeIndex) {
          case 0:
            break
          case 1:
            this.productPageIndex = 1
            this.getProducts(queryParams, this.selectedArea)
            break
          case 2:
            this.enterprisePageIndex = 1
            this.getEnterprises(queryParams)
            break
          case 3:
            if (getStore('user')) {
              this.personPageIndex = 1
              this.getPersonMembers(queryParams)
            }
            break
          default:
            this.productPageIndex = 1
            this.getProducts(queryParams)
        }
      },
      goSingleCategory (id) {
        this.$router.push({name: 'CategoryProducts', params: {id: id}})
      },
      goCategories () {
        this.$router.push({name: 'Categories', params: {id: this.id}})
      },
      goReport () {
        this.$router.push({name: 'Report', query: {resourceId: this.teams.enterprise_id, resourceClass: 'product'}})
      },
      goMall (item) {
        this.$router.push({path: `/malls/${item.id}`})
      },
      goEnterprise (item) {
        if (!item.service_name) {
          this.$router.push({name: 'EmptyEnterpriseCarte', query: {name: item.name}})
        } else if (item.service_name.aliaz === 'association') {
          this.$router.push({name: 'ComityCarte', params: {id: item.id}})
        } else if (item.service_name.aliaz === 'school') {
          this.$router.push({name: 'Alumni', params: {id: item.id}})
        } else if (item.service_name.aliaz === 'class') {
          this.$router.push({name: 'Class', params: {id: item.id}})
        } else if (item.service_name.aliaz === 'mall') {
          this.$router.push({name: 'Mall', params: {id: item.id}})
        } else {
          this.$router.push({name: 'EnterpriseCarte', params: {id: item.id}})
        }
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
            this.allProductsLength = res.data.count.product_count
            this.enterprisesLength = res.data.count.organization_members_count
            this.personLength = res.data.count.person_members_count
            this.homeLoading = false
            this.getProducts()
            this.shouldGetAreas()
          },
          reject: () => {
          }
        })
      },
      getTeams () {
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
            if (this.activeIndex === 0) {
              let index = this.handleIndex(this.products, id)
              this.products[index].favorable = !this.products[index].favorable
              this.$set(this.products, index, this.products[index])
            } else if (this.activeIndex === 1) {
              let index = this.handleIndex(this.allProducts, id)
              this.allProducts[index].favorable = !this.allProducts[index].favorable
              this.$set(this.allProducts, index, this.allProducts[index])
            }
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
            if (this.activeIndex === 0) {
              let index = this.handleIndex(this.products, res.data.favorites.id)
              this.products[index].favorable = !this.products[index].favorable
              this.$set(this.products, index, this.products[index])
            } else if (this.activeIndex === 1) {
              let index = this.handleIndex(this.allProducts, res.data.favorites.id)
              this.allProducts[index].favorable = !this.allProducts[index].favorable
              this.$set(this.allProducts, index, this.allProducts[index])
            }
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
          this.canJoin = res.data.enterprises.organization.can_join_to_team
          this.hasAddFavorites = res.data.enterprises.organization.favorable
          this.favoratesText = res.data.enterprises.organization.favorable ? '已收藏' : '收藏'
        }
      },
      arrayFindItem (arr, key) {
        let tmpObj = null
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].group_type === key) {
            tmpObj = arr[i]
            break
          }
        }
        return tmpObj
      },
      getProducts (q = this.queryParams, zoneCode = '') {
        this.queryParams = q
        this.hasSearch = q !== ''
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
            ...(zoneCode === '' ? {} : {zone_code: zoneCode}),
            ...(this.priceRange === '' ? {} : {price_range: this.priceRange}),
            ...(this.token ? {token: this.token} : {})
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
            this.getEnterprises()
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
        this.resetPageIndex() // 调整价格排序后，需要从第一页重新开始获取产品数据
        this.getProducts(this.queryParams, this.selectedArea)
      },
      showListChange (val) {
        this.showList = val
      },
      changeSortType (num) {
        this.sortType = num
        this.resetPageIndex()
        this.getProducts(this.queryParams, this.selectedArea)
      },
      // 每次切换排序方式，都要把分页索引重置
      resetPageIndex () {
        this.productLoading = true
        this.productPageIndex = 1
        this.enterprisePageIndex = 1
        this.personPageIndex = 1
        this.noMoreProducts = false
        this.noMoreEnterprises = false
        this.noMorePerson = false
        this.productLoadingText = '加载中...'
        this.enterpriseLoadingText = '加载中...'
        this.personLoadingText = '加载中...'
        setScrollTop(0, this.$refs.newMallContainer)
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
        this.minPrice = ''
        this.maxPrice = ''
        this.priceRange = ''
        this.resetPageIndex()
        this.getProducts(this.queryParams, this.selectedArea)
        this.closeFilter()
      },
      filterProducts () {
        this.minPrice = Math.abs(parseInt(this.minPrice)) > Math.abs(parseInt(this.maxPrice)) ? Math.abs(parseInt(this.maxPrice)) : Math.abs(parseInt(this.minPrice))
        this.maxPrice = Math.abs(parseInt(this.minPrice)) > Math.abs(parseInt(this.maxPrice)) ? Math.abs(parseInt(this.minPrice)) : Math.abs(parseInt(this.maxPrice))
        if (this.maxPrice && this.minPrice) {
          this.priceRange = `${this.minPrice},${this.maxPrice}`
        } else if (this.maxPrice && !this.minPrice) {
          this.priceRange = `0,${this.maxPrice}`
        } else if (!this.maxPrice && this.minPrice) {
          this.priceRange = `${this.minPrice}`
        }
        this.resetPageIndex()
        this.getProducts(this.queryParams, this.selectedArea)
        this.closeFilter()
      },
      loadProductBottom () {
        if (!this.noMoreProducts) {
          this.productPageIndex += 1
          this.getProducts(this.queryParams, this.selectedArea)
        }
      },
      loadEnterpriseBottom () {
        if (!this.noMoreEnterprises) {
          this.enterprisePageIndex += 1
          this.getEnterprises(this.queryParams)
        }
      },
      loadPersonBottom () {
        if (!this.noMorePerson) {
          this.personPageIndex += 1
          this.getPersonMembers(this.queryParams)
        }
      },
      handleInput (e) {
        if (e.target.value === '') {
          this.clearSearch()
        } else {
          this.hasSearch = true
        }
        this.productPageIndex = 1
      },
      clearSearch () {
        this.queryParams = ''
        this.hasSearch = false
        this.resetPageIndex()
        this.handleSearchBtn()
      },
      getEnterprises (queryParams = '') {
        this.enterpriseLoading = true
        this.$store.dispatch('commonAction', {
          url: `/mall/${this.id}/org_members`,
          method: 'get',
          params: {
            ...(queryParams ? {q: queryParams} : {}),
            page: this.enterprisePageIndex,
            per_page: this.enterprisePageSize
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.members.length < this.enterprisePageSize) {
              this.enterpriseLoadingText = '没有更多数据了...'
              this.noMoreEnterprises = true
            }
            this.enterprises = this.enterprisePageIndex === 1 ? res.data.members : [...this.enterprises, ...res.data.members]
            this.enterpriseLoading = false
            this.getPersonMembers()
          },
          reject: () => {
            this.productLoading = false
          }
        })
      },
      getPersonMembers (queryParams = '') {
        this.personLoading = true
        this.$store.dispatch('commonAction', {
          url: `/mall/${this.id}/person_members`,
          method: 'get',
          params: {
            ...(queryParams ? {q: queryParams} : {}),
            page: this.personPageIndex,
            per_page: this.personPageSize
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.members.length < this.personPageSize) {
              this.personLoadingText = '没有更多数据了...'
              this.noMorePerson = true
            }
            this.person = this.personPageIndex === 1 ? res.data.members : [...this.person, ...res.data.members]
            this.personLoading = false
          },
          reject: () => {
            this.personLoading = false
          }
        })
      },
      goPersonCarte (item) {
        this.$router.push({path: `/users/${item.uuid}`})
      },
      goMallDetail () {
        this.$router.push({path: `/malldetail/${this.id}`})
      },
      joinMember () {
        if (!this.hasLogin) {
          this.goLogin()
        } else {
          this.$router.push({name: 'JoinIn', params: {id: this.id}, query: {name: this.teams.name}})
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
        this.getTeams()
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
      if (to.name !== 'ProductDetail' && to.name !== 'InformationFolders' && to.name !== 'Chat' && to.name !== 'PersonCarte' && to.name !== 'EnterpriseCarte' && to.name !== 'Login' && to.name !== 'BeforeRegister' && to.name !== 'Help' && to.name !== 'Maps' && to.name !== 'ShoppingCart' && to.name !== 'EnterpriseDetail' && to.name !== 'Report' && to.name !== 'Categories' && to.name !== 'MallDetail' && to.name !== 'JoinIn' && to.name !== 'CategoryProducts') {
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
    z-index: 3;
  }
  .input-filter {
    @include px2rem(width, 200px);
    @include px2rem(height, 60px);
    line-height: normal;
    border: none;
    @include pm2rem(padding, 0px, 20px, 0px, 20px);
    box-sizing: border-box;
    text-align: center;
    @include font-dpr(14px);
    color: $second-dark;
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
    box-sizing: border-box;
  }
  .card {
    @include px2rem(padding-top, 100px);
    background-color: transparent;
    position: relative;
    background: url("../../assets/mallBg.png") no-repeat;
    background-size: cover;
    z-index: 3;
    .content {
      flex: 1;
      @include px2rem(height, 110px);
      img {
        @include px2rem(width, 80px);
        @include px2rem(height, 80px);
        @include px2rem(border-radius, 10px);
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
        .team-name {
          font-weight: bold;
        }
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
      z-index: 3;
      cursor: pointer;
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
    border-bottom: none;
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
      p {
        @include pm2rem(margin, 0px, 30px, 0px, 30px);
        i {
          @include font-dpr(16px);
          color: $third-dark;
          @include px2rem(margin-right, 10px);
        }
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
    @include px2rem(margin-top, 130px);
  }
  .order {
    @include px2rem(top, 320px);
  }
  .order-hide {
    position: fixed;
    @include px2rem(top, 180px);
  }
  .product-icon-hide {
    @include px2rem(margin-top, 190px);
  }
  .list-icon-hide {
    @include px2rem(margin-top, 110px);
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
  .no-data {
    @include pm2rem(padding, 100px, 20px, 100px, 0px);
    @include pm2rem(margin, 20px, 22px, 0px, 22px);
    background-color: $white;
    text-align: center;
    border: 1px solid #E7E7E7;
    img {
      @include px2rem(width, 260px);
      height: auto;
    }
  }
</style>
