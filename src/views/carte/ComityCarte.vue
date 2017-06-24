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
      <enterprise-card
        :store="teams"
        @click="goEnterpriseDetail"></enterprise-card>
    </div>
    <div class="nav-tabs">
      <div class="tab-bar">
        <div class="left"
             v-bind:class="{'active': activeIndex === 0}"
             @click.prevent="tabClick(0)">产品</div>
        <div class="middle"
             v-bind:class="{'active': activeIndex === 1}"
             @click.prevent="tabClick(1)">资讯</div>
        <div class="middle"
             v-bind:class="{'active': activeIndex === 2}"
             @click.prevent="tabClick(2)">企业会员</div>
        <div class="right"
             v-bind:class="{'active': activeIndex === 3}"
             @click.prevent="tabClick(3)">个人会员</div>
      </div>
      <div class="tab-container">
        <template v-if="activeIndex === 0">
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
        </template>
        <template v-if="activeIndex === 1">
          <transition name="fade" mode="out-in">
            <information-list
              :store="enterpriseInfoFiles"
              @click="viewBigImg">
            </information-list>
          </transition>
        </template>
        <template v-if="activeIndex === 2">
          <transition name="fade" mode="out-in">
            <enterprise-list
              :store="enterpriseMembers"
              @click="goEnterpriseCarte">
            </enterprise-list>
          </transition>
        </template>
        <template v-if="activeIndex === 3">
          <transition name="fade" mode="out-in">
            <person-list
              :store="personMembers"
              @click="goPersonCarte">
            </person-list>
          </transition>
        </template>
      </div>
      <transition name="fade">
        <search v-show="showSearchBar"
                :placeholder="placeholder"
                @search="search">
        </search>
      </transition>
      <transition name="fade">
        <order v-show="showSearchBar && activeIndex === 0"
               :order-up="orderUp"
               :show-list="showList"
               @switch="showListChange"></order>
      </transition>
    </div>
  </section>
</template>

<script>
  import EnterpriseCard from '../../components/common/EnterpriseCard'
  import ProductThumbnailMode from '../../components/product/Thumbnail'
  import ProductListMode from '../../components/product/List'
  import InformationList from '../../components/common/InformationList'
  import EnterpriseList from '../../components/common/EnterpriseList'
  import PersonList from '../..//components/common/PersonList'
  import { showBack } from '../../config/mUtils'
  import ViewBigImg from '../../components/common/ViewBigImg'
  import { mapGetters } from 'vuex'
  import { Indicator } from 'mint-ui'
  import Search from '../../components/common/Search'
  import Order from '../../components/common/Order'
  export default {
    data () {
      return {
        teamId: 6756,
        token: 'fbdec44fa55088fd863ce47c778b1ddc',
        hasSearch: false,
        showSearchBar: false,
        placeholder: '搜索产品',
        orderUp: true,
        showList: false,
        activeIndex: 0,
        cssAnimationViewer: false,
        showFullScreenPreview: false,
        infoImg: []
      }
    },
    components: {
      EnterpriseCard,
      ProductThumbnailMode,
      ProductListMode,
      InformationList,
      EnterpriseList,
      PersonList,
      ViewBigImg,
      Search,
      Order
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
            this.hasSearch = q !== ''
            this.getFilesPublisheds(this.handleProductThumbnails(res.data.products), res.data.products)
          },
          reject: () => {}
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
            state.productsThumbnails = res.data.files
            state.products = this.handleProducts(products, state.productsThumbnails)
            this.getEnterpriseDocument()
          },
          reject: () => {
            Indicator.close()
          }
        })
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
            this.getEnterpriseList()
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
      // 获取指定组织已发布的公司档分类概况(协会名片资讯)
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
            this.getInformation(this.handleDocumentIds(this.arrFilter(res.data.types)))
            Indicator.close()
          },
          reject: () => {}
        })
      },
      arrFilter (arr) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].file_id !== null) {
            tmpArr.push(arr[i])
          }
        }
        return tmpArr
      },
      handleDocumentIds (arr) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          tmpArr.push(arr[i].file_id)
        }
        return tmpArr
      },
      getEnterpriseList () {
        this.$store.dispatch('commonAction', {
          url: `/team/${this.teamId}/guilds`,
          method: 'get',
          params: {
            team_id: this.teamId,
            states: ['joined'],
            page: 1,
            per_page: 10,
            q: ''
          },
          target: this,
          resolve: (state, res) => {
            state.enterpriseMembers = res.data.members
            this.getPersonList()
          },
          reject: () => {
            Indicator.close()
          }
        })
      },
      getPersonList () {
        this.$store.dispatch('commonAction', {
          url: `/team/${this.teamId}/members`,
          method: 'get',
          params: {
            team_id: this.teamId,
            token: this.token,
            states: ['accepted'],
            page: 1,
            per_page: 20,
            q: ''
          },
          target: this,
          resolve: (state, res) => {
            Indicator.close()
            state.personMembers = res.data.preps
          },
          reject: () => {
            Indicator.close()
          }
        })
      },
      goEnterpriseCarte (id) {
        this.$router.push({name: 'EnterpriseCarte', params: {id: id}})
      },
      goPersonCarte (id) {
        this.$router.push({name: 'PersonCarte', params: {id: id}})
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
        this.activeIndex = val
        switch (val) {
          case 0:
            this.placeholder = '搜索产品'
            break
          case 1:
            this.placeholder = '搜索资讯'
            break
          case 2:
            this.placeholder = '搜索企业会员'
            break
          case 3:
            this.placeholder = '搜索个人会员'
            break
          default:
            this.placeholder = '搜索产品'
            break
        }
        this.handleSearchBar()
      },
      search (res) {
        switch (this.activeIndex) {
          case 0:
            this.getProducts(res)
            break
          case 1:
            break
          case 2:
            this.getEnterpriseList(res)
            break
          case 3:
            this.getPersonList(res)
            break
          default:
            this.getProducts(res)
        }
      },
      handleSearchBar () {
        let height = parseFloat(document.documentElement.style.fontSize.replace('px', '')) * 153 / 36
        let elementId = 'productList'
        if (!this.activeIndex === 0) {
          height = parseFloat(document.documentElement.style.fontSize.replace('px', '')) * 190 / 36
          elementId = 'informationList'
        }
        showBack((res) => {
          if (this.activeIndex === 0 && res.id === 'productList') {
            this.showSearchBar = res.show
          } else {
            // this.showSearchBar = false
          }
        }, {id: elementId, height: height})
      },
      goProductDetail (item) {
        this.$router.push({name: 'ProductDetail', params: {id: item.id, organizationId: item.organization_id}})
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
        'enterpriseMembers',
        'enterpriseInfoFiles',
        'enterpriseDocuments',
        'personMembers'
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
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      div {
        height: 100%;
        flex: 1;
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
      .middle {
        border-left: none;
      }
      .active {
        background-color: #52CAA7;
        color: $white;
      }
      .right {
        @include px2rem(border-top-right-radius, 14px);
        @include px2rem(border-bottom-right-radius, 14px);
        border-left: none;
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
