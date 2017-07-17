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
        class="search-input"
        v-model="searchParams"
        @input="handleInput"
        @keyup.enter="handleSearchBtn"
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
        <mt-loadmore
          :top-method="loadProductTop"
          :bottom-method="loadProductBottom"
          :bottom-pull-text="bottomPullText"
          :bottom-drop-text="bottomDropText"
          :auto-fill="false"
          ref="loadMoreProducts">
          <product-list-mode
            :store="products"
            class="product-list"
            @click="goProductDetail">
          </product-list-mode>
        </mt-loadmore>
        <div
          v-if="showGoTopBtn"
          class="cirlce-btn"
          @click="goTop()">
          <i class="iconfont icon-dingzhi"></i>
          <p>置顶</p>
        </div>
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
  import SearchProductsOrder from '../../components/product/Order'
  import { getStore, removeStore, showBack } from '../../config/mUtils'
  import { Toast } from 'mint-ui'
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
        bottomPullText: '上拉加载更多',
        bottomDropText: '释放加载',
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
        ]
      }
    },
    components: {
      ProductSearchBar,
      HotTags,
      ProductListMode,
      SearchProductsOrder
    },
    methods: {
      resetSearchBar () {
        this.searchParams = ''
        this.sort = ''
        this.hasSearch = false
        this.products = []
        this.pageIndex = 1
        this.productsThumbnails = []
      },
      handleInput () {
        if (this.searchParams === '') {
          this.resetSearchBar()
        }
        this.pageIndex = 1
      },
      sortProducts (val) {
        // 每次切换排序方式，都需要栋第一页开始，避免前面已加载的数据顺序异常
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
      getProducts (sort = this.sort, q = this.searchParams) {
        this.sort = sort
        this.$store.dispatch('commonAction', {
          url: '/products',
          method: 'get',
          params: {
            page: this.pageIndex,
            per_page: this.pageSize,
            sort: sort,
            q: q
          },
          target: this,
          resolve: (state, res) => {
            let tmpArr = this.handleProductThumbnails(res.data.products)
            this.getFilesPublisheds(tmpArr, res.data.products)
          },
          reject: () => {
          }
        })
      },
      handleProductThumbnails (arr) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          tmpArr.push(arr[i].files[0].file_id)
        }
        return tmpArr
      },
      getFilesPublisheds (ids, arr) {
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
            this.hasSearch = true
            if (this.pageIndex === 1) {
              this.products = this.handleProducts(arr, res.data.files)
              this.productsThumbnails = res.data.files
              // products为空时，上拉加载、下拉刷新组件未初始化，不能直接调用它的重置位置方法
              if (this.$refs.loadMoreProducts && this.$refs.loadMoreProducts.onTopLoaded) {
                this.$refs.loadMoreProducts.onTopLoaded()
              }
            } else {
              if (res.data.files.length === 0) {
                Toast({
                  message: '没有更多数据了',
                  duration: 1000
                })
              }
              this.products = [...this.products, ...this.handleProducts(arr, res.data.files)]
              this.productsThumbnails = [...this.productsThumbnails, ...res.data.files]
              if (this.$refs.loadMoreProducts && this.$refs.loadMoreProducts.onBottomLoaded) {
                this.$refs.loadMoreProducts.onBottomLoaded()
              }
            }
            this.getEnterpriseDocument()
          },
          reject: () => {
          }
        })
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
      goTop () {
        document.body.scrollTop = 0
      },
      handleSearchBtn () {
        this.searchProducts(this.sort, this.searchParams)
        document.activeElement.blur()
      },
      handleGoTopBtn () {
        showBack((status) => {
          this.showGoTopBtn = status
        }, this.height)
      },
      loadProductTop () {
        this.pageIndex = 1
        this.getProducts(this.sort, this.searchParams)
      },
      loadProductBottom () {
        this.pageIndex += 1
        this.getProducts(this.sort, this.searchParams)
      }
    },
    mounted () {
      this.handleGoTopBtn()
      this.$refs.searchInput.focus()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .search-input {
    flex: 1;
    border: none;
    @include px2rem(height, 68px);
    background-color: #EDEDED;
    @include px2rem(border-radius, 14px);
    color: #595959;
    @include font-dpr(14px);
    @include pm2rem(padding, 0px, 80px, 0px, 30px);
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  ::-webkit-input-placeholder{
    color: #C2C2C2;
    @include px2rem(height, 70px);
    vertical-align: middle;
    text-align: left;
    border: none;
    @include font-dpr(14px);
    @include px2rem(padding-top, 4px);
  }
  input[type=search]::-webkit-search-cancel-button {
    -webkit-appearance: none; // 此处只是去掉默认的小×
  }
  .tags-area {
    @include px2rem(padding-top, 98px);
  }
  .product-list-container {
    @include px2rem(padding-top, 172px);
    .option-bar {
      position: fixed;
      @include px2rem(top, 98px);
      width: 100%;
      z-index: 2;
    }
    .empty-products {
      color: #A6A6A6;
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
    .cirlce-btn {
      @include px2rem(width, 100px);
      @include px2rem(height, 100px);
      @include px2rem(border-radius, 50px);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: fixed;
      @include px2rem(bottom, 76px);
      @include px2rem(right, 40px);
      color: $white;
      background-color: rgba(0, 0, 0, .68);
      line-height: 1;
      z-index: 1004;
      i {
        @include font-dpr(21px);
      }
      p {
        @include font-dpr(12px);
      }
    }
  }
</style>
