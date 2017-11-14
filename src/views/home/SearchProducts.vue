<template>
  <section class="full-width">
    <product-search-bar
      :can-clear="searchParams"
      @clear="resetSearchBar()"
      @search="searchProducts(sort, searchParams)"
      @back="goBack()">
      <input
        slot="input"
        type="search"
        class="search-input full-width"
        v-model="searchParams"
        @input="handleInput"
        @keyup.enter.prevent="handleSearchBtn"
        placeholder="搜一搜"
        ref="searchInput">
    </product-search-bar>
    <search-products-order
      v-if="hasSearch"
      class="option-bar"
      :sort-type="sort"
      @sort="sortProducts">
    </search-products-order>
    <hot-tags
      v-if="!hasSearch"
      :tags="tags"
      class="tags-area"
      @click="goLink">
    </hot-tags>
    <div class="product-list-container container" ref="searchProducts" :style="{height: scrollHeight}">
      <template v-if="hasSearch && products && products.length > 0">
        <product-list-mode
          :store="products"
          @click="goProductDetail">
        </product-list-mode>
        <mugen-scroll
          :handler="loadProductBottom"
          :handle-on-mount="false"
          :should-handle="!loading"
          :threshold="0.1"
          scroll-container="searchProducts">
          <div class="loading">
            <mt-spinner
              v-show="!noMoreData"
              type="snake"
              :size="18">
            </mt-spinner>
            <p>{{loadingText}}</p>
          </div>
        </mugen-scroll>
      </template>
      <template v-if="hasSearch && products && products.length === 0">
        <div class="empty-products">
          <div class="img-container">
            <img src="../../assets/noSearchProducts.png">
          </div>
          <p>SORRY! 暂没有找到符合条件的信息</p>
        </div>
      </template>
    </div>
    <back-to-top
      :show="showGoTopBtn"
      @click="goScroll(0)">
    </back-to-top>
  </section>
</template>

<script>
  import ProductSearchBar from '../../components/product/Search'
  import HotTags from '../../components/product/HotTags'
  import ProductListMode from '../../components/product/List'
  import BackToTop from '../../components/common/BackToTop'
  import SearchProductsOrder from '../../components/product/Order'
  import { getStore, removeStore, showBack, setScrollTop } from '../../config/mUtils'
  import { Toast } from 'mint-ui'
  import { requestFn } from '../../config/request'
  import MugenScroll from 'vue-mugen-scroll'
  export default {
    name: 'SearchProducts',
    data () {
      return {
        searchParams: '',
        sort: '',
        hasSearch: false,
        pageIndex: 1,
        pageSize: 20,
        showGoTopBtn: false,
        height: 160, // 向上滚动到160px，就显示回到顶部按钮
        products: [],
        productsThumbnails: [],
        tags: [
          {
            name: '百石堂',
            url: 'http://www.360stones.com/'
          }, {
            name: '淘宝',
            url: 'https://m.taobao.com/'
          }, {
            name: '京东',
            url: 'https://m.jd.com/'
          }, {
            name: '天猫',
            url: 'https://m.tmall.com/'
          }, {
            name: '美团',
            url: 'https://i.meituan.com/'
          }, {
            name: '58同城',
            url: 'https://m.58.com/'
          }, {
            name: '携程',
            url: 'https://m.ctrip.com/'
          }
        ],
        loading: true,
        loadingText: '加载中...',
        noMoreData: false,
        scrollHeight: '14rem',
        scrollActive: false
      }
    },
    components: {
      ProductSearchBar,
      HotTags,
      ProductListMode,
      BackToTop,
      SearchProductsOrder,
      MugenScroll
    },
    methods: {
      resetSearchBar () {
        this.searchParams = ''
        this.sort = ''
        this.hasSearch = false
        this.products = []
        this.pageIndex = 1
        this.productsThumbnails = []
        this.loadingText = '加载中...'
        this.noMoreData = false
        setScrollTop(0, this.$refs.searchProducts)
      },
      handleInput (e) {
        if (e.target.value === '') {
          this.resetSearchBar()
        }
        this.pageIndex = 1
      },
      sortProducts (val) {
        // 每次切换排序方式，都需要从第一页开始，避免前面已加载的数据顺序异常
        this.pageIndex = 1
        this.getProducts(val, this.searchParams)
      },
      searchProducts (sort = this.sort, params = this.searchParams) {
        if (!params) {
          Toast({
            message: '搜索关键词不能为空',
            duration: 500
          })
        } else {
          this.getProducts(sort, params)
        }
      },
      async getProducts (sort = this.sort, q = this.searchParams) {
        this.sort = sort
        this.loading = true
        let {res} = await requestFn({
          url: '/products',
          params: {
            page: this.pageIndex,
            per_page: this.pageSize,
            sort: sort,
            q: q
          }
        })
        if (res.data) {
          if (res.data.products.length < this.pageSize) {
            this.noMoreData = true
            this.loadingText = '没有更多数据了...'
          }
          this.products = this.pageIndex === 1 ? res.data.products : [...res.data.products, ...this.products]
          this.loading = false
          this.hasSearch = true
          let tmpArr = this.handleProductThumbnails(res.data.products)
          this.getFilesPublisheds(tmpArr, res.data.products)
        } else {
          this.loading = false
        }
      },
      handleProductThumbnails (arr) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          tmpArr.push(arr[i].files[0].file_id)
        }
        return tmpArr
      },
      async getFilesPublisheds (ids, arr) {
        let {res} = await requestFn({
          url: '/links/files/publisheds',
          params: {
            type: 'product',
            thumbs: ['general'],
            ids: ids
          }
        })
        if (res.data) {
          this.hasSearch = true
          this.loading = false
          if (this.pageIndex === 1) {
            this.products = this.handleProducts(arr, res.data.files)
            this.productsThumbnails = res.data.files
          } else {
            this.products = [...this.products, ...this.handleProducts(arr, res.data.files)]
            this.productsThumbnails = [...this.productsThumbnails, ...res.data.files]
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
      goLink (item) {
        window.location.href = item.url
      },
      goProductDetail (item) {
        this.$router.push({name: 'ProductDetail', params: {id: item.id}})
      },
      goBack () {
        if (getStore('SearchProducts_goHome')) {
          removeStore('SearchProducts_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      goScroll (scroll) {
        setScrollTop(scroll, this.$refs.searchProducts)
      },
      handleSearchBtn () {
        // 每次搜索需重置分页索引,并重置产品列表
        this.pageIndex = 1
        this.products = []
        this.searchProducts(this.sort, this.searchParams)
        document.activeElement.blur()
      },
      handleGoTopBtn () {
        if (!this.scrollActive) {
          showBack((status) => {
            this.showGoTopBtn = status
            this.scrollActive = true
          }, this.height, this.$refs.searchProducts)
        }
      },
      loadProductBottom () {
        if (!this.noMoreData) {
          this.pageIndex += 1
          this.getProducts(this.sort, this.searchParams)
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
      if (!this.$store.state.popState) {
        setScrollTop(0, this.$refs.searchProducts)
        this.handleGoTopBtn()
      } else {
        setScrollTop(this.$store.state.scrollMap.SearchProducts || 0, this.$refs.searchProducts)
      }
    },
    beforeRouteLeave (to, from, next) {
      this.$store.dispatch('saveScroll', {name: 'SearchProducts', value: this.$refs.searchProducts.scrollTop})
      if (to.name !== 'ProductDetail') {
        this.searchParams = ''
        this.loading = true
        this.hasSearch = false
        this.loadingText = '加载中...'
        this.products = []
        this.pageIndex = 1
        this.productsThumbnails = []
        this.noMoreData = false
        this.showGoTopBtn = false
      }
      next()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .container {
    overflow-y: scroll;
    padding-bottom: 1px;
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
  }
  .search-input {
    flex: 1;
    border: none;
    @include px2rem(height, 68px);
    background-color: $ninth-grey;
    @include px2rem(border-radius, 14px);
    color: $second-dark;
    @include font-dpr(14px);
    @include pm2rem(padding, 0px, 80px, 0px, 30px);
    display: flex;
    line-height: normal;
    justify-content: flex-start;
    align-items: center;
  }
  ::-webkit-input-placeholder{
    color: $eighth-grey;
    @include px2rem(height, 70px);
    vertical-align: middle;
    text-align: left;
    border: none;
    @include font-dpr(14px);
    line-height: normal;
  }
  .tags-area {
    @include px2rem(padding-top, 98px);
  }
  .option-bar {
    position: fixed;
    @include px2rem(top, 98px);
    width: 100%;
    max-width: 540px;
    z-index: 2;
    box-shadow: 0 4px 8px -4px rgba(0, 0, 0, .2);
  }
  .product-list-container {
    position: relative;
    @include px2rem(padding-top, 172px);
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
    .empty-products {
      color: $third-dark;
      .img-container {
        text-align: center;
        @include pm2rem(padding, 30px, 0px, 40px, 0px);
        img {
          width: 50%;
        }
      }
      p {
        @include font-dpr(16px);
        text-align: center;
      }
    }
  }
</style>
