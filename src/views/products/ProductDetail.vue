<template>
  <section>
    <template v-if="!hideDownloadBar">
      <download-bar
        @close="closeDownloadBar()"
        @download="goDownload()">
      </download-bar>
    </template>
    <div style="position: relative; transform-style: preserve-3d;">
      <product-header
        @back="goBack()"
        @open-favorites="openFavorites()"
        @report="goReport()"
        @search-near-by="searchNearBy()"
        @home="goHome()"
        v-bind:class="{'header': !hideDownloadBar}">
      </product-header>
      <div class="swipe" v-bind:class="{'header': !hideDownloadBar}">
        <swiper :options="swiperOption">
          <swiper-slide v-for="(item, index) in productDetailFiles" :key="index">
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
        <span
          v-if="productDetailFiles && productDetailFiles.length"
          class="page-nav white font-16">{{currentIndex}}/{{productDetailFiles.length}}</span>
        <span v-else class="page-nav white font-16">0/0</span>
      </div>
    </div>
    <section class="info-container white-bg">
      <div
        v-if="productDetail && productDetail.name"
        class="name font-17">{{productDetail.name}}</div>
      <div v-else class="name font-17">&nbsp;</div>
      <div class="flex-between money">
        <div>
          <span class="number font-13">&yen;</span>
          <span
            v-if="productDetail && productDetail.prices && productDetail.prices.length > 0"
            class="number font-26">{{currentPrice.money}}</span>
          <span
            v-else-if="productDetail && productDetail.prices && productDetail.prices.length === 0"
            class="number font-26">定制</span>
          <span v-else class="number font-26">&nbsp;</span>
        </div>
      </div>
      <div
        v-if="productDetail && productDetail.prices && productDetail.prices.length > 0"
        class="inventory font-13 second-text">
        库存 ：{{productDetail.prices[0].amount || '定制'}}
      </div>
      <div
        v-else-if="productDetail && productDetail.prices && productDetail.prices.length === 0"
        class="inventory font-13 second-text">库存 ：定制</div>
      <div
        v-else
        class="inventory font-13 second-text">
        库存 ：0
      </div>
    </section>
    <section v-if="productDetail && productDetail.price_range && productDetail.price_range.length > 1" class="price-container white-bg">
      <a class="flex-between" @click="expandMorePrice()">
        <span class="font-14 second-text">{{priceText}}</span>
        <i class="iconfont icon-you primary font-14"></i>
      </a>
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
          <template v-if="productDetail && productDetail.goods_type === 'StoneMaterial'">
            <div class="row-item">
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
          <template v-if="productDetail && productDetail.properties && productDetail.properties.length > 0">
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
    <section class="company-info white-bg" @click="goEnterprise()">
      <div class="wraper">
        <div class="company-img">
          <img
            v-if="productDetailTeam && productDetailTeam.logo"
            :src="productDetailTeam.logo">
          <div v-else></div>
        </div>
        <div class="content-wraper ellipsis">
          <div class="company-content">
            <div
              v-if="productDetailTeam && productDetailTeam.company"
              class="title ellipsis font-16">
              {{productDetailTeam.company}}
            </div>
            <span v-else class="title ellipsis font-16">&nbsp;</span>
            <div class="info font-14">
              <span v-if="productDetailTeam && productDetailTeam.service && productDetailTeam.service.name">{{productDetailTeam.service.name}}</span>
              <span v-else>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span v-if="productDetailTeam && productDetailTeam.products_count">{{productDetailTeam.products_count}}件商品</span>
              <span v-else>&nbsp;</span>
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
        v-if="currentPrice.money === '定制' || currentPrice.amount === '定制' || currentPrice.money === '赠品'"
        class="btn-box btn-shopping-car disabled">
        <span class="font-14 white">{{shoppingCarText}}</span>
      </div>
      <div v-else class="btn-box btn-shopping-car" @click="expandMorePrice()">
        <span class="font-14 white">{{shoppingCarText}}</span>
      </div>
      <div
        v-if="currentPrice.money === '定制' || currentPrice.amount === '定制' || currentPrice.money === '赠品'"
        class="btn-box btn-buy disabled">
        <span class="font-14 white">立即购买</span>
      </div>
      <div v-else class="btn-box btn-buy" @click="expandMorePrice()">
        <span class="font-14 white">立即购买</span>
      </div>
    </section>
    <section v-if="popUp" class="product-popup-dialog">
      <div class="main absolute-horizontal">
        <div class="title primary-bg white font-16">
          <span>购销渠道关系认证成功</span>
        </div>
        <div class="content white-bg">
          <div class="item" @click="goLinkEnterpriseDetail(teamLink)">
            <img v-if="teamLink && teamLink.logo" :src="teamLink.logo">
            <img v-else src="../../assets/blank.jpg">
            <div class="info">
              <p class="font-13 second-text ellipsis">{{teamLink.company}}</p>
              <div>
                <span class="font-12 third-text">{{teamLink.service.name}}</span>
                <span class="font-12 third-text width-limit ellipsis">{{teamLink.provice_name}}&middot;{{teamLink.city_name}}</span>
                <span v-if="teamLink.state !== 'approved'" class="font-12 third-text">已注销</span>
              </div>
            </div>
          </div>
          <div class="item" @click="goLinkProductDetail(productLink)">
            <img v-if="productLinkFile && productLinkFile.url" :src="productLinkFile.url">
            <img v-else src="../../assets/imgLoadingError.png">
            <div class="info">
              <p>{{productLink.name}}</p>
              <div>
                <span
                  v-if="productLink.prices && productLink.prices.length > 0 && productLink.prices[0].money !== '定制'"
                  class="product-price">{{productLink.prices[0].money}}元</span>
                <span v-else class="product-price">{{productLink.prices[0].money}}</span>
                <span v-if="productLink.state === 'editing'" class="font-12 third-text">已下架</span>
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
    <div v-if="productDetail && productDetail.prices && productDetail.prices.length >= 1">
      <product-sku
        :show="morePrice"
        :store="productDetail"
        :img="productDetailFiles"
        :price="currentPrice"
        :choosed="hasChoosePrice"
        :quantity="quantity"
        @increase="increase"
        @decrease="decrease"
        @handle-quantity="handleInput"
        @change-price="changePrice"
        @close="closeSku"
        @add-shopping-cart="addShoppingCar"
        @buy-now="buyNow">
      </product-sku>
    </div>
  </section>
</template>

<script>
  import ProductHeader from '../../components/header/Head'
  import ProductSku from '../../components/product/ProductSku'
  import DownloadBar from '../../components/common/DownloadBar'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import { getStore, setStore, removeStore } from '../../config/mUtils'
  import { Toast } from 'mint-ui'
  export default {
    props: ['id'],
    name: 'ProductDetail',
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
        priceText: '请选择更多商品价格',
        hasChoosePrice: false,
        quantity: 1,
        productLink: {},
        productLinkFile: {},
        teamLink: {},
        morePrice: false,
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
        hideDownloadBar: getStore('hideDownloadBar'),
        productDetail: null,
        productDetailFiles: [],
        allPriceProperties: [],
        archives: [],
        teams: null,
        productDetailTeam: [],
        deliveries: []
      }
    },
    components: {
      ProductHeader,
      ProductSku,
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
      getProductDetail (productId = this.id) {
        this.$store.dispatch('commonAction', {
          url: `/products/${productId}`,
          method: 'get',
          params: {
            id: productId,
            token: this.token
          },
          target: this,
          resolve: (state, res) => {
            if (productId === this.id) {
              this.hasAddFavorites = res.data.products.favorable
              this.favoratesText = res.data.products.favorable ? '已收藏' : '收藏'
              this.productDetail = res.data.products
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
          let subIndex = 0
          for (let i = 0; i < productDetail.properties.length; i++) {
            if (productDetail.properties[i].children.length === 0) {
              index += 1
            } else {
              for (let j = 0; j < productDetail.properties[i].children.length; j++) {
                if (!productDetail.properties[i].children[j].name || !productDetail.properties[i].children[j].value) {
                  subIndex += 1
                }
              }
              // 该产品一级属性值全为空，则该产品也不可能有二级属性(默认不显示根属性，从一级属性开始)
              if (subIndex === productDetail.properties[i].children.length) {
                index += 1
              }
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
            this.allPriceProperties = res.data.properties
            this.currentPrice = this.productDetail.prices[0] || {money: '定制', amount: '定制', properties: []}
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
            if (productId === this.id) {
              this.productDetailFiles = res.data.files
              this.getAllPriceProperties(this.productDetail.category_id, productId, teamId)
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
            this.archives = res.data.archives
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
      getOrganization (productId = this.id, teamId = '') {
        this.$store.dispatch('commonAction', {
          url: '/links/teams',
          method: 'get',
          params: {
            ids: [teamId]
          },
          target: this,
          resolve: (state, res) => {
            if (productId === this.id) {
              this.productDetailTeam = res.data.teams[0]
              this.shouldGetDeliveries(this.token)
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
      shouldGetDeliveries (token) {
        if (this.hasLogin) {
          this.getDeliveries(token)
        }
      },
      // 获取收获地址
      getDeliveries (token) {
        this.$store.dispatch('commonAction', {
          url: '/deliveries',
          method: 'get',
          params: {
            token: token
          },
          target: this,
          resolve: (state, res) => {
            this.deliveries = res.data.deliveries
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
        if (this.productDetail.prices.length === 1) {
          this.hasChoosePrice = true
        }
        this.morePrice = true
      },
      closeSku () {
        this.morePrice = false
      },
      changePrice (item) {
        this.currentPrice = item
        this.priceText = `已选：￥${item.money}`
        this.hasChoosePrice = true
        this.handleInput(item)
        this.currentPriceProperties = this.handlePricePropertyes(this.currentPrice, this.allPriceProperties)
      },
      handleInput (item) {
        if (parseInt(item.quantity + '') >= parseInt(item.amount + '')) {
          this.quantity = parseInt(item.amount + '')
        } else if (parseInt(item.quantity + '') <= 0 || !item.quantity) {
          this.quantity = 1
        } else {
          this.quantity = parseInt(item.quantity)
        }
      },
      increase () {
        this.quantity += 1
      },
      decrease () {
        this.quantity -= 1
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
      },
      closePopup () {
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
        this.$router.push({name: 'Report', query: {resourceId: this.id, resourceClass: 'product'}})
      },
      goHome () {
        this.$router.push({name: 'See'})
      },
      goLogin () {
        this.$store.dispatch('switchIntegralDialog', {status: true})
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
            product_id: this.id
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.favorites && res.data.favorites.id === parseInt(this.id)) {
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
          url: `/favorites/${this.id}`,
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
                duration: 500
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
          this.$router.push({name: 'Chat', query: {type: 'Product', teamId: this.currentTeamId, productId: this.id, productImg: this.productDetailFiles[0].url, productPrice: this.currentPrice.money, productName: this.productDetail.name}})
        }
      },
      openShoppingCar () {
        if (this.hasLogin) {
          this.$router.push({name: 'ShoppingCart'})
        } else {
          this.goLogin()
        }
      },
      checkBeforeBuying () {
        if (!this.hasChoosePrice) {
          Toast({
            message: '请选择一个价格',
            duration: 500
          })
          return false
        } else {
          return true
        }
      },
      addShoppingCar (quantity) {
        if (this.checkBeforeBuying()) {
          if (this.hasLogin) {
            this.addShoppingCarRequest(quantity)
            this.closeSku()
            this.quantity = 1
          } else {
            this.goLogin()
          }
        }
      },
      addShoppingCarRequest (quantity) {
        this.$store.dispatch('commonAction', {
          url: '/purchase_items',
          method: 'post',
          params: {},
          data: {
            token: this.token,
            price_id: this.currentPrice.id,
            quantity: quantity
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
      buyNow (quantity) {
        if (this.checkBeforeBuying()) {
          if (this.hasLogin) {
            this.closeSku()
            this.quantity = 1
            setStore('buying', [{
              team: {
                company: this.productDetailTeam.company,
                id: this.productDetailTeam.id,
                logo: this.productDetailTeam.logo
              },
              products: [{
                id: null, // 进入确认订单页面后，此id为空，更改购买数量时，不需要发请求更改
                quantity: quantity,
                price: {
                  id: this.currentPrice.id,
                  warehouse: null,
                  amount: this.currentPrice.amount,
                  money: this.currentPrice.money,
                  product: {
                    id: this.productDetail.id,
                    name: this.productDetail.name,
                    state: this.productDetail.state,
                    organization_id: this.productDetail.organization_id,
                    file_id: this.productDetailFiles[0].id,
                    file_url: this.productDetailFiles[0].url,
                    file_thumb_url: this.productDetailFiles[0].thumb_urls[0]
                  }
                },
                checked: true
              }]
            }])
            if (this.deliveries.length === 0) {
              removeStore('editAddress')
              this.$router.push({name: 'AddAddress'})
            } else {
              this.$router.push({name: 'OrderPaying'})
            }
          } else {
            this.goLogin()
          }
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
        if (item.state === 'approved') {
          this.closePopup()
          this.$router.push({name: 'EnterpriseCarte', params: {id: item.id}})
        }
      },
      goLinkProductDetail (item) {
        if (item.state === 'approved') {
          this.closePopup()
          this.$router.push({name: 'ProductDetail', params: {id: item.id}})
          window.location.reload()
        }
      },
      goEnterprise () {
        this.$router.push({name: 'EnterpriseCarte', params: {id: this.currentTeamId}})
      },
      handleIntegralModal () {
        if (getStore('shareIntegral')) {
          this.$store.dispatch('switchRegistDialog', {status: getStore('shareIntegral')})
          removeStore('shareIntegral')
          removeStore('shareRegist')
        }
      }
    },
    mounted () {
      this.handleIntegralModal()
      this.stopTouchMove()
      this.getProductDetail(this.id)
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
    background-color: rgba(57, 55, 66, 0.5);
    z-index: 1;
  }
  .info-container {
    @include pm2rem(padding, 42px, 0px, 0px, 26px);
    border-bottom: 1px solid $third-grey;
    @include px2rem(margin-bottom, 22px);
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
      .up {
        transform: rotate(-90deg);
      }
      .active {
        animation:rotateTo90 0.2s ease-in-out 0s 1 normal both;
      }
      .inactive {
        animation:rotateTo0 0.2s ease-in-out 0s 1 normal both;
      }
    }
    .inventory {
      @include pm2rem(padding, 0px, 0px, 22px, 0px);
    }
  }
  .price-container {
    @include px2rem(margin-bottom, 22px);
    border-top: 1px solid $third-grey;
    border-bottom: 1px solid $third-grey;
    a {
      @include px2rem(height, 96px);
      @include pm2rem(padding, 0px, 26px, 0px, 26px);
      align-items: center;
      line-height: normal;
    }
    a:active {
      background-color: rgba(239, 234, 234, .5);
    }
  }
  .nav-bar {
    @include px2rem(height, 100px);
    border-top: 1px solid $third-grey;
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
        div {
          @include px2rem(width, 82px);
          @include px2rem(height, 82px);
          background-color: $third-grey;
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
      border-bottom: 1px solid $third-grey;
      .item {
        border-bottom: 1px solid $third-grey;
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
            @include px2rem(max-width, 400px);
            @include px2rem(margin-bottom, 20px);
          }
          span {
            @include px2rem(margin-right, 50px);
          }
          .product-price {
            color: #F50E0E;
          }
          .width-limit {
            display: inline-flex;
            @include px2rem(max-width, 200px);
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
    @include pm2rem(padding, 36px, 0px, 0px, 0px);
    background-color: $white;
    .row-item {
      display: block;
      @include pm2rem(margin, 0px, 38px, 36px, 38px);
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
    @include px2rem(padding-right, 30px);
    background-color: $white;
    line-height: 1;
    .row-item {
      @include pm2rem(padding, 0px, 32px, 0px, 32px);
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
