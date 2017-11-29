<template>
  <section class="full-width">
    <search-header
      @back="goBack()"
      @search="handleSearchBtn(queryParams)"
      :show-cancel="hasSearch"
      @cancel="cancelSearch()">
      <input
        slot="input"
        type="search"
        v-model="queryParams"
        @keyup.enter.prevent="handleSearchBtn(queryParams)"
        :placeholder="placeholder">
    </search-header>
    <section class="full-width absolute-horizontal menu-container">
      <section class="menu-left" id="wrapper-menu" ref="wrapperMenu">
        <ul v-if="loading && menuList.length === 0">
          <li
            v-for="(item, index) in preLoadLength"
            :key="index"
            class="flex menu-left-li"
            :class="{'menu-active': index === menuIndex}"
            @click="chooseMenu(index)">
            <span class="blank-menu-item">&nbsp;</span>
            <div v-show="index === menuIndex" class="border"></div>
          </li>
        </ul>
        <ul v-else>
          <li
            v-for="(item, index) in menuList"
            :key="index"
            class="flex menu-left-li"
            :class="{'menu-active': index === menuIndex}"
            @click="chooseMenu(index)">
            <span class="ellipsis">{{item.name}}</span>
            <div v-show="index === menuIndex" class="border"></div>
          </li>
        </ul>
      </section>
      <section class="menu-right" :class="{'white-bg': loading || menuList.length > 0}" ref="productCategories">
        <ul v-if="loading && menuList.length === 0">
          <li
            v-for="(item, index) in preLoadLength"
            :key="index">
            <header class="flex flex-between menu-right-header empty-header">
              <div></div>
              <div></div>
            </header>
            <section class="categories-list">
              <a
                v-for="(product, indexI) in perLoadProductLength"
                :key="indexI"
                class="list-item empty-item">
                <div></div>
                <p class="second-text font-14"></p>
              </a>
            </section>
          </li>
        </ul>
        <ul v-else>
          <li
            v-for="(item, index) in menuList"
            :key="index">
            <header class="flex flex-between menu-right-header">
              <span class="primary-text font-16 ellipsis">{{item.name}}</span>
              <span class="second-text font-12">（{{item.children.length}}个二级分类）</span>
            </header>
            <section class="categories-list">
              <a
                v-for="(product, indexI) in item.children"
                :key="indexI"
                class="list-item"
                @click="goSingleCategory(product.id)">
                <img :src="product.thumb">
                <p class="second-text font-14 ellipsis">{{product.name}}</p>
              </a>
            </section>
          </li>
        </ul>
      </section>
    </section>
    <section  v-if="!loading && menuList.length === 0" class="empty-tips">
      <p class="font-20 third-text">该商城暂无产品分类</p>
      <p class="font-20 third-text">试试上方搜索产品</p>
    </section>
    <section
      v-show="hasSearch"
      class="full-width absolute-horizontal search-list">
      <ul v-show="searchResultType === 'category'">
        <li
          v-for="(item, index) in searchResults"
          :key="index">
          <a class="flex primary-text font-16" @click="goSingleCategory(item.id)">{{item.name}}</a>
        </li>
      </ul>
      <ul v-show="searchResultType === 'product'">
        <li
          v-for="(item, index) in searchProductResults"
          :key="index">
          <a class="flex primary-text font-16" @click="goProductDetail(item.id)">{{item.name}}</a>
        </li>
      </ul>
    </section>
  </section>
</template>

<script>
  import SearchHeader from '../../components/header/SearchHeader'
  import BScroll from 'better-scroll'
  import { getStore, removeStore } from '../../config/mUtils'
  export default {
    name: 'Categories',
    props: ['id'],
    data () {
      return {
        queryParams: '',
        placeholder: '搜索产品',
        menuIndex: 0,
        menuList: [],
        loading: true,
        preLoadLength: 20,
        perLoadProductLength: 9,
        productListTop: [], // 分类高度的集合
        menuIndexChange: false,
        menuScroll: null,
        searchResults: [],
        searchProductResults: [],
        hasSearch: false,
        searchResultType: 'category'
      }
    },
    components: {
      SearchHeader
    },
    methods: {
      handleSearchBtn (queryParams) {
        this.hasSearch = true
        this.searchCategories(queryParams)
      },
      goBack () {
        if (getStore('Categories_goHome')) {
          removeStore('Categories_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      goSingleCategory (id) {
        this.$router.push({name: 'CategoryProducts', params: {id: id}})
      },
      getCategories () {
        this.$store.dispatch('commonAction', {
          url: '/categories/navigation',
          method: 'get',
          params: {
            ...(this.id ? {organization_id: this.id} : {})
          },
          target: this,
          resolve: (state, res) => {
            this.menuList = res.data.categories
            this.loading = false
            this.$nextTick(() => {
              this.getProductListHeight()
            })
          },
          reject: () => {
          }
        })
      },
      goProductDetail (id) {
        this.$router.push({name: 'ProductDetail', params: {id: id}})
      },
      searchCategories (queryParams) {
        this.$store.dispatch('commonAction', {
          url: '/categories/search',
          method: 'get',
          params: {
            team_id: this.id,
            q: queryParams
          },
          target: this,
          resolve: (state, res) => {
            this.searchResultType = res.data.type
            if (res.data.type === 'product') {
              this.searchProductResults = res.data.data
            } else if (res.data.type === 'category') {
              this.searchResults = res.data.data
            } else {
              console.error('搜索出错！')
            }
          },
          reject: () => {
          }
        })
      },
      cancelSearch () {
        this.queryParams = ''
        this.hasSearch = false
      },
      getProductListHeight () {
        let listContainer = this.$refs.productCategories
        let listArr = Array.from(listContainer.children[0].children)
        listArr.forEach((item, index) => {
          this.productListTop[index] = item.offsetTop
        })
        this.listenScroll(listContainer)
        this.chooseMenu(0)
      },
      // 当滑动分类列表时，监听其scrollTop值来设置对应的菜单列表标题的样式
      listenScroll (element) {
        this.menuScroll = new BScroll(element, {
          probeType: 3,
          deceleration: 0.001,
          bounce: false,
          swipeTime: 2000,
          click: true
        })
        let wrapperMenu = new BScroll('#wrapper-menu', {
          click: true
        })
        let wrapMenuHeight = this.$refs.wrapperMenu.clientHeight
        this.menuScroll.on('scroll', (pos) => {
          if (!this.$refs.wrapperMenu) {
            return false
          }
          this.productListTop.forEach((item, index) => {
            if (this.menuIndexChange && Math.abs(Math.round(pos.y)) >= item - 44) {
              this.menuIndex = index
              let menuList = this.$refs.wrapperMenu.querySelectorAll('.menu-active')
              let el = menuList[0]
              wrapperMenu.scrollToElement(el, 800, 0, -(wrapMenuHeight / 2 - 50))
            }
          })
        })
      },
      // 点击左侧菜单列表标题，相应分类列表移动到最顶层
      chooseMenu (index) {
        this.menuIndex = index
        this.menuIndexChange = false
        // 顶部搜索栏占据44px
        this.menuScroll.scrollTo(0, -this.productListTop[index] + 44, 400)
        this.menuScroll.on('scrollEnd', () => {
          this.menuIndexChange = true
        })
      }
    },
    mounted () {
      this.getCategories()
    },
    activated () {
      if (!this.$store.state.popState) {
        this.getCategories()
      }
    },
    beforeRouteLeave (to, from, next) {
      if (to.name !== 'CategoryProducts' && to.name !== 'ProductDetail') {
        this.pageIndex = 1
        this.loading = true
        this.menuIndexChange = false
        this.searchResults = []
        this.searchProductResults = []
        this.searchResultType = 'category'
        this.hasSearch = false
        this.productListTop = []
        this.menuScroll = null
      }
      next()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .menu-container {
    @include px2rem(padding-top, 88px);
    overflow-y: hidden;
    box-sizing: border-box;
    display: flex;
    height: 100%;
    .menu-left {
      @include px2rem(width, 200px);
      flex: 1;
      .menu-left-li {
        @include px2rem(height, 96px);
        box-sizing: border-box;
        position: relative;
        border-bottom: 1px solid $third-grey;
        span {
          @include font-dpr(14px);
          @include pm2rem(padding, 0px, 10px, 0px, 18px);
        }
        .blank-menu-item {
          display: block;
          @include px2rem(width, 120px);
          background-color: $ninth-grey;
        }
        .border {
          position: absolute;
          left: 0;
          @include px2rem(width, 8px);
          height: inherit;
          background-color: $green;
        }
      }
      .menu-active {
        background-color: $white;
      }
    }
    .menu-right {
      @include px2rem(width, 550px);
      overflow-y: auto;
      .menu-right-header {
        @include px2rem(height, 80px);
        @include pm2rem(margin, 0px, 40px, 20px, 40px);
        border-top: 1px solid #EEE;
        border-bottom: 1px solid #EEE;
        box-sizing: border-box;
        line-height: normal;
        & span:first-child {
          @include px2rem(width, 240px);
        }
      }
      .empty-header {
        div {
          @include px2rem(height, 40px);
          @include px2rem(width, 160px);
          background-color: $ninth-grey;
        }
      }
      .categories-list {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        @include pm2rem(padding, 0px, 0px, 30px, 24px);
        .list-item {
          @include px2rem(margin-bottom, 20px);
          @include px2rem(margin-right, 24px);
          img {
            @include px2rem(width, 150px);
            @include px2rem(height, 150px);
            @include px2rem(border-radius, 20px);
            display: block;
          }
          p {
            text-align: center;
            @include px2rem(height, 60px);
            @include px2rem(line-height, 60px);
            @include px2rem(width, 150px);
          }
        }
        .empty-item {
          div {
            @include px2rem(width, 150px);
            @include px2rem(height, 150px);
            @include px2rem(border-radius, 20px);
            background-color: $ninth-grey;
          }
          p {
            @include px2rem(width, 100px);
            margin: 0 auto;
            @include px2rem(margin-top, 10px);
            @include px2rem(margin-bottom, 10px);
            @include px2rem(height, 40px);
            background-color: $ninth-grey;
          }
        }
      }
    }
  }
  .empty-tips {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    text-align: center;
  }
  .search-list {
    height: 100%;
    @include px2rem(padding-top, 88px);
    ul {
      background-color: $white;
      min-height: 100%;
    }
    a {
      justify-content: flex-start;
      border-bottom: 1px solid $second-grey;
      @include pm2rem(padding, 0px, 30px, 0px, 30px);
      box-sizing: border-box;
      line-height: normal;
      @include px2rem(height, 96px);
    }
    a:active {
      background-color: rgba(239, 234, 234, .5);
    }
  }
</style>
