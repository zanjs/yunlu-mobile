<template>
  <section class="full-width">
    <search-header
      @back="goBack()"
      @search="handleSearchBtn(sort, queryParams)"
      :show-cancel="false">
      <input
        slot="input"
        type="search"
        v-model="queryParams"
        @keyup.enter.prevent="handleSearchBtn(sort, queryParams)"
        :placeholder="placeholder">
    </search-header>
    <search-products-order
      class="option-bar"
      :sort-type="sort"
      @sort="sortProducts">
    </search-products-order>
    <section class="full-width wrapper" ref="categoryProducts" :style="{'height': scrollHeight}">
      <template v-if="loading || products && products.length > 0">
        <div>
          <transition
            name="fade"
            :appear="false"
            mode="out-in">
            <product-thumbnail-mode
              :store="products"
              :loading="loading"
              :num="pageSize"
              @click="goProductDetail">
            </product-thumbnail-mode>
          </transition>
          <mugen-scroll
            :handler="loadProductBottom"
            :handle-on-mount="false"
            :should-handle="!loading"
            :threshold="0.1"
            scroll-container="categoryProducts">
            <div class="loading">
              <mt-spinner
                v-show="!noMoreProducts"
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
    </section>
    <back-to-top
      :show="showGoTopBtn"
      @click="goScroll(0)">
    </back-to-top>
  </section>
</template>

<script>
  import SearchHeader from '../../components/header/SearchHeader'
  import { getStore, removeStore, setScrollTop, showBack } from '../../config/mUtils'
  import SearchProductsOrder from '../../components/product/Order'
  import ProductThumbnailMode from '../../components/product/Thumbnail'
  import BackToTop from '../../components/common/BackToTop'
  import { requestFn } from '../../config/request'
  import MugenScroll from 'vue-mugen-scroll'
  import { Toast } from 'mint-ui'
  export default {
    name: 'CategoryProducts',
    props: ['id'],
    data () {
      return {
        queryParams: '',
        sort: '',
        placeholder: '请输入关键字',
        pageIndex: 1,
        pageSize: 20,
        products: [],
        productsThumbnails: [],
        loading: true,
        loadingText: '加载中...',
        noMoreProducts: false,
        scrollHeight: '15rem',
        height: 160,
        showGoTopBtn: false,
        scrollActive: false
      }
    },
    components: {
      SearchHeader,
      SearchProductsOrder,
      ProductThumbnailMode,
      MugenScroll,
      BackToTop
    },
    methods: {
      goBack () {
        if (getStore('CategoryProducts_goHome')) {
          removeStore('CategoryProducts_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      async getProducts (sort = this.sort, q = this.queryParams) {
        this.sort = sort
        this.loading = true
        let {res} = await requestFn({
          url: '/products',
          params: {
            page: this.pageIndex,
            per_page: this.pageSize,
            sort: sort,
            q: q,
            category_id: this.id
          }
        })
        if (res.data) {
          if (res.data.products.length < this.pageSize) {
            this.noMoreData = true
            this.loadingText = '没有更多数据了...'
          }
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
      sortProducts (val) {
        // 每次切换排序方式，都需要从第一页开始，避免前面已加载的数据顺序异常
        this.pageIndex = 1
        this.getProducts(val, this.queryParams)
      },
      handleSearchBtn (sort = this.sort, params = this.queryParams) {
        if (!params) {
          Toast({
            message: '搜索关键词不能为空',
            duration: 500
          })
        } else {
          this.getProducts(sort, params)
        }
      },
      loadProductBottom () {
        if (!this.noMoreData) {
          this.pageIndex += 1
          this.getProducts(this.sort, this.queryParams)
        }
      },
      handleScrollHeight () {
        let appHeight = document.getElementById('app').offsetHeight
        let rootFontSize = document.documentElement.style.fontSize.split('p')[0]
        let divHeight = (appHeight / parseFloat(rootFontSize + '')).toFixed(2)
        this.scrollHeight = `${Math.round(divHeight * 100) / 100}rem`
      },
      goProductDetail (item) {
        this.$router.push({name: 'ProductDetail', params: {id: item.id}})
      },
      // 滚动到页面指定位置
      goScroll (scroll = 0) {
        setScrollTop(scroll, this.$refs.categoryProducts)
      },
      handleGoTopBtn () {
        if (!this.scrollActive) {
          showBack((status) => {
            this.showGoTopBtn = status
            this.scrollActive = true
          }, this.height, this.$refs.categoryProducts)
        }
      }
    },
    mounted () {
      this.handleScrollHeight()
    },
    activated () {
      this.showGoTopBtn = false
      if (!this.$store.state.popState) {
        setScrollTop(0, this.$refs.categoryProducts)
        this.getProducts()
        this.handleGoTopBtn()
      } else {
        setScrollTop(this.$store.state.scrollMap.CategoryProducts || 0, this.$refs.categoryProducts)
      }
    },
    beforeRouteLeave (to, from, next) {
      this.$store.dispatch('saveScroll', {name: 'CategoryProducts', value: this.$refs.categoryProducts.scrollTop})
      if (to.name !== 'ProductDetail') {
        this.pageIndex = 1
        this.loading = true
        this.queryParams = this.$route.query.q || ''
        this.hasSearch = false
        this.loadingText = '加载中...'
        this.noMoreProducts = false
        this.products = []
        this.productsThumbnails = []
      }
      next()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .option-bar {
    position: fixed;
    @include px2rem(top, 88px);
    width: 100%;
    max-width: 540px;
    z-index: 2;
    box-shadow: 0 4px 8px -4px rgba(0, 0, 0, .2);
  }
  .wrapper {
    box-sizing: border-box;
    overflow-y: scroll;
    padding-bottom: 1px; // 避免安卓手机QQ浏览器，滑动到底部后第一次不能直接上滑的bug
    -webkit-overflow-scrolling: touch;
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
  }
</style>
