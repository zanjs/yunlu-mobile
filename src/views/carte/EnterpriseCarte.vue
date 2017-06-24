<template>
  <section>
    <mt-header title="名片"
               fixed
               class="header">
      <mt-button slot="left"
                 @click="goBack()"
                 class="button-text">
        <i class="iconfont icon-fanhui"></i>
      </mt-button>
      <mt-button slot="right"
                 @click="goReport()"
                 class="button-text">
        <i class="iconfont icon-jubao"></i>
        投诉
      </mt-button>
    </mt-header>
    <div class="card-container">
      <enterprise-card :store="teams"
                       @click="goEnterpriseDetail"></enterprise-card>
    </div>
    <div class="nav-tabs">
      <div class="tab-bar">
        <div class="left"
             v-bind:class="{'active': showProduct}"
             @click.prevent="tabClick(0)">产品</div>
        <div class="right"
             v-bind:class="{'active': !showProduct}"
             @click.prevent="tabClick(1)">资讯</div>
      </div>
      <div class="tab-container">
        <template v-if="showProduct">
          <mt-loadmore
              :top-method="loadProductTop"
              :bottom-method="loadProductBottom"
              :bottom-pull-text="bottomPullText"
              :bottom-drop-text="bottomDropText"
              :auto-fill="false"
              ref="loadMoreProducts">
            <transition name="fade" mode="out-in">
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
          </mt-loadmore>
        </template>
        <template v-else>
          <transition name="fade" mode="out-in">
            <information-list
              :store="enterpriseInfoFiles"
              @click="viewBigImg">
            </information-list>
          </transition>
        </template>
      </div>
    </div>
    <div>
      <view-big-img
        :data-source="infoImg"
        :index="currentIndex"
        :show-preview="showFullScreenPreview"
        :css-animation="cssAnimationViewer"
        @close="closeImgViewer"></view-big-img>
    </div>
    <transition name="fade">
      <search v-show="showSearchBar"
              :placeholder="placeholder"
              @search="search">
      </search>
    </transition>
    <transition name="fade">
      <order v-show="showSearchBar && showProduct"
             :order-up="orderUp"
             :show-list="showList"
             @orderChange="orderChange"
             @switch="showListChange"></order>
    </transition>
  </section>
</template>

<script>
  import EnterpriseCard from '../../components/common/EnterpriseCard'
  import ProductThumbnailMode from '../../components/product/Thumbnail'
  import ProductListMode from '../../components/product/List'
  import InformationList from '../../components/common/InformationList'
  import { showBack } from '../../config/mUtils'
  import ViewBigImg from '../../components/common/ViewBigImg'
  import { mapGetters } from 'vuex'
  import { Indicator } from 'mint-ui'
  import Search from '../../components/common/Search'
  import Order from '../../components/common/Order'
  export default {
    data () {
      return {
        teamId: 6642,
        hasSearch: false,
        showProduct: true,
        showSearchBar: false,
        placeholder: '搜索产品',
        cssAnimationViewer: false,
        productPageIndex: 1,
        productPageSize: 10,
        productLoaded: false,
        enterprisePageIndex: 1,
        enterprisePageSize: 10,
        personPageIndex: 1,
        personPageSize: 10,
        bottomPullText: '上拉加载更多',
        bottomDropText: '释放加载',
        queryParams: '',
        orderUp: true,
        productOrder: 'price',
        showList: false,
        currentIndex: 0,
        showFullScreenPreview: false,
        infoImg: []
      }
    },
    components: {
      EnterpriseCard,
      ProductThumbnailMode,
      ProductListMode,
      InformationList,
      ViewBigImg,
      Search,
      Order
    },
    methods: {
      getEnterpriseDetail () {
        Indicator.open()
        this.$store.dispatch('commonAction', {
          url: '/links/teams',
          method: 'get',
          params: {
            ids: this.teamId
          },
          target: this,
          resolve: (state, res) => {
            Indicator.close()
            state.teams = res.data.teams[0]
            this.getProducts()
          },
          reject: () => {
            Indicator.close()
          }
        })
      },
      getProducts (q = this.queryParams, order = this.productOrder) {
        Indicator.open()
        this.queryParams = q
        this.productOrder = order
        this.productLoaded = false
        this.$store.dispatch('commonAction', {
          url: '/products',
          method: 'get',
          params: {
            team_id: this.teamId,
            page: this.productPageIndex,
            per_page: this.productPageSize,
            sort: order || '',
            q: q || ''
          },
          target: this,
          resolve: (state, res) => {
            this.hasSearch = q !== ''
            this.productLoaded = false
            this.queryParams = ''
            let tmppArr = this.handleProductThumbnails(res.data.products)
            this.getFilesPublisheds(tmppArr, res.data.products, q)
          },
          reject: () => {
            Indicator.close()
          }
        })
      },
      // 手机QQ浏览器不支持array.findIndex方法
      handleProducts (arr, arr2) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < arr2.length; j++) {
            if (arr[i].file_id === arr2[j].id) {
              let tmpObj = {
                ...arr[i],
                file_url: arr2[j].url,
                file_thumb_urls: arr2[j].thumb_urls[0]
              }
              tmpArr.push(tmpObj)
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
            team_id: this.teamId,
            thumbs: ['general'],
            ids: ids
          },
          target: this,
          resolve: (state, res) => {
            Indicator.close()
            state.enterpriseInfoFiles = this.handleEnterpriseInfoFiles(state.enterpriseDocuments, res.data.files)
          },
          reject: () => {
            Indicator.close()
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
      getEnterpriseDocument () {
        Indicator.open()
        this.$store.dispatch('commonAction', {
          url: '/archives/stat/types',
          method: 'get',
          params: {
            team_id: this.teamId
          },
          target: this,
          resolve: (state, res) => {
            state.enterpriseDocuments = res.data.types.filter(i => i.file_id !== null)
            this.getInformation(this.handleDocumentIds(state.enterpriseDocuments))
            Indicator.close()
          },
          reject: () => {
            Indicator.close()
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
      getFilesPublisheds (ids, arr, q) {
        this.$store.dispatch('commonAction', {
          url: '/links/files/publisheds',
          method: 'get',
          params: {
            type: 'product',
            team_id: this.teamId,
            thumbs: ['general'],
            ids: ids
          },
          target: this,
          resolve: (state, res) => {
            Indicator.close()
            if (this.productPageIndex === 1 || q !== '') {
              state.products = this.handleProducts(arr, res.data.files)
              state.productsThumbnails = res.data.files
              this.$refs.loadMoreProducts.onTopLoaded()
            } else {
              state.products = [...state.products, ...this.handleProducts(arr, res.data.files)]
              state.productsThumbnails = [...state.productsThumbnails, ...res.data.files]
              this.$refs.loadMoreProducts.onBottomLoaded()
            }
            this.getEnterpriseDocument()
          },
          reject: () => {
            Indicator.close()
          }
        })
      },
      goBack () {
        if (this.hasSearch) {
          this.getProducts('', 'price')
        } else {
          this.$router.go(-1)
        }
      },
      goReport () {
        document.body.scrollTop = 0
        this.$router.push({name: 'Report'})
      },
      tabClick (val) {
        this.showProduct = val === 0
        this.placeholder = val === 0 ? '搜索产品' : '搜素资讯'
        this.handleSearchBar()
      },
      search (res) {
        if (this.showProduct) {
          this.getProducts(res)
        }
      },
      handleSearchBar () {
        let height = parseFloat(document.documentElement.style.fontSize.replace('px', '')) * 153 / 36
        showBack((stauts) => {
          if (this.activeIndex === 1) {
            this.showSearchBar = false
          } else {
            this.showSearchBar = stauts
          }
        }, height)
      },
      goProductDetail (item) {
        document.body.scrollTop = 0
        this.$router.push({name: 'ProductDetail', params: {id: item.id, teamId: this.teamId, organizationId: item.organization_id}})
      },
      goEnterpriseDetail (id) {
        console.log(id)
        this.$router.push({path: '/enterprisedetail'})
      },
      viewBigImg (index) {
        console.log(index)
        this.infoImg.push(index)
        this.showFullScreenPreview = true
      },
      closeImgViewer () {
        this.cssAnimationViewer = true
        setTimeout(() => {
          this.infoImg = []
          this.showFullScreenPreview = false
          this.cssAnimationViewer = false
        }, 500)
      },
      stopTouchMove () {
        let self = this
        document.getElementById('app').addEventListener('touchmove', (e) => { // 监听滚动事件
          if (self.showFullScreenPreview) {
            e.preventDefault() // 最关键的一句，禁止浏览器默认行为
          }
        })
      },
      showListChange (val) {
        this.showList = val
      },
      orderChange (val) {
        this.orderUp = val
        this.productOrder = val ? 'price' : '-price'
        this.productPageIndex = 1 // 调整价格排序后，需要从第一页重新开始获取产品数据
        this.getProducts(this.queryParams, this.productOrder)
      },
      loadProductTop () {
        this.productPageIndex = 1
        this.getProducts()
      },
      loadProductBottom () {
        this.productPageIndex += 1
        this.getProducts()
      }
    },
    mounted () {
      Indicator.open()
      this.getEnterpriseDetail()
      this.handleSearchBar()
      this.stopTouchMove()
    },
    computed: {
      ...mapGetters([
        'teams',
        'loadSuccess',
        'products',
        'productsThumbnails',
        'enterpriseDocuments',
        'enterpriseInfoFiles'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .header {
    background-color: $green;
    @include px2rem(height, 88px);
    @include pm2rem(padding, 0px, 30px, 0px, 30px);
    @include font-dpr(17px);
    position: fixed;
    z-index: 1002 !important;
    h1 {
      @include font-dpr(17px);
    }
    .button-text {
      @include font-dpr(15px);
    }
    i {
      @include font-dpr(20px);
    }
  }
  .card-container {
    @include pm2rem(padding, 96px, 22px, 0px, 22px);
  }
  .nav-tabs {
    @include pm2rem(margin, 20px, 0px, 10px, 0px);
    background-color: $white;
    color: #52CAA7;
    .tab-bar {
      @include px2rem(height, 84px);
      @include pm2rem(padding, 0px, 22px, 0px, 22px);
      div {
        height: 100%;
        width: 50%;
        box-sizing: border-box;
        @include px2rem(line-height, 84px);
        text-align: center;
        @include font-dpr(17px);
        color: #52CAA7;
        border: 1px solid #52CAA7;
      }
      .left {
        @include px2rem(border-top-left-radius, 14px);
        @include px2rem(border-bottom-left-radius, 14px);
        color: #52CAA7;
      }
      .active {
        background-color: #52CAA7;
        color: $white;
      }
      .right {
        @include px2rem(border-top-right-radius, 14px);
        @include px2rem(border-bottom-right-radius, 14px);
      }
    }
  }

  .fade-enter {
    opacity: 0;
  }
  .fade-enter-to {
    opacity: 1;
  }
  .fade-enter-active {
    transition: .5s ease-in;
  }
  .fade-leave {
    opacity: 1;
  }
  .fade-leave-active {
    transition: .5s ease-out;
  }
  .fade-leave-to {
    opacity: 0
  }
</style>
