<template>
  <section>
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
    <hot-tags
      v-if="!hasSearch"
      :tags="tags"
      class="tags-area"
      @click="goLink">
    </hot-tags>
    <div class="product-list-container">
      <template v-if="hasSearch && products && products.length > 0">
        <search-products-order
          class="option-bar"
          :sort-type="sort"
          @sort="sortProducts">
        </search-products-order>
        <product-list-mode
          :store="products"
          @click="goProductDetail">
        </product-list-mode>
        <mugen-scroll
          :handler="loadProductBottom"
          :handle-on-mount="false"
          :should-handle="!loading">
          <div
            v-if="loading || noMoreData"
            class="loading">
            <mt-spinner
              v-if="loading"
              type="snake"
              :size="18">
            </mt-spinner>
            <p>{{loadingText}}</p>
          </div>
        </mugen-scroll>
        <back-to-top
          :show="showGoTopBtn"
          @click="goScroll(0)">
        </back-to-top>
      </template>
      <template v-if="hasSearch && products && products.length === 0">
        <search-products-order
          class="option-bar"
          :sort-type="sort"
          @sort="sortProducts">
        </search-products-order>
        <div class="empty-products">
          <div class="img-container">
            <img src="../../assets/noSearchProducts.png">
          </div>
          <p>SORRY! 暂没有找到符合条件的信息</p>
        </div>
      </template>
    </div>
  </section>
</template>

<script>
  import ProductSearchBar from '../../components/product/Search'
  import HotTags from '../../components/product/HotTags'
  import ProductListMode from '../../components/product/List'
  import BackToTop from '../../components/common/BackToTop'
  import SearchProductsOrder from '../../components/product/Order'
  import { getStore, setStore, removeStore, showBack, setScrollTop, mobileClient } from '../../config/mUtils'
  import { Toast } from 'mint-ui'
  import { requestFn } from '../../config/request'
  import MugenScroll from 'vue-mugen-scroll'
  export default {
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
        noMoreData: false
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
        setScrollTop(0)
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
          if (res.data.products.length === 0) {
            this.loading = false
            this.hasSearch = true
            this.products = [...res.data.products, ...this.products]
            if (this.pageIndex !== 1) {
              this.noMoreData = true
              this.loadingText = '没有更多数据了...'
            }
          } else {
            let tmpArr = this.handleProductThumbnails(res.data.products)
            this.getFilesPublisheds(tmpArr, res.data.products)
          }
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
        setScrollTop(scroll)
      },
      handleSearchBtn () {
        // 每次搜索需重置分页索引,并重置产品列表
        this.pageIndex = 1
        this.products = []
        this.searchProducts(this.sort, this.searchParams)
        document.activeElement.blur()
      },
      handleGoTopBtn () {
        showBack((status) => {
          this.showGoTopBtn = status
        }, this.height)
      },
      loadProductBottom () {
        if (!this.noMoreData) {
          this.pageIndex += 1
          this.getProducts(this.sort, this.searchParams)
        }
      },
      goLogin () {
        setStore('beforeLogin', 'true')
        this.$router.push({name: 'Login'})
      },
      shouldLogin () {
        if (mobileClient() === 'weixin' && (!getStore('user') || !getStore('user').authentication_token)) {
          this.goLogin()
        } else {
          this.handleGoTopBtn()
        }
      }
    },
    mounted () {
      this.handleGoTopBtn()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

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
  .product-list-container {
    position: relative;
    @include pm2rem(padding, 172px, 0px, 10px, 0px);
    .loading {
      height: 40px;
      @include font-dpr(15px);
      color: $second-dark;
      line-height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      p {
        @include px2rem(margin-left, 20px);
      }
    }
    .option-bar {
      position: fixed;
      @include px2rem(top, 98px);
      width: 100%;
      max-width: 540px;
      z-index: 2;
      box-shadow: 0 4px 8px -4px rgba(0,0,0,.2);
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
