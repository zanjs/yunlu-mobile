<template>
  <section>
    <mt-header title="名片"
               fixed
               class="header">
      <router-link to="/" slot="left">
        <mt-button>
          <i class="iconfont icon-fanhui"/>
        </mt-button>
      </router-link>
      <mt-button slot="right"
                 @click="goReport()"
                 class="button-text">
        <i class="iconfont icon-jubao"/>
        投诉
      </mt-button>
    </mt-header>
    <div class="card-container">
      <enterprise-card :store="teams"
                       @click="goEnterpriseDetail"/>
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
          @click="goProductDetail"/>
        <information-list
          :css-animation="!showProduct && cssAnimation"
          :show="!showProduct"
          @click="viewBigImg"/>
      </div>
    </div>
    <div>
      <view-big-img
        :data-source="infoImg"
        :index="currentIndex"
        :show-preview="showFullScreenPreview"
        :css-animation="cssAnimationViewer"
        @close="closeImgViewer"/>
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
        teamId: 6600,
        showProduct: true,
        cssAnimation: false,
        cssAnimationProduct: false,
        cssAnimationViewer: false,
        currentIndex: 0,
        showFullScreenPreview: false,
        productsThumbnailsIds: [],
        infoImg: [],
        infoImgList: [
          {
            id: 1,
            name: '黄龙云平板',
            money: '1800',
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 2,
            name: '黄龙云平板',
            money: '1799',
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 2,
            name: '黄龙云平板',
            money: '1500',
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 2,
            name: '黄龙云平板',
            money: '定制',
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 2,
            name: '黄龙云平板',
            money: '2800',
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 1,
            name: '黄龙云平板',
            money: '1800',
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 2,
            name: '黄龙云平板',
            money: '1799',
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 2,
            name: '黄龙云平板',
            money: '1500',
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 2,
            name: '黄龙云平板',
            money: '定制',
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 2,
            name: '黄龙云平板',
            money: '2800',
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }
        ]
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
            ids: this.teamId // 生产环境的一个企业
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
            team_id: this.teamId, // 生产环境的一个企业
            page: 1,
            per_page: 10,
            sort: order,
            q: q
          },
          target: this,
          resolve: (state, res) => {
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
          },
          reject: () => {}
        })
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
      goProductDetail (id) {
        this.$router.push({name: 'ProductDetail', params: {id: id, teamId: this.teamId}})
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
        'productsThumbnails'
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
