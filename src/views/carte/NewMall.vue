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
    <div class="full-width fixed-nav-bar" :class="{'nav-show': hideIcon}">
      <div class="flex nav-bars">
        <a class="bar" :class="{'selected': activeIndex === 0}" @click="selectTab(0)">
          <div class="icon-box nav-icon">
            <i class="iconfont icon-shangjia"></i>
            <span>全部产品</span>
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
          <img src="../../assets/blank.jpg">
          <div class="name">
            <span v-if="teams && teams.name" class="font-16">{{teams.name}}</span>
            <div class="flex favorite">
              <i class="iconfont icon-shoucang1"></i>
              <span class="font-12">{{favoratesText}}</span>
            </div>
          </div>
        </div>
        <a class="flex btn">
          商城详情
        </a>
      </div>
      <div class="nav-container" :class="{'full-width nav-hide': hideIcon}">
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
              <p>999+</p>
              <span>全部产品</span>
            </div>
            <div class="icon-box nav-text">
              <span>全部产品</span>
            </div>
            <div class="border"></div>
          </a>
          <a class="bar" :class="{'selected': activeIndex === 2}" @click="selectTab(2)">
            <div class="icon-box nav-icon">
              <p>598</p>
              <span>企业会员</span>
            </div>
            <div class="icon-box nav-text">
              <span>企业会员</span>
            </div>
            <div class="border"></div>
          </a>
          <a class="bar" :class="{'selected': activeIndex === 3}" @click="selectTab(3)">
            <div class="icon-box nav-icon">
              <p>648</p>
              <span>个人会员</span>
            </div>
            <div class="icon-box nav-text">
              <span>个人会员</span>
            </div>
            <div class="border"></div>
          </a>
        </div>
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
          <div v-else class="section-wrapper" :class="{'icon-hide': hideIcon}">
            <div class="flex section-title">
              <hr>
              <span class="font-14 third-text">推荐类别</span>
              <hr>
            </div>
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
          <div class="section-wrapper">
            <div class="flex section-title">
              <hr>
              <span class="font-14 third-text">热卖爆款</span>
              <hr>
            </div>
            <product-grid
              :store="products"
              :loading="homeLoading"
              :num="productPageSize"
              @click="goProductDetail">
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
              @click="goProductDetail">
            </mall-grid>
          </div>
        </section>
        <section v-if="activeIndex === 1" key="two"></section>
        <section v-if="activeIndex === 2" key="three"></section>
        <section v-if="activeIndex === 3" key="four"></section>
      </transition>
    </div>
    <back-to-top :show="showGoTopBtn" @click="goScroll(0)">
    </back-to-top>
  </section>
</template>

<script>
  import MallHeader from '../../components/header/MallHeader'
  import ProductGrid from '../../components/product/ProductGrid'
  import MallGrid from '../../components/enterprise/MallGrid'
  import BackToTop from '../../components/common/BackToTop'
  import { showBack, getStore, removeStore, setScrollTop } from '../../config/mUtils'
  import { requestFn } from '../../config/request'
  export default {
    props: ['id'],
    name: 'NewMall',
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
        productOrder: 1,
        teams: null,
        homeLoading: true,
        productPageIndex: 1,
        productPageSize: 10,
        preLoadCategoriesLength: 8,
        preLoadMallsLength: 6,
        categories: [],
        malls: [],
        products: []
      }
    },
    components: {
      MallHeader,
      BackToTop,
      ProductGrid,
      MallGrid
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
        if (getStore('NewMall_goHome')) {
          removeStore('NewMall_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      handleSearchBtn (queryParams) {
        this.productPageIndex = 1
        this.getProducts(queryParams, this.productOrder)
        document.activeElement.blur()
      },
      goCategories () {
        this.$router.push({name: 'Categories'})
      },
      goReport () {
        this.$router.push({name: 'Report', query: {resourceId: this.teams.enterprise_id, resourceClass: 'product'}})
      },
      getMall () {
        this.$store.dispatch('commonAction', {
          url: `/mall/${this.id}`,
          method: 'get',
          params: {},
          target: this,
          resolve: (state, res) => {
            this.categories = res.data.categories
            this.malls = res.data.malls
            this.homeLoading = false
            let tmppArr = this.handleProductThumbnails(res.data.product)
            this.getFilesPublisheds(tmppArr, res.data.product)
            this.getProducts()
            this.handleFavoriteStatus(res.data.teams[0].enterprise_id)
          },
          reject: () => {
          }
        })
      },
      async getFilesPublisheds (ids, arr) {
        let {res} = await requestFn({
          url: '/links/files/publisheds',
          params: {
            type: 'product',
            team_id: this.id,
            thumbs: ['general'],
            ids: ids
          }
        })
        if (res.data) {
          this.products = this.handleProducts(arr, res.data.files)
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
      getProducts (q = this.queryParams) {
        this.queryParams = q
        this.productLoading = true
        this.$store.dispatch('commonAction', {
          url: '/products',
          method: 'get',
          params: {
            team_id: this.id,
            page: this.productPageIndex,
            per_page: this.productPageSize,
            sort: '',
            q: q || ''
          },
          target: this,
          resolve: (state, res) => {
            this.hasSearch = q !== ''
          },
          reject: () => {
            this.productLoading = false
          }
        })
      }
    },
    mounted () {
      this.handleScrollHeight()
      this.handleNavBar()
    },
    activated () {
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
        setScrollTop(this.$store.state.scrollMap.NewMall || 0, this.$refs.newMallContainer)
      }
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

</style>
