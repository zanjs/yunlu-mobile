<template>
  <section>
    <mt-header
      :title="header"
      fixed
      class="header">
      <mt-button
        slot="left"
        @click="goBack()"
        class="button-text">
        <i class="iconfont icon-fanhui"></i>
      </mt-button>
      <mt-button
        slot="right"
        @click="goReport(teams)"
        class="button-text">
        <i class="iconfont icon-jubao"></i>
        投诉
      </mt-button>
    </mt-header>
    <div class="card-container">
      <enterprise-card
        :store="teams"
        @icon-click="iconClick"
        @click="goEnterpriseDetail">
      </enterprise-card>
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
          <template v-if="products && products.length > 0">
            <mt-loadmore
              :top-method="loadProductTop"
              :bottom-method="loadProductBottom"
              :bottom-pull-text="bottomPullText"
              :bottom-drop-text="bottomDropText"
              :auto-fill="false"
              ref="loadMoreProducts">
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
            </mt-loadmore>
          </template>
          <div
            v-else
            class="no-data">
            <img src="../../assets/noProduct.png">
          </div>
        </template>
        <template v-else>
          <template v-if="enterpriseInfoFiles && enterpriseInfoFiles.length > 0">
            <transition
              name="fade"
              :appear="true"
              mode="out-in">
              <information-list
                :store="enterpriseInfoFiles"
                @click="openInformationFolders">
              </information-list>
            </transition>
          </template>
          <div
            v-else
            class="no-data">
            <img src="../../assets/noInformation.png">
          </div>
        </template>
        <div
          v-if="showGoTopBtn"
          class="cirlce-btn"
          @click="goTop()">
          <i class="iconfont icon-dingzhi"></i>
          <p>置顶</p>
        </div>
      </div>
    </div>
    <search
      v-show="showSearchBar"
      @search="search(queryParams)">
      <input
        slot="input"
        type="text"
        v-model="queryParams"
        :placeholder="placeholder">
    </search>
    <order
      v-show="showSearchBar && showProduct"
      :order-up="orderUp"
      :show-list="showList"
      @order-change="orderChange"
      @switch="showListChange">
    </order>
  </section>
</template>

<script>
  import EnterpriseCard from '../../components/common/EnterpriseCard'
  import ProductThumbnailMode from '../../components/product/Thumbnail'
  import ProductListMode from '../../components/product/List'
  import InformationList from '../../components/common/InformationList'
  import { getStore, setStore, showBack, removeStore } from '../../config/mUtils'
  import ViewBigImg from '../../components/common/ViewBigImg'
  import { mapGetters } from 'vuex'
  import Search from '../../components/common/Search'
  import Order from '../../components/common/Order'
  import { Toast, MessageBox } from 'mint-ui'
  export default {
    data () {
      return {
        teamId: this.$route.params.id,
        header: '名片',
        height: 153,
        hasLogin: !!getStore('user'),
        hasSearch: false,
        showProduct: true,
        showSearchBar: false,
        placeholder: '搜索产品',
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
        productOrder: 1,
        showList: false,
        currentIndex: 0,
        showGoTopBtn: false
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
      getEnterpriseDetail (teamId = this.teamId) {
        this.$store.dispatch('commonAction', {
          url: '/links/teams',
          method: 'get',
          params: {
            ids: teamId
          },
          target: this,
          resolve: (state, res) => {
            state.teams = res.data.teams[0]
            this.getProducts()
          },
          reject: () => {
          }
        })
      },
      getProducts (q = this.queryParams, order = this.productOrder) {
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
            // this.queryParams = ''
            let tmppArr = this.handleProductThumbnails(res.data.products)
            this.getFilesPublisheds(tmppArr, res.data.products, q)
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
            state.enterpriseInfoFiles = this.handleEnterpriseInfoFiles(state.enterpriseDocuments, res.data.files)
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
            team_id: this.teamId
          },
          target: this,
          resolve: (state, res) => {
            state.enterpriseDocuments = res.data.types.filter(i => i.file_id !== null)
            this.getInformation(this.handleDocumentIds(state.enterpriseDocuments))
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
            if (this.productPageIndex === 1) {
              state.products = this.handleProducts(arr, res.data.files)
              state.productsThumbnails = res.data.files
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
              state.products = [...state.products, ...this.handleProducts(arr, res.data.files)]
              state.productsThumbnails = [...state.productsThumbnails, ...res.data.files]
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
      goBack () {
        if (this.hasSearch) {
          document.body.scrollTop = 0
          this.getProducts('', 'price')
        } else if (getStore('EnterpriseCarte_goHome')) {
          removeStore('EnterpriseCarte_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      goReport (item) {
        document.body.scrollTop = 0
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
      handleSearchBar () {
        showBack((status) => {
          this.showGoTopBtn = status
          if (this.currentIndex === 1) {
            this.showSearchBar = false
            this.header = '名片'
          } else {
            this.showSearchBar = status
            this.header = status ? '产品' : '名片'
          }
        }, this.height)
      },
      goTop () {
        document.body.scrollTop = 0
      },
      goProductDetail (item) {
        document.body.scrollTop = 0
        this.$router.push({name: 'ProductDetail', params: {id: item.id}})
      },
      goEnterpriseDetail (id) {
        if (!this.hasLogin) {
          // Toast('登录后才能查看企业详细信息')
          setStore('beforeLogin', 'true')
          this.$router.push({name: 'Login'})
        } else {
          this.$router.push({name: 'EnterpriseDetail', params: {id: id}})
        }
      },
      iconClick (item) {
        switch (item.type) {
          case 'email':
            // this.linkToast('企业', '邮箱地址', item.value)
            this.showMessageBox(item.value)
            break
          case 'weixin':
            // this.linkToast('企业', '微信号', item.value)
            this.showMessageBox(item.value)
            break
          case 'website':
            // this.linkToast('企业', '网址', item.value)
            // this.showMessageBox(item.value)
            window.location.href = item.value.indexOf('http') > -1 ? item.value : `http://${item.value}`
            break
          case 'qq':
            // window.location.href = `http://wpa.qq.com/msgrd?v=3&uin=${item.value}&site=qq&menu=yes`
            // this.linkToast('企业', 'QQ账号', item.value)
            this.showMessageBox(item.value)
            break
          case 'address':
            // Toast('暂未开放')
            if (item.value.latitude && item.value.longitude) {
              this.$router.push({name: 'Maps', query: {lat: item.value.latitude, lng: item.value.longitude, title: this.$store.state.teams.company}})
            } else {
              this.$router.push({name: 'Maps', query: {lat: '', lng: '', title: this.$store.state.teams.company, address: item.value.address}})
            }
            break
        }
      },
      linkToast (str, key, value) {
        Toast({
          message: `该${str}${key}为：${value}`,
          duration: 5000
        })
      },
      showMessageBox (str) {
        MessageBox({
          title: '长按复制到剪切板',
          message: str
        })
      },
      openInformationFolders (item) {
        this.$router.push({name: 'InformationFolders', params: {id: this.teamId}, query: {type: item.name || ''}})
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
      this.getEnterpriseDetail(this.teamId)
      this.handleSearchBar()
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
    .tab-bar {
      color: #52CAA7;
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
    .no-data {
      @include pm2rem(padding, 100px, 20px, 100px, 0px);
      @include pm2rem(margin, 20px, 22px, 0px, 22px);
      background-color: $white;
      text-align: center;
      border: 1px solid #D1D1D1;
      img {
        @include px2rem(width, 260px);
        height: auto;
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
