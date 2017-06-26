<template>
  <section>
    <product-header></product-header>
    <div class="swipe">
      <swiper :options="swiperOption">
        <swiper-slide v-for="(item, index) in productDetailFiles"
                      :key="index">
          <img :src="item.url"
               @click="viewFullScreenPic(productDetailFiles)">
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
      <span v-if="productDetailFiles && productDetailFiles.length"
            class="page-nav">{{currentIndex}}/{{productDetailFiles.length}}</span>
      <span v-else
            class="page-nav">0/0</span>
    </div>
    <section class="info-container">
      <div v-if="productDetail && productDetail.name"
           class="name">{{productDetail.name}}</div>
      <div v-else
           class="name">*****</div>
      <div class="money">
        <div>
          <span v-if="productDetail && productDetail.prices && productDetail.prices.length > 0"
                class="number">{{productDetail.prices[0].money}}</span>
          <span v-else
                class="number">0.00</span>
          <span v-if="productDetail && productDetail.prices && productDetail.prices.length > 0 && productDetail.prices[0].money !== '定制'"
                class="unit">元</span>
        </div>
        <div @click="expandMorePrice()">
          <span class="more">更多价格</span>
          <div class="icon-box"
               v-bind:class="{'rotate-90-cw': cssAnimation, 'rotate-90-ccw': !cssAnimation}">
            <i class="iconfont icon-gengduo more-icon"></i>
          </div>
        </div>
        <div v-show="morePrice"
             class="more-price"
             v-bind:class="{'more-price-show': cssAnimation, 'more-price-hide': !cssAnimation}">
          <p v-for="(item, index) in productDetail.prices"
             :key="item.id"
             @click="changePrice(item)">
            {{item.money}}
          </p>
        </div>
      </div>
      <div v-if="productDetail && productDetail.prices && productDetail.prices.length > 0"
           class="inventory">
        库存 ：{{productDetail.prices[0].amount}}
      </div>
      <div v-else
           class="inventory">
        库存 ：0
      </div>
    </section>
    <section>
      <mt-navbar v-model="selected"
                 class="nav-bar">
        <mt-tab-item id="1">价格参数</mt-tab-item>
        <mt-tab-item id="2">产品参数</mt-tab-item>
        <mt-tab-item id="3">关联信息</mt-tab-item>
      </mt-navbar>
      <mt-tab-container v-model="selected"
                        class="nav-bar-container">
        <mt-tab-container-item
          id="1"
          class="prodcutdetail-price-item">
          <template v-if="currentPriceProperties && currentPriceProperties.length > 0">
            <span v-for="(item, index) in currentPriceProperties"
                  :key="index"
                  class="row-item">{{item.key}} : {{item.value}}</span>

          </template>
          <div v-else
               class="no-price">该产品暂无价格参数</div>
        </mt-tab-container-item>
        <mt-tab-container-item
          id="2"
          class="productdetail-product-item">
          <template v-if="productDetail && productDetail.goods_type !== 'StoneMaterial'">
            <template v-if="productDetail.properties && productDetail.properties.length > 0 &&  productDetail.properties[0].children.length > 0">
              <div v-for="(item, index) in productDetail.properties"
                   :key="index"
                   class="row-item">
                <div v-for="(i, indexI) in item.children"
                     :key="indexI"
                     class="title-container">
                  <div class="dot"></div>
                  <span class="title">{{i.name}} : {{i.value}}</span>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="no-product-args">
                该产品暂无产品参数
              </div>
            </template>
          </template>
          <template v-else>
            <div v-if="productDetail && productDetail.goods_type === 'StoneMaterial'"
                 class="row-item">
              <div class="title-container">
                <div class="dot"></div>
                <span class="title">{{productDetail.category_name}}</span>
              </div>
              <div class="title-container">
                <div class="dot"></div>
                <span class="title">{{productDetail.taxonomy.name}} /{{productDetail.taxonomy.colour_desc[1]}} /{{productDetail.taxonomy.depth_desc[1]}} /{{productDetail.taxonomy.pattern_desc[1]}}</span>
              </div>
              <div class="title-container">
                <div class="dot"></div>
                <span class="title">{{productDetail.surface.product_class.name}} /{{productDetail.surface.name}}</span>
              </div>
            </div>
            <div v-else
                 class="no-product-args">
              该产品暂无产品参数
            </div>
          </template>
        </mt-tab-container-item>
        <mt-tab-container-item
          id="3"
          class="productdetail-product-tags">
          <template v-if="archives && archives.length > 0">
            <div v-for="(item, index) in archives"
               :key="index"
               @click="viewArchives(item)"
               class="tag">{{item.name}}</div>
          </template>
          <div v-else
               class="no-info">该产品暂无关联信息</div>
        </mt-tab-container-item>
      </mt-tab-container>
    </section>
    <section class="company-info">
      <div class="company-img">
        <img v-if="productDetailTeam && productDetailTeam.logo"
             :src="productDetailTeam.logo">
        <img v-else
             src="http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg">
      </div>
      <div class="company-content">
        <span v-if="productDetailTeam && productDetailTeam.company"
              class="title">{{productDetailTeam.company}}</span>
        <span v-else
              class="title">***</span>
        <div class="info">
          <span v-if="productDetailTeam && productDetailTeam.service && productDetailTeam.service.name">{{productDetailTeam.service.name}}</span>
          <span v-else>***</span>
          <span v-if="productDetailTeam && productDetailTeam.products_count">{{productDetailTeam.products_count}}件商品</span>
          <span v-else>0件商品</span>
        </div>
      </div>
    </section>
    <section class="product-tab-bar">
      <div class="btn-box"
           @click="share()">
        <i class="iconfont icon-fenxiang"></i>
        <span>分享</span>
      </div>
      <div class="btn-box">
        <i class="iconfont icon-shoucang1"></i>
        <span>收藏</span>
      </div>
      <div class="btn-box">
        <i class="iconfont icon-kefu"></i>
        <span>客服</span>
      </div>
      <div class="btn-box btn-shopping-car">
        <i class="iconfont icon-gouwuche"></i>
        <span>加入购物车</span>
      </div>
      <div class="btn-box btn-buy">
        <span>立即购买</span>
      </div>
    </section>
    <mt-actionsheet :actions="actions"
                    v-model="sheetVisible"
                    class="product-actionsheet">
    </mt-actionsheet>
    <section v-if="popUp"
             class="product-popup-dialog"
             v-bind:class="{'slide-in-fwd-center': cssAnimation, 'slide-out-bck-center': !cssAnimation}">
      <div class="main">
        <div class="title">
          <span>购销渠道关系认证成功</span>
        </div>
        <div class="content">
          <div class="item">
            <img src="http://7xjfsp.com2.z0.glb.qiniucdn.com/FrOXCe48WEH8rwHvPz3ugLpcaTMO-thumb">
            <div class="info">
              <p>宜州市万福石业有限公司</p>
              <div>
                <span>矿主</span>
                <span>广西&middot;河池</span>
              </div>
            </div>
          </div>
          <div class="item">
            <img src="http://7xjfsp.com2.z0.glb.qiniucdn.com/FrOXCe48WEH8rwHvPz3ugLpcaTMO-thumb">
            <div class="info">
              <p>宜州市万福石业有限公司</p>
              <div>
                <span>矿主</span>
                <span>广西&middot;河池</span>
              </div>
            </div>
          </div>
        </div>
        <div class="footer"
             @click="closePopup()">
          <span>取消</span>
        </div>
      </div>
    </section>
    <div v-if="showPreview">
      <span class="preview-page-nav">{{currentIndex}}/{{previewImgs.length}}</span>
      <div class="close"
           @click="closePreview()">
        <i class="fa fa-times"></i>
      </div>
      <swiper :options="swiperOptionFullScreen"
              class="full-screen-swiper">
        <!-- slides -->
        <swiper-slide class="swiper-zoom-container full-screen-bg"
                      v-for="(item, index) in previewImgs"
                      :key="index">
          <img :src="item.url"
               alt="">
        </swiper-slide>
      </swiper>
    </div>
  </section>
</template>

<script>
  import ProductHeader from '../../components/header/Head'
  import { mapGetters } from 'vuex'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import { getStore } from '../../config/mUtils'
  export default {
    data () {
      return {
        selected: '1',
        currentIndex: 1,
        teamId: getStore('productDetailParams') ? getStore('productDetailParams').teamId : this.$route.params.teamId,
        productId: getStore('productDetailParams') ? getStore('productDetailParams').productId : this.$route.params.productId,
        organizationId: getStore('productDetailParams') ? getStore('productDetailParams').organizationId : this.$route.params.organizationId,
        morePrice: false,
        cssAnimation: false,
        currentPrice: {},
        currentPriceProperties: [],
        popUp: false,
        showPreview: false,
        previewImgs: [],
        swiperOption: {
          pagination: '.swiper-pagination',
          paginationClickable: true
        },
        swiperOptionFullScreen: {
          notNextTick: false,
          autoplay: 0,
          direction: 'horizontal',
          grabCursor: true,
          setWrapperSize: true,
          autoHeight: false,
          paginationClickable: false,
          prevButton: null,
          nextButton: null,
          mousewheelControl: true,
          observeParents: true,
          preventClicks: false,
          passiveListeners: false,
          zoom: true,
          height: window.innerHeight,
          width: window.innerWidth,
          initialSlide: 0,
          onSlideChangeEnd: (swiper) => {
            this.currentIndex = swiper.activeIndex + 1
          }
        },
        actions: [
          {
            name: '发送给微信好友',
            method: ''
          }, {
            name: '分享到微信朋友圈',
            method: ''
          }, {
            name: '分享到QQ空间',
            method: ''
          }, {
            name: '分享到QQ',
            method: ''
          }, {
            name: '分享到新浪微博',
            method: ''
          }
        ],
        sheetVisible: false,
        imgList: [
          {
            id: 1,
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 2,
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 3,
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 4,
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }
        ]
      }
    },
    components: {
      ProductHeader,
      swiper,
      swiperSlide
    },
    methods: {
      getProductDetail () {
        this.$store.dispatch('commonAction', {
          url: `/products/${this.productId}`,
          method: 'get',
          params: {
            id: this.productId
          },
          target: this,
          resolve: (state, res) => {
            state.productDetail = res.data.products
            this.getFilesPublisheds(this.handleProductFiles(res.data.products.files), res.data.products.files)
          },
          reject: () => {
          }
        })
      },
      getAllPriceProperties (categoryId) {
        this.$store.dispatch('commonAction', {
          url: '/price_properties',
          method: 'get',
          params: {
            category_id: categoryId
          },
          target: this,
          resolve: (state, res) => {
            state.allPriceProperties = res.data.properties
            this.currentPrice = state.productDetail.prices[0]
            this.currentPriceProperties = this.handlePricePropertyes(this.currentPrice, res.data.properties)
            this.getProductArchives()
          },
          reject: () => {
          }
        })
      },
      // 手机QQ浏览器和UC浏览器不支持array.findIndex语法
      handlePricePropertyes (price, priceProperties) {
        let tmpArr = []
        for (let j = 0; j < price.properties.length; j++) {
          for (let i = 0; i < priceProperties.length; i++) {
            let key = Object.keys(price.properties[j])[0]
            if (priceProperties[j].aliaz === key) {
              tmpArr.push({key: priceProperties[i].name, value: price.properties[j][key]})
            }
          }
        }
        return tmpArr
      },
      handleProductFiles (arr) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          tmpArr.push(arr[i].file_id)
        }
        return tmpArr
      },
      getFilesPublisheds (ids, files) {
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
            state.productDetailFiles = res.data.files
            this.getAllPriceProperties(state.productDetail.category_id)
          },
          reject: () => {
          }
        })
      },
      getProductArchives () {
        this.$store.dispatch('commonAction', {
          url: `/products/${this.productId}/archives`,
          method: 'get',
          params: {},
          target: this,
          resolve: (state, res) => {
            state.archives = res.data.archives
            this.getOrganization()
          },
          reject: () => {
          }
        })
      },
      getOrganization () {
        this.$store.dispatch('commonAction', {
          url: '/links/teams',
          method: 'get',
          params: {
            ids: [this.organizationId]
          },
          target: this,
          resolve: (state, res) => {
            state.productDetailTeam = res.data.teams[0]
          },
          reject: () => {
          }
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
      viewFullScreenPic (arr) {
        this.showPreview = true
        this.previewImgs = arr
      },
      closePreview () {
        this.showPreview = false
      },
      handleChange (index) {
        this.currentIndex = index + 1
      },
      share () {
        this.sheetVisible = true
      },
      expandMorePrice () {
        if (this.morePrice) {
          this.cssAnimation = false
          setTimeout(() => {
            this.morePrice = !this.morePrice
          }, 400)
        } else {
          this.morePrice = !this.morePrice
          this.cssAnimation = true
        }
      },
      changePrice (item) {
        this.currentPrice = item
        this.expandMorePrice()
        this.currentPriceProperties = this.handlePricePropertyes(this.currentPrice, this.$store.state.allPriceProperties)
      },
      viewArchives (item) {
        console.log(item)
      },
      openPopup () {
        this.popUp = true
        this.cssAnimation = true
      },
      closePopup () {
        this.cssAnimation = false
        // this.allowTouchMove()
        setTimeout(() => {
          this.popUp = false
        }, 400)
      },
      stopTouchMove () {
        let self = this
        document.getElementById('app').addEventListener('touchmove', (e) => { // 监听滚动事件
          if (self.popUp) {
            e.preventDefault() // 最关键的一句，禁止浏览器默认行为
          }
        })
      }
      // allowTouchMove () {
      //   let self = this
      //   document.getElementById('app').removeEventListener('touchmove', (e) => { // 监听滚动事件
      //     if (self.popUp) {
      //       e.preventDefault()
      //     }
      //   })
      // }
    },
    mounted () {
      this.stopTouchMove()
      this.getProductDetail()
    },
    computed: {
      ...mapGetters([
        'productDetail',
        'productDetailFiles',
        'allPriceProperties',
        'archives',
        'teams',
        'productDetailTeam'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .swipe {
    @include px2rem(height, 634px);
    @include pm2rem(margin, 0px, 0px, 0px, 0px);
    position: relative;
    overflow: hidden;
    .swiper-container {
      height: 100%;
      width: 100%;
    }
    .swiper-slide {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    img {
      max-width: 100%;
      max-height: 100%;
      width: inherit;
    }
  }
  .page-nav {
    position: absolute;
    @include px2rem(bottom, 16px);
    @include px2rem(right, 16px);
    color: $white;
    @include font-dpr(16px);
    @include pm2rem(padding, 4px, 20px, 4px, 20px);
    background-color: rgba(0, 0, 0, .5);
    z-index: 1002;
  }
  .info-container {
    @include pm2rem(padding, 42px, 0px, 0px, 26px);
    background-color: $white;
    border-bottom: 1px solid #D1D1D1;
    .name {
      @include font-dpr(17px);
      @include pm2rem(margin, 0px, 0px, 30px, 0px);
    }
    .money {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      @include pm2rem(padding, 0px, 70px, 0px, 0px);
      .number {
        color: #FF0000;
        @include font-dpr(26px);
      }
      .unit {
        color: #343434;
        @include font-dpr(13px);
      }
      .more {
        color: #000;
        @include font-dpr(14px);
      }
      .icon-box {
        display: inline-block;
      }
      .more-icon {
        color: #52CAA7;
        @include font-dpr(15px);
      }
      .more-price {
        position: absolute;
        @include px2rem(right, 70px);
        @include px2rem(width, 180px);
        @include px2rem(top, 60px);
        text-align: center;
        color: #FF0000;
        background-color: $white;
        @include font-dpr(16px);
        border-top: 1px solid #D1D1D1;
        z-index: 1002;
        p {
          border: 1px solid #D1D1D1;
          border-top: none;
          box-sizing: border-box;
          @include pm2rem(padding, 8px, 10px, 8px, 10px);
        }
      }
    }
    .inventory {
      color: #595959;
      @include font-dpr(13px);
      @include pm2rem(padding, 0px, 0px, 22px, 0px);
    }
  }
  .nav-bar {
    @include px2rem(height, 100px);
    .mint-tab-item {
      @include font-dpr(17px);
      border-bottom: 1px solid #D1D1D1;
      div {
        @include font-dpr(17px);
      }
    }
    .is-selected {
      color: #52CAA7;
      margin-bottom: 0;
      @include px2rem(border-bottom-width, 10px);
      border-bottom-color: #52CAA7;
      text-decoration: none;
    }
    a:active, a:hover {
      text-decoration: none;
    }
    .row-item {
      display: block;
    }
  }
  .nav-bar-container {
    border-bottom: 1px solid #DEDEDE;
  }
  .company-info {
    @include pm2rem(margin, 22px, 0px, 0px, 0px);
    @include pm2rem(padding, 24px, 24px, 124px, 24px);
    border-top: 1px solid #D1D1D1;
    background-color: $white;
    display: -webkit-box;
    line-height: 1;
    .company-img {
      @include pm2rem(padding, 2px, 24px, 0px, 0px);
      img {
        @include px2rem(width, 82px);
        @include px2rem(height, 82px);
      }
    }
    .company-content {
      height: auto;
      line-height: 1;
      .title {
        @include font-dpr(16px);
        color: #000;
      }
      .info {
        @include pm2rem(margin, 28px, 0px, 0px, 0px);
        span {
          @include font-dpr(14px);
          color: #535252;
          @include px2rem(margin-right, 50px);
        }
      }
    }
  }

  .product-tab-bar {
    @include px2rem(height, 97px);
    display: -webkit-box;
    background-color: $white;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    .btn-box {
      border-top: 1px solid #D1D1D1;
      border-bottom: 1px solid #D1D1D1;
      width: 17.6%;
      border-right: 1px solid #D1D1D1;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      i {
        @include font-dpr(17px);
      }
      span {
        @include font-dpr(12px);
        color: #595959;
      }
    }
    .btn-shopping-car {
      width: 23.6%;
      i {
        @include font-dpr(18px);
      }
    }
    .btn-buy {
      width: 23.6%;
      background: linear-gradient(to bottom right, #ff7f46 , #ff5001);
      border: none;
      span {
        @include font-dpr(14px);
        color: $white;
        @include px2rem(line-height, 97px);
      }
    }
  }

  .productdetail-product-tags {
    display: flex;
    flex-wrap: wrap;
    @include pm2rem(padding, 20px, 0px, 0px, 20px);
    background-color: $white;
    .tag {
      @include px2rem(border-radius, 7px);
      border: 1px solid #ACACAC;
      @include pm2rem(padding, 10px, 20px, 10px, 20px);
      @include pm2rem(margin, 0px, 20px, 20px, 0px);
      line-height: 1;
      @include font-dpr(14px);
      color: #595959;
    }
    .no-info {
      @include pm2rem(padding, 20px, 0px, 40px, 0px);
      @include pm2rem(margin, 0px, 0px, 0px, -20px);
      text-align: center;
      width: 100%;
      line-height: 1;
      @include font-dpr(20px);
      color: #A6A6A6;
    }
  }

  .preview-page-nav {
    position: absolute;
    @include px2rem(top, 38px);
    @include px2rem(left, 130px);
    color: white;
    z-index: 1003;
    @include font-dpr(20px);
  }
  .close {
    position: absolute;
    @include px2rem(top, 38px);
    @include px2rem(left, 52px);
    color: white;
    z-index: 1003;
    @include font-dpr(30px);
    line-height: 1;
  }
  .full-screen-swiper {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1002;
  }
  .full-screen-bg {
    background-color: #000;
  }

  .product-popup-dialog {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    z-index: 1001;
    top: 0;
    .main {
      position: absolute;
      @include px2rem(width, 562px);
      @include px2rem(top, 200px);
      position: absolute;
	    left: 50%;
      -webkit-transform: translateX(-50%);
            transform: translateX(-50%);
    }
    .title {
      background-color: #52CAA7;
      color: $white;
      @include font-dpr(16px);
      @include px2rem(height, 80px);
      text-align: center;
      @include px2rem(line-height, 80px);
    }
    .content {
      background-color: $white;
      @include px2rem(min-height, 500px);
      border-bottom: 1px solid #D1D1D1;
      .item {
        border-bottom: 1px solid #D1D1D1;
        @include px2rem(height, 108px);
        display: flex;
        align-items: center;
        box-sizing: border-box;
        @include pm2rem(padding, 20px, 12px, 20px, 12px);
        img {
          @include px2rem(width, 70px);
          @include px2rem(height, 70px);
          @include px2rem(margin-right, 22px);
        }
        .info {
          div {
            line-height: 1;
          }
          p {
            @include font-dpr(13px);
            line-height: 1;
            color: #595959;
            @include px2rem(margin-bottom, 20px);
          }
          span {
            @include font-dpr(12px);
            @include px2rem(margin-right, 50px);
            color: #A6A6A6;
          }
        }
      }
    }
    .footer {
      @include px2rem(height, 80px);
      background-color: $white;
      @include px2rem(line-height, 80px);
      text-align: center;
      @include font-dpr(16px);
      color: #595959;
    }
  }

  .slide-in-fwd-center {
    -webkit-animation: slide-in-fwd-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
            animation: slide-in-fwd-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  }

  .slide-out-bck-center {
    -webkit-animation: slide-out-bck-center 0.4s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
            animation: slide-out-bck-center 0.4s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
  }

  @-webkit-keyframes slide-in-fwd-center {
    0% {
      -webkit-transform: translateZ(-1400px);
              transform: translateZ(-1400px);
      opacity: 0;
    }
    100% {
      -webkit-transform: translateZ(0);
              transform: translateZ(0);
      opacity: 1;
    }
  }
  @keyframes slide-in-fwd-center {
    0% {
      -webkit-transform: translateZ(-1400px);
              transform: translateZ(-1400px);
      opacity: 0;
    }
    100% {
      -webkit-transform: translateZ(0);
              transform: translateZ(0);
      opacity: 1;
    }
  }

  @-webkit-keyframes slide-out-bck-center {
    0% {
      -webkit-transform: translateZ(0);
              transform: translateZ(0);
      opacity: 1;
    }
    100% {
      -webkit-transform: translateZ(-1100px);
              transform: translateZ(-1100px);
      opacity: 0;
    }
  }
  @keyframes slide-out-bck-center {
    0% {
      -webkit-transform: translateZ(0);
              transform: translateZ(0);
      opacity: 1;
    }
    100% {
      -webkit-transform: translateZ(-1100px);
              transform: translateZ(-1100px);
      opacity: 0;
    }
  }

  .more-price-show {animation:fadeInDown 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both}

  .more-price-hide {animation:fadeOutUp 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both}

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translate3d(0, -100%, 0);
    }

    to {
      opacity: 1;
      transform: none;
    }
  }

  @keyframes fadeOutUp {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
      transform: translate3d(0, -100%, 0);
    }
  }

  .rotate-90-cw {
    -webkit-animation: rotate-90-cw 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
            animation: rotate-90-cw 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  }

  .rotate-90-ccw {
    -webkit-animation: rotate-90-ccw 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
            animation: rotate-90-ccw 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  }

  @-webkit-keyframes rotate-90-cw {
    0% {
      -webkit-transform: rotate(0);
              transform: rotate(0);
    }
    100% {
      -webkit-transform: rotate(90deg);
              transform: rotate(90deg);
    }
  }
  @keyframes rotate-90-cw {
    0% {
      -webkit-transform: rotate(0);
              transform: rotate(0);
    }
    100% {
      -webkit-transform: rotate(90deg);
              transform: rotate(90deg);
    }
  }

  @-webkit-keyframes rotate-90-ccw {
    0% {
      -webkit-transform: rotate(0);
              transform: rotate(0);
    }
    100% {
      -webkit-transform: rotate(-90deg);
              transform: rotate(-90deg);
    }
  }
  @keyframes rotate-90-ccw {
    0% {
      -webkit-transform: rotate(0);
              transform: rotate(0);
    }
    100% {
      -webkit-transform: rotate(-90deg);
              transform: rotate(-90deg);
    }
  }

</style>

<style lang="scss">
  @import '../../styles/mixin';
  /*覆盖mint-ui中nav-bar组件默认样式，故不用scoped*/

  .swipe {
    .swiper-pagination-bullet-active {
      background-color: $white;
    }
  }

  .nav-bar {
    .mint-tab-item-label {
      @include font-dpr(15px);
    }
  }
  .prodcutdetail-price-item {
    @include pm2rem(padding, 36px, 0px, 0px, 38px);
    background-color: $white;
    .row-item {
      display: block;
      @include pm2rem(margin, 0px, 0px, 36px, 0px);
      @include font-dpr(14px);
      color: #595959;
    }
    .no-price {
      @include pm2rem(padding, 4px, 0px, 40px, 0px);
      @include pm2rem(margin, 0px, 0px, 0px, -38px);
      @include font-dpr(20px);
      color: #A6A6A6;
      text-align: center;
      line-height: 1;
      width: 100%;
    }
  }
  .productdetail-product-item {
    @include pm2rem(padding, 0px, 30px, 0px, 0px);
    background-color: $white;
    line-height: 1;
    .row-item {
      @include pm2rem(padding, 0px, 0px, 0px, 32px);
      line-height: 1;
      .content {
        @include font-dpr(13px);
        @include line-height(31px);
        @include pm2rem(padding, 15px, 54px, 8px, 24px);
        border-bottom: 1px solid #DEDEDE;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        display: -webkit-box;
        @include px2rem(height, 132px);
        i {
          color: #F4B223;
          position: absolute;
          @include px2rem(right, 140px);
          @include font-dpr(21px);
        }
      }
      .line2 {
        -webkit-line-clamp: 2;
      }
      .link {
        @include px2rem(height, 66px);
      }
      .last {
        border-bottom: none;
      }
    }
    .title-container {
      // @include pm2rem(padding, 20px, 0px, 20px, 0px);
      .dot {
        @include px2rem(width, 16px);
        @include px2rem(height, 16px);
        @include px2rem(border-radius, 8px);
        @include px2rem(margin-right, 6px);
        background-color: #ACACAC;
        display: inline-block;
      }
      .title {
        @include font-dpr(15px);
        @include line-height(30px);
        // line-height: 1;
      }
    }
    .no-product-args {
      @include pm2rem(padding, 40px, 0px, 40px, 0px);
      @include pm2rem(margin, 0px, 0px, 0px, 0px);
      text-align: center;
      width: 100%;
      line-height: 1;
      @include font-dpr(20px);
      color: #A6A6A6;
    }
  }
  .product-actionsheet {
    background-color: transparent;
    @include px2rem(margin-bottom, 12px);
    .mint-actionsheet-list {
      @include pm2rem(margin, 0px, 41px, 0px, 41px);
      @include px2rem(border-radius, 10px);
      & li:first-child {
        @include px2rem(border-top-left-radius, 10px);
        @include px2rem(border-top-right-radius, 10px);
      }
      & li:last-child {
        @include px2rem(border-bottom-left-radius, 10px);
        @include px2rem(border-bottom-right-radius, 10px);
      }
    }
    .mint-actionsheet-button {
      @include pm2rem(margin, 28px, 41px, 0px, 41px);
      @include px2rem(border-radius, 10px);
      width: auto;
      color:#004BBD;
    }
    .mint-actionsheet-listitem {
      color: #004BBD;
      @include font-dpr(16px);
      @include px2rem(height, 98px);
      @include px2rem(line-height, 98px);
    }
  }
</style>
