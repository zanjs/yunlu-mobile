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
        <product-list
          :store="products"
          @search="getProducts"
          :css-animation="showProduct && cssAnimationProduct"
          :show="showProduct"
          @click="goProductDetail"></product-list>
        <information-list
          :store="enterpriseInfoFiles"
          :css-animation="!showProduct && cssAnimation"
          :show="!showProduct"
          @click="viewBigImg"></information-list>
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
  </section>
</template>

<script>
  import EnterpriseCard from '../../components/common/EnterpriseCard'
  import ProductList from '../../components/common/ProductList'
  import InformationList from '../../components/common/InformationList'
  import { showBack } from '../../config/mUtils'
  import ViewBigImg from '../../components/common/ViewBigImg'
  import { mapGetters } from 'vuex'
  import { Indicator } from 'mint-ui'
  export default {
    data () {
      return {
        teamId: 3089,
        hasSearch: false,
        showProduct: true,
        cssAnimation: false,
        cssAnimationProduct: false,
        cssAnimationViewer: false,
        currentIndex: 0,
        showFullScreenPreview: false,
        infoImg: []
      }
    },
    components: {
      EnterpriseCard,
      ProductList,
      InformationList,
      ViewBigImg
    },
    methods: {
      getEnterpriseDetail () {
        this.$store.dispatch('commonAction', {
          url: '/links/teams',
          method: 'get',
          params: {
            ids: this.teamId
          },
          target: this,
          resolve: (state, res) => {
            state.teams = res.data.teams[0]
            this.getProducts()
          },
          reject: () => {}
        })
      },
      getProducts (q = '', order = 1) {
        this.$store.dispatch('commonAction', {
          url: '/products',
          method: 'get',
          params: {
            team_id: this.teamId,
            page: 1,
            per_page: 10,
            sort: order,
            q: q
          },
          target: this,
          resolve: (state, res) => {
            this.hasSearch = q !== ''
            this.getFilesPublisheds(this.handleProductThumbnails(res.data.products), res.data.products)
          },
          reject: () => {}
        })
      },
      handleProducts (arr, arr2) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          let index = arr2.findIndex(item => item.id === arr[i].file_id)
          let tmpObj = {...arr[i], file_url: arr2[index].url, file_thumb_urls: arr2[index].thumb_urls[0]}
          tmpArr.push(tmpObj)
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
          reject: () => {}
        })
      },
      handleEnterpriseInfoFiles (enterpriseDocuments, files) {
        for (let i = 0; i < files.length; i++) {
          let index = enterpriseDocuments.findIndex(item => item.file_id === files[i].id)
          files[i].name = enterpriseDocuments[index].name
          files[i].count = enterpriseDocuments[index].count
          switch (enterpriseDocuments[index].name) {
            case null:
              files[i].cnname = '其他'
              break
            case 'Certificate':
              files[i].cnname = '企业身份'
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
        return files
      },
      // 获取指定组织已发布的公司档分类概况(公司/企业名片资讯)
      getEnterpriseDocument () {
        this.$store.dispatch('commonAction', {
          url: '/archives/stat/types',
          method: 'get',
          params: {
            team_id: this.teamId
          },
          target: this,
          resolve: (state, res) => {
            state.enterpriseDocuments = res.data.types.filter(i => i.file_id !== null)
            this.getInformation(this.handleDocumentIds(res.data.types.filter(i => i.file_id !== null)))
            Indicator.close()
          },
          reject: () => {}
        })
      },
      handleDocumentIds (arr) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          tmpArr.push(arr[i].file_id)
        }
        return tmpArr
      },
      getFilesPublisheds (ids, products) {
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
            state.productsThumbnails = res.data.files
            state.products = this.handleProducts(products, state.productsThumbnails)
            this.getEnterpriseDocument()
          },
          reject: () => {}
        })
      },
      goBack () {
        if (this.hasSearch) {
          this.getProducts()
        } else {
          this.$router.go(-1)
        }
      },
      goReport () {
        document.body.scrollTop = 0
        this.$router.push({path: '/report'})
      },
      tabClick (val) {
        this.showProduct = val === 0
        this.showSearchBar()
      },
      showSearchBar () {
        // 开始监听scrollTop的值，达到一定程度后显示返回顶部搜索栏
        let height = parseFloat(document.documentElement.style.fontSize.replace('px', '')) * 153 / 36
        let elementId = 'productList'
        if (!this.showProduct) {
          height = parseFloat(document.documentElement.style.fontSize.replace('px', '')) * 190 / 36
          elementId = 'informationList'
        }
        showBack((id, status) => {
          if (id === 'productList') {
            this.cssAnimationProduct = status
            if (!status) {
              setTimeout(() => {
                this.showBarProduct = status
              }, 510)
            } else {
              this.showBarProduct = status
            }
          } else {
            this.cssAnimation = status
            if (!status) {
              setTimeout(() => {
                this.showBar = status
              }, 510)
            } else {
              this.showBar = status
            }
          }
        }, elementId, height)
      },
      goProductDetail (item) {
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
      }
    },
    mounted () {
      Indicator.open()
      this.getEnterpriseDetail()
      this.showSearchBar()
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
</style>
