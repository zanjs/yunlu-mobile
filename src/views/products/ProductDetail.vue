<template>
  <section>
    <template v-if="!hideDownloadBar">
      <download-bar
        @close="closeDownloadBar()"
        @download="goDownload()">
      </download-bar>
    </template>
    <product-header
      :show-download="!hideDownloadBar"
      @back="goBack()"
      @open-favorites="openFavorites()"
      @report="goReport()"
      @search-near-by="searchNearBy()"
      @home="goHome()"
      v-bind:class="{'header': !hideDownloadBar}">
    </product-header>
    <div
      class="swipe"
      v-bind:class="{'header': !hideDownloadBar}">
      <template v-if="productDetailFiles && productDetailFiles.length">
        <swiper :options="swiperOption">
          <swiper-slide
            v-for="(item, index) in productDetailFiles"
            :key="index">
            <div
              v-lazy:background-image="{
                src: item.url,
                error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
                loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
              }"
              class="swipe-img"
              @click="viewFullScreenPic(productDetailFiles)">
            </div>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </template>
      <img
        v-else
        src="../../assets/imgLoadingError.png">
      <span
        v-if="productDetailFiles && productDetailFiles.length"
        class="page-nav white font-16">{{currentIndex}}/{{productDetailFiles.length}}</span>
      <span
        v-else
        class="page-nav white font-16">0/0</span>
    </div>
    <section class="info-container white-bg">
      <div
        v-if="productDetail && productDetail.name"
        class="name font-17">{{productDetail.name}}</div>
      <div
        v-else
        class="name font-17">*****</div>
      <div class="flex-between money">
        <div>
          <span
            v-if="productDetail && productDetail.prices && productDetail.prices.length > 0"
            class="number font-26">{{currentPrice.money}}</span>
          <span
            v-else
            class="number font-26">0.00</span>
          <span
            v-if="productDetail && productDetail.prices && productDetail.prices.length > 0 && productDetail.prices[0].money !== '定制'"
            class="unit font-13">元</span>
        </div>
        <div @click="expandMorePrice()">
          <span class="more font-14">更多价格</span>
          <div
            class="icon-box"
            v-bind:class="{'up active': morePrice, 'inactive': !morePrice}">
            <i class="iconfont icon-gengduo primary font-15"></i>
          </div>
        </div>
        <div class="more-price white-bg font-16" :class="{'menu-active': morePrice}">
          <div class="menu-list">
            <ul>
              <li
                v-for="(item, index) in productDetail.prices"
                :key="index"
                @click="changePrice(item)">
                <a class="item">
                  {{item.money}}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div
        v-if="productDetail && productDetail.prices && productDetail.prices.length > 0"
        class="inventory font-13 second-text">
        库存 ：{{productDetail.prices[0].amount}}
      </div>
      <div
        v-else
        class="inventory font-13 second-text">
        库存 ：0
      </div>
    </section>
    <section>
      <mt-navbar
        v-model="selected"
        class="nav-bar">
        <mt-tab-item id="1">价格参数</mt-tab-item>
        <mt-tab-item id="2">产品参数</mt-tab-item>
        <mt-tab-item id="3">关联信息</mt-tab-item>
      </mt-navbar>
      <mt-tab-container
        v-model="selected"
        class="nav-bar-container">
        <mt-tab-container-item
          id="1"
          class="prodcutdetail-price-item">
          <template v-if="currentPriceProperties && currentPriceProperties.length > 0">
            <span
              v-for="(item, index) in currentPriceProperties"
              :key="index"
              class="row-item">{{item.key}} : {{item.value}}</span>
          </template>
          <div
            v-else
            class="no-price">该产品暂无价格参数</div>
        </mt-tab-container-item>
        <mt-tab-container-item
          id="2"
          class="productdetail-product-item">
          <template v-if="productDetail && productDetail.goods_type === 'Medicament'">
            <div class="row-item">
              <div class="title-container">
                <i class="iconfont icon-circle dot"></i>
                <span class="title">功能主治 : {{productDetail.indication}}</span>
              </div>
            </div>
          </template>
          <template
            v-if="productDetail && productDetail.goods_type === 'StoneMaterial'">
            <div class="row-item">
              <!--<div class="title-container">
                <i class="iconfont icon-circle dot"></i>
                <span class="title">{{productDetail.category_name}}</span>
              </div>-->
              <div class="title-container">
                <i class="iconfont icon-circle dot"></i>
                <span class="title">{{productDetail.taxonomy.name}} /{{productDetail.taxonomy.colour_desc[1]}} /{{productDetail.taxonomy.depth_desc[1]}} /{{productDetail.taxonomy.pattern_desc[1]}}</span>
              </div>
              <div
                v-if="productDetail.surface && productDetail.surface.name &&  productDetail.surface.product_class && productDetail.surface.product_class.name"
                class="title-container">
                <i class="iconfont icon-circle dot"></i>
                <div class="title">{{productDetail.surface.product_class.name}} /{{productDetail.surface.name}}</div>
              </div>
            </div>
          </template>
          <template
            v-if="productDetail.properties && productDetail.properties.length > 0">
            <div
              v-for="(item, index) in productDetail.properties"
              :key="index"
              class="row-item">
              <div
                v-for="(i, indexI) in item.children"
                :key="indexI"
                class="row-container">
                <div
                  v-if="handleChildProperties(i)"
                  class="sub-row-title">
                  <i class="iconfont icon-circle dot"></i>
                  <div class="title">{{i.name}} : {{i.value}}</div>
                  <i
                    v-for="(j, indexJ) in i.quotes"
                    :key="indexJ"
                    class="iconfont icon-guanlian"
                    @click="openPopDialog(j)">
                  </i>
                </div>
                <div
                  v-for="(m, indexM) in i.children"
                  :key="indexM"
                  class="sub-item">
                  <div
                    v-if="handleChildProperties(m)"
                    class="title">{{m.name}} : {{m.value}}</div>
                    <div
                      v-for="(n, indexN) in m.children"
                      :key="indexN"
                      class="third-row-container">
                      <div class="third-item">
                        <div
                          v-if="n.name && n.value"
                          class="title">{{n.name}} : {{n.value}}</div>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </template>
          <template v-if="!hasProperties">
            <div class="no-product-args">
              该产品暂无产品参数
            </div>
          </template>
        </mt-tab-container-item>
        <mt-tab-container-item
          id="3"
          class="productdetail-product-tags white-bg">
          <template v-if="archives && archives.length > 0">
            <div
              v-for="(item, index) in archives"
              :key="index"
              @click="viewArchives(item)"
              class="tag second-text font-14">{{item.name}}</div>
          </template>
          <div
            v-else
            class="no-info font-20">该产品暂无关联信息</div>
        </mt-tab-container-item>
      </mt-tab-container>
    </section>
    <section
      class="company-info white-bg"
      @click="goEnterprise()">
      <div class="wraper">
        <div class="company-img">
          <img
            v-if="productDetailTeam && productDetailTeam.logo"
            :src="productDetailTeam.logo">
          <img
            v-else
            src="../../assets/blank.jpg">
        </div>
         <div class="content-wraper ellipsis">
          <div class="company-content">
            <div
              v-if="productDetailTeam && productDetailTeam.company"
              class="title ellipsis font-16">
              {{productDetailTeam.company}}
            </div>
            <span
              v-else
              class="title ellipsis font-16">***</span>
            <div class="info font-14">
              <span v-if="productDetailTeam && productDetailTeam.service && productDetailTeam.service.name">{{productDetailTeam.service.name}}</span>
              <span v-else>***</span>
              <span v-if="productDetailTeam && productDetailTeam.products_count">{{productDetailTeam.products_count}}件商品</span>
              <span v-else>0件商品</span>
            </div>
          </div>
         </div>
      </div>
    </section>
    <section class="product-tab-bar white-bg full-width">
      <div
        class="btn-box"
        @click="openIm()">
        <i class="iconfont icon-kefu font-17 kefu"></i>
        <span class="font-12 kefu">客服</span>
      </div>
      <div
        class="btn-box second-text"
        @click="addFavorites()">
        <i
          class="iconfont icon-shoucang1 font-17"
          v-bind:class="{'bottom-btn-active': hasAddFavorites}"></i>
        <span
          class="font-12"
          v-bind:class="{'bottom-btn-active': hasAddFavorites}">{{favoratesText}}</span>
      </div>
      <div
        class="btn-box second-text"
        @click="openShoppingCar()">
        <i class="iconfont icon-gouwuche1 font-17"></i>
        <span class="font-12">购物车</span>
        <div
          v-show="purchaseItemsCount !== '0'"
          class="badge"
          :class="{'active': hasAddShoppingCar}">
          <span>{{purchaseItemsCount}}</span>
        </div>
      </div>
      <div
        class="btn-box btn-shopping-car"
        @click="addShoppingCar()">
        <span class="font-14 white">{{shoppingCarText}}</span>
      </div>
      <div
        class="btn-box btn-buy"
        @click="buyNow()">
        <span class="font-14 white">立即购买</span>
      </div>
    </section>
    <section
      v-if="popUp"
      class="product-popup-dialog"
      v-bind:class="{'slide-in-fwd-center': cssAnimation, 'slide-out-bck-center': !cssAnimation}">
      <div class="main absolute-horizontal">
        <div class="title primary-bg white font-16">
          <span>购销渠道关系认证成功</span>
        </div>
        <div class="content white-bg">
          <div
            class="item"
            @click="goLinkEnterpriseDetail(teamLink)">
            <img
              v-if="teamLink && teamLink.logo"
              :src="teamLink.logo">
            <img
              v-else
              src="../../assets/blank.jpg">
            <div class="info">
              <p class="font-13 second-text">{{teamLink.company}}</p>
              <div>
                <span class="font-12 third-text">{{teamLink.service.name}}</span>
                <span class="font-12 third-text">{{teamLink.provice_name}}&middot;{{teamLink.city_name}}</span>
              </div>
            </div>
          </div>
          <div
            class="item"
            @click="goLinkProductDetail(productLink)">
            <img
              v-if="productLinkFile && productLinkFile.url"
              :src="productLinkFile.url">
            <img
              v-else
              src="../../assets/imgLoadingError.png">
            <div class="info">
              <p>{{productLink.name}}</p>
              <div>
                <span
                  v-if="productLink.prices && productLink.prices.length > 0 && productLink.prices[0].money !== '定制'"
                  class="product-price">{{productLink.prices[0].money}}元</span>
                <span
                  v-else
                  class="product-price">{{productLink.prices[0].money}}</span>
              </div>
            </div>
          </div>
        </div>
        <div
          class="footer white-bg font-16 second-text"
          @click="closePopup()">
          <span>取消</span>
        </div>
      </div>
    </section>
    <div v-if="showPreview">
      <div class="option-bar full-width">
        <div
          class="close"
          @click="closePreview()">
          <i class="iconfont icon-fanhui"></i>
        </div>
        <span class="preview-page-nav white flex font-20">{{currentIndex}}/{{previewImgs.length}}</span>
      </div>
      <swiper
        :options="swiperOptionFullScreen"
        class="full-screen-swiper">
        <!-- slides -->
        <swiper-slide
          class="swiper-zoom-container full-screen-bg"
          v-for="(item, index) in previewImgs"
          :key="index">
          <img
            v-lazy="{
              src: item.url,
              error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
              loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
            }"
            alt="">
        </swiper-slide>
      </swiper>
    </div>
  </section>
</template>

<script>
  import ProductHeader from '../../components/header/Head'
  import DownloadBar from '../../components/common/DownloadBar'
  import { mapGetters } from 'vuex'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import { getStore, setStore, removeStore, mobileClient } from '../../config/mUtils'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        selected: '1',
        currentIndex: 1,
        token: getStore('user') ? getStore('user').authentication_token : '',
        currentTeamId: '',
        productId: this.$route.params.id,
        hasLogin: !!getStore('user'),
        hasProperties: true,
        hasAddFavorites: false,
        hasAddShoppingCar: false,
        purchaseItemsCount: '0', // 超过99显示99+
        shoppingCarText: '加入购物车',
        favoratesText: '收藏',
        productLink: {},
        productLinkFile: {},
        teamLink: {},
        morePrice: false,
        cssAnimation: false,
        currentPrice: {},
        currentPriceProperties: [],
        popUp: false,
        showPreview: false,
        previewImgs: [],
        tempArchivesFiles: [],
        swiperOption: {
          pagination: '.swiper-pagination',
          paginationClickable: true,
          onSlideChangeEnd: (swiper) => {
            this.currentIndex = swiper.activeIndex + 1
          }
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
        hideDownloadBar: getStore('hideDownloadBar')
      }
    },
    components: {
      ProductHeader,
      DownloadBar,
      swiper,
      swiperSlide
    },
    methods: {
      closeDownloadBar () {
        this.hideDownloadBar = true
        setStore('hideDownloadBar', 'true')
      },
      goDownload () {
        this.$router.push({name: 'Download'})
      },
      getProductDetail (productId = this.productId) {
        this.$store.dispatch('commonAction', {
          url: `/products/${productId}`,
          method: 'get',
          params: {
            id: productId,
            token: this.token
          },
          target: this,
          resolve: (state, res) => {
            if (productId === this.productId) {
              this.hasAddFavorites = res.data.products.favorable
              this.favoratesText = res.data.products.favorable ? '已收藏' : '收藏'
              state.productDetail = res.data.products
              this.currentTeamId = res.data.products.organization_id
              this.hasProperties = this.handleProperties(res.data.products)
              this.visits(res.data.products.organization_id)
              this.getFilesPublisheds(this.handleProductFiles(res.data.products.files), res.data.products.files, productId, res.data.products.organization_id)
            } else {
              this.productLink = res.data.products
              this.getFilesPublisheds([this.handleProductFiles(res.data.products.files)[0]], res.data.products.files, productId, res.data.products.organization_id)
            }
          },
          reject: () => {
          }
        })
      },
      handleProperties (productDetail) {
        // 当产品类型为StoneMaterial或Medicament时，一定有附加的产品属性，判断时，排除这两种情况。
        if (productDetail.goods_type !== 'StoneMaterial' && productDetail.goods_type !== 'Medicament') {
          let index = 0
          for (let i = 0; i < productDetail.properties.length; i++) {
            if (productDetail.properties[i].children.length === 0) {
              index += 1
            }
          }
          return index !== productDetail.properties.length
        } else {
          return true
        }
      },
      // 参数为一级或二级属性(如果属性的子属性有值，则需要显示完整上级属性名)
      handleChildProperties (prop) {
        let flag = false
        if (prop.name && prop.value) {
          return true
        }
        if (prop.children.length === 0) {
          return false
        }
        for (let i = 0; i < prop.children.length; i++) {
          if (prop.children[i].name && prop.children[i].value) {
            flag = true
            break
          }
          if (prop.children[i].children && prop.children[i].children.length > 0) {
            for (let j = 0; j < prop.children[i].children.length; j++) {
              if (prop.children[i].children[j].name && prop.children[i].children[j].value) {
                flag = true
                break
              }
            }
          }
        }
        return flag
      },
      getAllPriceProperties (categoryId, productId, teamId) {
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
            this.getProductArchives(productId, teamId)
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
            if (priceProperties[i].aliaz === key) {
              if (priceProperties[i].options.length > 0) {
                for (let m = 0; m < priceProperties[i].options.length; m++) {
                  if (priceProperties[i].options[m].id === price.properties[j][key]) {
                    tmpArr.push({key: priceProperties[i].name, value: priceProperties[i].options[m].name})
                  }
                }
              } else {
                tmpArr.push({key: priceProperties[i].name, value: price.properties[j][key]})
              }
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
      getFilesPublisheds (ids, files, productId, teamId) {
        this.$store.dispatch('commonAction', {
          url: '/links/files/publisheds',
          method: 'get',
          params: {
            type: 'product',
            team_id: teamId,
            thumbs: ['general'],
            ids: ids
          },
          target: this,
          resolve: (state, res) => {
            if (productId === this.productId) {
              state.productDetailFiles = res.data.files
              this.getAllPriceProperties(state.productDetail.category_id, productId, teamId)
            } else {
              // 关联产品图片只需获取封面(传的ids参数也是只有一个元素的数组)
              this.productLinkFile = res.data.files[0]
              this.getOrganization(productId, teamId)
            }
          },
          reject: () => {
          }
        })
      },
      getProductArchives (productId, teamId) {
        this.$store.dispatch('commonAction', {
          url: `/products/${productId}/archives`,
          method: 'get',
          params: {},
          target: this,
          resolve: (state, res) => {
            state.archives = res.data.archives
            this.getOrganization(productId, teamId)
          },
          reject: () => {
          }
        })
      },
      getArchivesFiles (ids) {
        this.$store.dispatch('commonAction', {
          url: '/links/files/publisheds',
          method: 'get',
          params: {
            type: 'document',
            team_id: this.currentTeamId,
            thumbs: ['general'],
            ids: ids
          },
          target: this,
          resolve: (state, res) => {
            this.tempArchivesFiles = res.data.files
            this.currentIndex = 1
            this.viewFullScreenPic(res.data.files)
          },
          reject: () => {
          }
        })
      },
      getOrganization (productId = this.productId, teamId = '') {
        this.$store.dispatch('commonAction', {
          url: '/links/teams',
          method: 'get',
          params: {
            ids: [teamId]
          },
          target: this,
          resolve: (state, res) => {
            if (productId === this.productId) {
              state.productDetailTeam = res.data.teams[0]
            } else {
              this.teamLink = res.data.teams[0]
              this.openPopup()
            }
            this.getPurchaseItems()
          },
          reject: () => {
          }
        })
      },
      // 获取购物车中的产品数量
      getPurchaseItems () {
        if (this.hasLogin) {
          this.$store.dispatch('commonAction', {
            url: '/purchase_items',
            method: 'get',
            params: {
              token: this.token
            },
            target: this,
            resolve: (state, res) => {
              if (res.data.purchase_items.length > 0) {
                let purchaseItems = this.handlePurchaseItems(res.data.purchase_items)
                this.purchaseItemsCount = this.handlePurchaseItemsCount(purchaseItems)
              }
            },
            reject: () => {
            }
          })
        }
      },
      handlePurchaseItemsCount (arr) {
        let count = 0
        for (let i = 0; i < arr.length; i++) {
          count += arr[i].quantity
        }
        if (count > 99) {
          return '99+'
        } else {
          return count + ''
        }
      },
      handlePurchaseItems (arr) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].price) {
            tmpArr.push(arr[i])
          }
        }
        return tmpArr
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
        this.currentIndex = 1
      },
      handleChange (index) {
        this.currentIndex = index + 1
      },
      expandMorePrice () {
        this.morePrice = !this.morePrice
      },
      changePrice (item) {
        this.currentPrice = item
        this.expandMorePrice()
        this.currentPriceProperties = this.handlePricePropertyes(this.currentPrice, this.$store.state.allPriceProperties)
      },
      viewArchives (item) {
        this.getArchivesFiles(this.handleProductFiles(item.files))
      },
      openPopDialog (item) {
        // console.log(item.origin.id, item.origin_type, item.origin.organization_id)
        if (item.origin_type === 'Product') {
          this.getProductDetail(item.origin.id)
          // TODO: 企业类型字段不确定
        } else if (item.origin_type === 'Enterprise') {
          // ...
        }
      },
      openPopup () {
        this.popUp = true
        this.cssAnimation = true
      },
      closePopup () {
        this.cssAnimation = false
        this.allowTouchMove()
        setTimeout(() => {
          this.popUp = false
        }, 400)
      },
      goBack () {
        if (getStore('ProductDetail_goHome')) {
          removeStore('ProductDetail_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      goReport () {
        this.$router.push({name: 'Report', query: {resourceId: this.productId, resourceClass: 'product'}})
      },
      goHome () {
        this.$router.push({name: 'See'})
      },
      goLogin () {
        setStore('beforeLogin', 'true')
        this.$router.push({name: 'Login'})
      },
      addFavorites () {
        if (this.hasLogin && !this.hasAddFavorites) {
          this.favoritesRequest()
        } else if (this.hasLogin && this.hasAddFavorites) {
          this.removeFavorites()
        } else {
          this.goLogin()
        }
      },
      favoritesRequest () {
        this.$store.dispatch('commonAction', {
          url: '/favorites',
          method: 'post',
          params: {},
          data: {
            token: this.token,
            product_id: this.productId
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.favorites && res.data.favorites.id === parseInt(this.productId)) {
              this.hasAddFavorites = true
              this.favoratesText = '已收藏'
              Toast({
                message: '你已成功收藏该产品',
                className: 'toast-content',
                iconClass: 'iconfont icon-caozuochenggong toast-icon-big',
                duration: 1000
              })
            } else {
              Toast({
                message: '收藏该产品失败',
                duration: 1000
              })
            }
          },
          reject: () => {
          }
        })
      },
      removeFavorites () {
        this.$store.dispatch('commonAction', {
          url: `/favorites/${this.productId}`,
          method: 'delete',
          params: {},
          data: {
            token: this.token,
            type: 'Product'
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.favorable_type && res.data.favorable_type === 'Product') {
              this.getProductDetail()
              this.hasAddFavorites = false
              this.favoratesText = '收藏'
              Toast({
                message: '你已成功取消收藏',
                className: 'toast-content',
                iconClass: 'iconfont icon-caozuochenggong toast-icon-big',
                duration: 1000
              })
            } else {
              Toast({
                message: '取消收藏该产品失败',
                duration: 1000
              })
            }
          },
          reject: () => {
          }
        })
      },
      openIm () {
        if (!this.hasLogin) {
          this.goLogin()
        } else {
          this.$router.push({name: 'Chat', query: {type: 'Product', teamId: this.currentTeamId, productId: this.productId, productImg: this.$store.state.productDetailFiles[0].url, productPrice: this.currentPrice.money, productName: this.$store.state.productDetail.name}})
        }
      },
      openShoppingCar () {
        this.$router.push({name: this.hasLogin ? 'ShoppingCart' : 'Login'})
      },
      addShoppingCar () {
        if (this.hasLogin) {
          this.addShoppingCarRequest()
        } else {
          this.goLogin()
        }
      },
      addShoppingCarRequest () {
        this.$store.dispatch('commonAction', {
          url: '/purchase_items',
          method: 'post',
          params: {},
          data: {
            token: this.token,
            price_id: this.currentPrice.id,
            quantity: 1
          },
          target: this,
          resolve: (state, res) => {
            // 该机构新增了一条访客记录
            if (res.data.purchase_items && res.data.purchase_items.price && res.data.purchase_items.price.id === this.currentPrice.id) {
              this.getPurchaseItems()
              // 加入购物车可以加入多次
              this.hasAddShoppingCar = true
              let toast = Toast({
                message: '加入购物车成功',
                className: 'toast-content',
                iconClass: 'iconfont icon-caozuochenggong toast-icon-big',
                duration: 1000
              })
              setTimeout(() => {
                clearTimeout(toast)
                this.hasAddShoppingCar = false // 1000ms后重置加入购物车状态，使动画可以重复播放
              }, 1000)
            } else {
              Toast({
                message: res.data.detail || '加入购物车失败',
                duration: 1000
              })
            }
          },
          reject: () => {
          }
        })
      },
      buyNow () {
        if (this.hasLogin) {
          Toast({
            message: '暂未开放',
            duration: 500
          })
        } else {
          setStore('beforeLogin', 'true')
          this.$router.push({name: 'Login'})
        }
      },
      openFavorites () {
        this.$router.push({name: this.hasLogin ? 'Favorites' : 'Login'})
      },
      searchNearBy () {
        Toast({
          message: '暂未开放',
          duration: 500
        })
      },
      goReprot () {
        this.$router.push({name: 'Report', query: {resourceId: this.currentTeamId, resourceClass: 'product'}})
      },
      stopTouchMove () {
        let self = this
        document.getElementById('app').addEventListener('touchmove', (e) => { // 监听滚动事件
          if (self.showPreview || self.popUp) {
            e.preventDefault()
          }
        })
      },
      allowTouchMove () {
        let self = this
        document.getElementById('app').removeEventListener('touchmove', (e) => { // 监听滚动事件
          if (self.showPreview || self.popUp) {
            e.preventDefault()
          }
        })
      },
      visits (teamId) {
        this.$store.dispatch('commonAction', {
          url: '/visits',
          method: 'post',
          params: {},
          data: {
            id: teamId,
            type: 'organization',
            ...(this.token ? {token: this.token} : {})
          },
          target: this,
          resolve: (state, res) => {
            // 该机构新增了一条访客记录
          },
          reject: () => {
          }
        })
      },
      goLinkEnterpriseDetail (item) {
        this.closePopup()
        this.$router.push({name: 'EnterpriseCarte', params: {id: item.id}})
      },
      goLinkProductDetail (item) {
        this.closePopup()
        this.$router.push({name: 'ProductDetail', params: {id: item.id}})
        window.location.reload()
      },
      goEnterprise () {
        this.$router.push({name: 'EnterpriseCarte', params: {id: this.currentTeamId}})
      },
      shouldLogin () {
        if (mobileClient() === 'weixin' && (!getStore('user') || !getStore('user').authentication_token)) {
          this.goLogin()
        } else {
          this.stopTouchMove()
          this.getProductDetail(this.productId)
        }
      }
    },
    mounted () {
      this.shouldLogin()
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
    .swipe-img {
      height: inherit;
      width: inherit;
      z-index: 1;
      background-position: center center!important;
      background-repeat: no-repeat;
      background-size: cover;
    }
    .swipe-img[lazy=loading] {
      z-index: 1;
      background-position: center center!important;
      background: url("../../assets/imgLoading3.jpg");
      background-repeat: no-repeat;
      background-size: contain;
    }
    .swipe-img[lazy=error] {
      z-index: 1;
      background-position: center center!important;
      background: url("../../assets/imgLoadingError.png");
      background-repeat: no-repeat;
      background-size: contain;
    }
    .swipe-img[lazy=loaded] {
      height: inherit;
      width: inherit;
      z-index: 1;
      background-position: center center!important;
      background-repeat: no-repeat;
      background-size: cover;
    }
    img {
      max-width: 100%;
      max-height: 100%;
      width: inherit;
      z-index: 1;
    }
  }
  .header {
    @include px2rem(margin-top, 4px);
  }
  .page-nav {
    position: absolute;
    @include px2rem(bottom, 16px);
    @include px2rem(right, 16px);
    @include pm2rem(padding, 4px, 20px, 4px, 20px);
    background-color: rgba(0, 0, 0, .5);
    z-index: 1;
  }
  .info-container {
    @include pm2rem(padding, 42px, 0px, 0px, 26px);
    border-bottom: 1px solid $fifth-grey;
    .name {
      @include pm2rem(margin, 0px, 0px, 30px, 0px);
      font-weight: 800;
    }
    .money {
      align-items: center;
      position: relative;
      @include pm2rem(padding, 0px, 70px, 0px, 0px);
      .number {
        color: #FF0000;
      }
      .unit {
        color: #343434;
      }
      .more {
        color: $dark;
      }
      .icon-box {
        display: inline-block;
      }
      .up {
        transform: rotate(-90deg);
      }
      .active {
        animation:rotateTo90 0.2s ease-in-out 0s 1 normal both;
      }
      .inactive {
        animation:rotateTo0 0.2s ease-in-out 0s 1 normal both;
      }
      .more-price {
        position: absolute;
        @include px2rem(right, 70px);
        @include px2rem(width, 180px);
        @include px2rem(top, 60px);
        text-align: center;
        color: #FF0000;
        z-index: 1002;
        overflow: hidden;
        .menu-list {
          position: absolute;
          width: 100%;
          transform: translate3d(0, -100%, 0);
          max-height: 0;
          overflow: hidden;
          transition: max-height .3s cubic-bezier(0.3, .03, .08, .65);
          background-color: $white;
          box-shadow: 0 1px 5px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12);
          ul {
            overflow-y: auto;
          }
          .item {
            display: block;
            transition: transform .2s ease-in,opacity .4s ease-in;
            transform: translate3d(0, -20% ,0);
            opacity: 0;
            @include px2rem(height, 70px);
            @include px2rem(line-height, 70px);
            border: 1px solid $fifth-grey;
            border-bottom: none;
          }
          li:last-child {
            .item {
              border-bottom: 1px solid $fifth-grey;
            }
          }
        }
        &.menu-active {
          overflow: visible;
          .menu-list {
            @include px2rem(max-height, 280px);
            overflow: visible;
            transform: translate3d(0,0,0);
            .item {
              opacity: 1;
              transform: translate3d(0,0,0);
            }
            li:nth-last-child(1) .item {
              transition-delay: .16s;
            }
            li:nth-last-child(2) .item {
              transition-delay: .2s;
            }
            li:nth-last-child(3) .item {
              transition-delay: .24s;
            }
            li:nth-last-child(4) .item {
              transition-delay: .28s;
            }
            li:nth-last-child(5) .item {
              transition-delay: .32s;
            }
            li:nth-last-child(6) .item {
              transition-delay: .36s;
            }
            li:nth-last-child(7) .item {
              transition-delay: .4s;
            }
            li:nth-last-child(8) .item {
              transition-delay: .44s;
            }
            li:nth-last-child(9) .item {
              transition-delay: .48s;
            }
            li:nth-last-child(10) .item {
              transition-delay: .52s;
            }
          }
        }
      }
    }
    .inventory {
      @include pm2rem(padding, 0px, 0px, 22px, 0px);
    }
  }
  .nav-bar {
    @include px2rem(height, 100px);
    .mint-tab-item {
      @include font-dpr-important(17px);
      border-bottom: 1px solid $fifth-grey !important;
      display: block;
      padding: 0 !important;
      @include px2remimportant(line-height, 100px);
      div {
        @include font-dpr-important(17px);
      }
    }
    .is-selected {
      color: $green !important;
      margin-bottom: 0 !important;
      @include px2remimportant(border-bottom-width, 10px);
      border-bottom-color: $green !important;
      text-decoration: none !important;
      .mint-tab-item {
        color: $green !important;
      }
    }
    a:active, a:hover {
      text-decoration: none;
    }
    .row-item {
      display: block;
    }
  }
  .nav-bar-container {
    border-bottom: 1px solid $third-grey;
  }
  .company-info {
    @include pm2rem(margin, 22px, 0px, 0px, 0px);
    @include pm2rem(padding, 24px, 24px, 124px, 24px);
    border-top: 1px solid $third-grey;
    line-height: 1;
    .wraper {
      display: flex;
      align-items: center;
      .company-img {
        @include px2rem(width, 106px);
        height: inherit;
        display: block;
        img {
          @include px2rem(width, 82px);
          @include px2rem(height, 82px);
        }
      }
      .content-wraper {
        display: block;
        width: inherit;
        flex: 1;
        .company-content {
          height: inherit;
          line-height: 1;
          display: block;
          flex: 1;
          width: inherit;
          .title {
            font-weight: 400;
            color: $second-red;
            width: 100%;
          }
          .info {
            @include pm2rem(margin, 28px, 0px, 0px, 0px);
            span {
              color: #535252;
              @include px2rem(margin-right, 50px);
            }
          }
        }
      }
    }
  }
  .product-tab-bar {
    @include px2rem(height, 97px);
    display: -webkit-box;
    position: fixed;
    bottom: 0;
    .btn-box {
      border-top: 1px solid $fifth-grey;
      width: 17.6%;
      box-sizing: border-box;
      line-height: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      i {
        @include px2rem(margin-bottom, 12px);
      }
      .bottom-btn-active {
        color: #FF3E3E;
        animation: bounceIn 1s ease-in 0s 1 normal both;
      }
      .kefu {
        color: #20A2E5;
      }
      .badge {
        background-color: $white;
        position: absolute;
        @include px2rem(top, 10px);
        @include px2rem(right, 26px);
        @include px2rem(min-width, 20px);
        @include px2rem(min-height, 20px);
        @include pm2rem(padding, 2px, 2px, 2px, 2px);
        color: $red;
        @include px2rem(border-radius, 30px);
        @include font-dpr(8px);
        border: 1px solid $red;
        display: flex;
        align-items: center;
        justify-content: center;
        @include line-height(8px);
      }
      .active {
        animation: bounceIn 1s ease-in 0s 1 normal both;
      }
    }
    .btn-shopping-car {
      width: 23.6%;
      background-color: #FFA800;
      border: none;
      line-height: normal;
      span {
        font-weight: bold;
      }
    }
    .btn-buy {
      width: 23.6%;
      background-color: #FF4901;
      border: none;
      line-height: normal;
      span {
        font-weight: bold;
      }
    }
    .disabled {
      background-color: $eighth-grey;
    }
  }
  .productdetail-product-tags {
    display: flex;
    flex-wrap: wrap;
    @include pm2rem(padding, 20px, 0px, 0px, 20px);
    .tag {
      @include px2rem(border-radius, 7px);
      border: 1px solid $second-grey;
      @include pm2rem(padding, 10px, 20px, 10px, 20px);
      @include pm2rem(margin, 0px, 20px, 20px, 0px);
      line-height: 1;
    }
    .no-info {
      @include pm2rem(padding, 20px, 0px, 40px, 0px);
      @include pm2rem(margin, 0px, 0px, 0px, -20px);
      text-align: center;
      width: 100%;
      line-height: 1;
      color: $fifth-grey;
    }
  }
  .option-bar {
    position: fixed;
    @include px2rem(top, 38px);
    display: flex;
    align-items: center;
    z-index: 1004;
    .close {
      @include pm2rem(padding, 4px, 10px, 4px, 10px);
      @include px2rem(border-radius, 10px);
      @include pm2rem(margin, 0px, 30px, 0px, 30px);
      background-color: rgba(0, 0, 0, .5);
      color: white;
      z-index: 1003;
      display: flex;
      align-items: center;
      i {
        @include font-dpr(20px);
      }
    }
    .preview-page-nav {
      background-color: rgba(0, 0, 0, .5);
      @include px2rem(border-radius, 10px);
      z-index: 1003;
      @include pm2rem(padding, 4px, 10px, 4px, 10px);
    }
  }
  .full-screen-swiper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1003 !important;
    background-color: $dark;
    img[lazy=loading] {
      max-width: 100%;
      max-height: 100%;
      width: inherit;
      z-index: 1;
      background-position: center center!important;
      background: url("../../assets/imgLoading3.jpg");
      background-repeat: no-repeat;
      background-size: cover;
    }
    img[lazy=error] {
      max-width: 100%;
      max-height: 100%;
      width: inherit;
      z-index: 1;
      background-position: center center!important;
      background: url("../../assets/imgLoadingError.png");
      background-repeat: no-repeat;
      background-size: cover;
    }
    img[lazy=loaded] {
      max-width: 100%;
      max-height: 100%;
      width: inherit;
      z-index: 1;
    }
  }
  .full-screen-bg {
    background-color: $dark;
  }
  .product-popup-dialog {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    z-index: 1001;
    top: 0;
    .main {
      @include px2rem(width, 562px);
      @include px2rem(top, 200px);
    }
    .title {
      @include px2rem(height, 80px);
      text-align: center;
      @include px2rem(line-height, 80px);
    }
    .content {
      @include px2rem(min-height, 500px);
      border-bottom: 1px solid $fifth-grey;
      .item {
        border-bottom: 1px solid $fifth-grey;
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
            line-height: 1;
            @include px2rem(margin-bottom, 20px);
          }
          span {
            @include px2rem(margin-right, 50px);
          }
          .product-price {
            color: #F50E0E;
          }
        }
      }
    }
    .footer {
      @include px2rem(height, 80px);
      @include px2rem(line-height, 80px);
      text-align: center;
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

</style>

<style lang="scss">
  @import '../../styles/mixin';
  /*覆盖mint-ui中nav-bar组件默认样式，故不用scoped*/

  .swipe {
    .swiper-pagination {
      z-index: 1;
    }
    .swiper-pagination-bullet-active {
      background-color: $white;
    }
  }
  .nav-bar {
    .mint-tab-item-label {
      @include font-dpr-important(15px);
      font-weight: 500;
      color: $second-dark;
      line-height: inherit !important;
    }
    .is-selected {
      .mint-tab-item-label {
        color: $green !important;
      }
    }
  }
  .prodcutdetail-price-item {
    @include pm2rem(padding, 36px, 0px, 0px, 38px);
    background-color: $white;
    .row-item {
      display: block;
      @include pm2rem(margin, 0px, 0px, 36px, 0px);
      @include font-dpr(14px);
      color: $second-dark;
    }
    .no-price {
      @include pm2rem(padding, 4px, 0px, 40px, 0px);
      @include pm2rem(margin, 0px, 0px, 0px, -38px);
      @include font-dpr(20px);
      color: $fifth-grey;
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
        border-bottom: 1px solid $fourth-grey;
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
      position: relative;
      display: flex;
      align-items: flex-start;
      .dot {
        @include pm2rem(margin, 0px, -9px, 0px, -20px);
        @include font-dpr(30px);
        @include line-height(30px);
        color: #ACACAC;
      }
      .title {
        flex: 1;
        @include font-dpr(15px);
        @include line-height(30px);
        @include px2rem(margin-right, 50px);
        word-wrap: break-word;
        word-break: break-all;
        color: $second-dark;
      }
      i {
        color: #F4B223;
        @include px2rem(margin-right, 10px);
        @include font-dpr(21px);
        @include line-height(30px);
      }
    }
    .row-container {
      position: relative;
      display: block;
      .sub-row-title {
        display: flex;
        align-items: flex-start;
        .dot {
          @include pm2rem(margin, 0px, -9px, 0px, -20px);
          @include font-dpr(30px);
          @include line-height(30px);
          color: #ACACAC;
        }
        .title {
          flex: 1;
          @include font-dpr(15px);
          @include line-height(30px);
          @include px2rem(margin-right, 50px);
          word-wrap: break-word;
          word-break: break-all;
          color: $second-dark;
        }
        i {
          color: #F4B223;
          @include px2rem(margin-right, 10px);
          @include font-dpr(21px);
          @include line-height(30px);
        }
      }
      .sub-item {
        display: block;
        .title {
          flex: 1;
          @include font-dpr(13px);
          @include line-height(26px);
          @include pm2rem(margin, 0px, 50px, 0px, 60px);
          word-wrap: break-word;
          word-break: break-all;
          color: $second-dark;
        }
      }
      .third-item {
        display: block;
        .title {
          flex: 1;
          @include font-dpr(13px);
          @include line-height(26px);
          @include pm2rem(margin, 0px, 50px, 0px, 100px);
          word-wrap: break-word;
          word-break: break-all;
          color: $second-dark;
        }
      }
    }
    .no-product-args {
      @include pm2rem(padding, 40px, 0px, 40px, 0px);
      @include pm2rem(margin, 0px, 0px, 0px, 0px);
      text-align: center;
      width: 100%;
      line-height: 1;
      @include font-dpr(20px);
      color: $fifth-grey;
    }
  }
  .toast-icon-big {
    @include font-dpr(36px);
    @include pm2rem(margin, 0px, 0px, -20px, 0px);
  }
</style>
