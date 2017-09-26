<template>
  <section class="white-bg">
    <common-header
      :title="header"
      :icon-class="iconClass"
      :right-text="rightBtnText"
      @right-click="goReport()"
      @back="goBack()">
    </common-header>
    <div class="card-container">
      <enterprise-card
        :store="teams"
        :products="products"
        @icon-click="iconClick"
        @click="goEnterpriseDetail">
      </enterprise-card>
    </div>
    <div class="four-nav-tabs">
      <div class="tab-bar primary flex font-17">
        <div
          class="left flex-1"
          v-bind:class="{'primary-bg white': activeIndex === 0}"
          @click.prevent="tabClick(0)">产品</div>
        <div
          class="middle flex-1"
          v-bind:class="{'primary-bg white': activeIndex === 1}"
          @click.prevent="tabClick(1)">资讯</div>
        <div
          class="middle flex-1"
          v-bind:class="{'primary-bg white': activeIndex === 2}"
          @click.prevent="tabClick(2)">校友班级</div>
        <div
          class="middle right flex-1"
          v-bind:class="{'primary-bg white': activeIndex === 3}"
          @click.prevent="tabClick(3)">校友企业</div>
      </div>
      <div class="tab-container">
        <transition
          name="fade"
          :appear="true"
          mode="out-in">
          <template v-if="activeIndex === 0">
            <template v-if="products && products.length > 0">
              <div>
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
                <mugen-scroll
                  key="product"
                  :handler="loadProductBottom"
                  :handle-on-mount="false"
                  :should-handle="!productLoading">
                  <div
                    v-if="productLoading"
                    class="loading">
                    <mt-spinner
                      type="snake"
                      :size="18">
                    </mt-spinner>
                    <p>加载中...</p>
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
          </template>
          <template v-if="activeIndex === 1">
            <template  v-if="enterpriseInfoFiles && enterpriseInfoFiles.length > 0">
              <information-list
                key="information"
                :store="enterpriseInfoFiles"
                @click="openInformationFolders">
              </information-list>
            </template>
            <div
              v-else
              key="information1"
              class="no-data">
              <img src="../../assets/noInformation.png">
            </div>
          </template>
          <template v-if="activeIndex === 2">
            <template v-if="enterpriseMembers && enterpriseMembers.length > 0">
              <div>
                <enterprise-list
                  :store="enterpriseMembers"
                  @click="goClass">
                </enterprise-list>
                <mugen-scroll
                  key="enterprise"
                  :handler="loadEnterpriseBottom"
                  :handle-on-mount="false"
                  :should-handle="!enterpriseLoading">
                  <div
                    v-if="enterpriseLoading"
                    class="loading">
                    <mt-spinner
                      type="snake"
                      :size="18">
                    </mt-spinner>
                    <p>加载中...</p>
                  </div>
                </mugen-scroll>
              </div>
            </template>
            <div
              v-else
              key="enterprise1"
              class="no-data">
              <img src="../../assets/noEnterprise.png">
            </div>
          </template>
          <template v-if="activeIndex === 3">
            <template v-if="alumniBusiness && alumniBusiness.length > 0">
              <div>
                <enterprise-list
                  :store="alumniBusiness"
                  @click="goEnterpriseCarte">
                </enterprise-list>
                <mugen-scroll
                  key="person"
                  :handler="loadPersonBottom"
                  :handle-on-mount="false"
                  :should-handle="!personLoading">
                  <div
                    v-if="personLoading"
                    class="loading">
                    <mt-spinner
                      type="snake"
                      :size="18">
                    </mt-spinner>
                    <p>加载中...</p>
                  </div>
                </mugen-scroll>
              </div>
            </template>
            <div
              v-else
              key="person1"
              class="no-data">
              <img src="../../assets/noEnterprise.png">
            </div>
          </template>
        </transition>
      </div>
      <search
        v-show="showSearchBar"
        @search="handleSearchBtn(queryParams)">
        <input
          slot="input"
          type="search"
          v-model="queryParams"
          @keyup.enter.prevent="handleSearchBtn(queryParams)"
          :placeholder="placeholder">
      </search>
      <order
        v-show="showSearchBar && activeIndex === 0"
        :order-up="orderUp"
        :show-list="showList"
        @order-change="orderChange"
        @switch="showListChange">
      </order>
      <template v-if="showDialog">
        <pop-dialog
          :store="message"
          @close="closeDialog">
        </pop-dialog>
      </template>
    </div>
    <favorite-btn
      v-if="teams"
      :single="!showGoTopBtn"
      :text="favoratesText"
      @click="favoriteAction()">
    </favorite-btn>
    <back-to-top
      v-if="showGoTopBtn"
      @click="goScroll(0)">
    </back-to-top>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import EnterpriseCard from '../../components/common/EnterpriseCard'
  import ProductThumbnailMode from '../../components/product/Thumbnail'
  import ProductListMode from '../../components/product/List'
  import InformationList from '../../components/common/InformationList'
  import EnterpriseList from '../../components/common/EnterpriseList'
  import { getStore, setStore, showBack, removeStore, getScrollTop, setScrollTop } from '../../config/mUtils'
  import { mapGetters } from 'vuex'
  import Search from '../../components/common/Search'
  import Order from '../../components/common/Order'
  import PopDialog from '../../components/common/PopDialog'
  import BackToTop from '../../components/common/BackToTop'
  import FavoriteBtn from '../../components/common/FavoriteBtn'
  import { Toast } from 'mint-ui'
  import { requestFn } from '../../config/request'
  import MugenScroll from 'vue-mugen-scroll'
  export default {
    data () {
      return {
        teamId: this.$route.params.id,
        token: getStore('user') ? getStore('user').authentication_token : '',
        header: '名片',
        rightBtnText: '投诉',
        iconClass: 'icon-jubao',
        height: 153,
        hasLogin: !!getStore('user'),
        hasSearch: false,
        hasSearchEnterprise: false,
        hasSearchPerson: false,
        showSearchBar: false,
        placeholder: '搜索产品',
        productPageIndex: 1,
        productPageSize: 10,
        enterprisePageIndex: 1,
        enterprisePageSize: 10,
        personPageIndex: 1,
        personPageSize: 20,
        queryParams: '',
        productOrder: 1,
        orderUp: true,
        showList: false,
        activeIndex: 0,
        showGoTopBtn: false,
        showDialog: false,
        message: null,
        productLoading: false,
        enterpriseLoading: false,
        personLoading: false,
        alumniBusiness: [],
        favoratesText: '收藏',
        hasAddFavorites: false
      }
    },
    components: {
      CommonHeader,
      EnterpriseCard,
      ProductThumbnailMode,
      ProductListMode,
      InformationList,
      EnterpriseList,
      PopDialog,
      Search,
      Order,
      BackToTop,
      FavoriteBtn,
      MugenScroll
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
            this.handleFavoriteStatus(res.data.teams[0].enterprise_id)
          },
          reject: () => {
          }
        })
      },
      getProducts (q = this.queryParams, order = this.productOrder) {
        this.queryParams = q
        this.productOrder = order
        this.productLoading = true
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
            // this.queryParams = ''
            this.getEnterpriseDocument()
            if (res.data.products.length === 0) {
              this.productLoading = false
              setScrollTop(getScrollTop() - 50)
              if (this.productPageIndex !== 1) {
                Toast({
                  message: '没有更多数据了',
                  duration: 1000
                })
              }
            } else {
              let tmpArr = this.handleProductThumbnails(res.data.products)
              this.getFilesPublisheds(tmpArr, res.data.products, q)
            }
          },
          reject: () => {
            this.productLoading = false
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
            this.productLoading = false
            if (this.productPageIndex === 1) {
              state.products = this.handleProducts(arr, res.data.files)
              state.productsThumbnails = res.data.files
            } else {
              state.products = [...state.products, ...this.handleProducts(arr, res.data.files)]
              state.productsThumbnails = [...state.productsThumbnails, ...res.data.files]
            }
          },
          reject: (state, error) => {
            this.productLoading = false
            console.log(state, error)
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
      getEnterpriseList (q = this.queryParams) {
        this.queryParams = q
        this.enterpriseLoading = true
        this.$store.dispatch('commonAction', {
          url: `/team/${this.teamId}/guilds`,
          method: 'get',
          params: {
            team_id: this.teamId,
            states: ['joined'],
            page: this.enterprisePageIndex,
            per_page: this.enterprisePageSize,
            q: q
          },
          target: this,
          resolve: (state, res) => {
            this.hasSearchEnterprise = q !== ''
            this.enterpriseLoading = false
            if (this.enterprisePageIndex === 1) {
              state.enterpriseMembers = res.data.members
            } else {
              if (res.data.members.length === 0) {
                setScrollTop(getScrollTop() - 50)
                if (this.enterprisePageIndex !== 1) {
                  Toast({
                    message: '没有更多数据了',
                    duration: 1000
                  })
                }
              }
              state.enterpriseMembers = [...state.enterpriseMembers, ...res.data.members]
            }
            this.getAlumniBusiness()
          },
          reject: () => {
            this.enterpriseLoading = false
          }
        })
      },
      getAlumniBusiness (q = this.queryParams) {
        this.queryParams = q
        this.personLoading = true
        this.$store.dispatch('commonAction', {
          url: '/enterprises',
          method: 'get',
          params: {
            team_id: this.teamId,
            ...(this.token ? {token: this.token} : {}),
            page: this.personPageIndex,
            per_page: this.personPageSize,
            keyword: q
          },
          target: this,
          resolve: (state, res) => {
            this.hasSearchPerson = q !== ''
            this.personLoading = false
            if (this.personPageIndex === 1) {
              this.alumniBusiness = res.data.enterprises
            } else {
              if (res.data.enterprises.length === 0) {
                setScrollTop(getScrollTop() - 50)
                if (this.personPageIndex !== 1) {
                  Toast({
                    message: '没有更多数据了',
                    duration: 1000
                  })
                }
              }
              this.alumniBusiness = [...this.alumniBusiness, ...res.data.enterprises]
            }
          },
          reject: () => {
            this.personLoading = false
          }
        })
      },
      goEnterpriseCarte (id) {
        this.$router.push({name: 'EnterpriseCarte', params: {id: id}})
      },
      goClass (id) {
        this.$router.push({path: `/classes/${id}`})
      },
      goBack () {
        if (this.hasSearch || this.hasSearchEnterprise || this.hasSearchPerson) {
          this.queryParams = ''
          setScrollTop(0)
          this.productPageIndex = 1 // 从搜索结果返回，需要重置分页数(搜索成功后，会自动上拉加载一次[BUG]，导致分页pageIndex = 2)
          this.enterprisePageIndex = 1
          this.personPageIndex = 1
          this.getProducts('', 'price')
        } else if (getStore('Alumni_goHome')) {
          removeStore('Alumni_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      goScroll (scroll = 0) {
        setScrollTop(scroll)
      },
      goReport () {
        this.$router.push({name: 'Report', query: {resourceId: this.$store.state.teams.id, resourceClass: 'product'}})
      },
      goLogin () {
        setStore('beforeLogin', 'true')
        this.$router.push({name: 'Login'})
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
            this.placeholder = '搜索校友班级'
            break
          case 3:
            this.placeholder = '搜索校友企业'
            break
          default:
            this.placeholder = '搜索产品'
            break
        }
        this.handleSearchBar()
      },
      search (res) {
        document.activeElement.blur()
        switch (this.activeIndex) {
          case 0:
            this.productPageIndex = 1
            this.getProducts(res)
            break
          case 1:
            break
          case 2:
            this.enterprisePageIndex = 1
            this.getEnterpriseList(res)
            break
          case 3:
            if (getStore('user')) {
              this.personPageIndex = 1
              this.getAlumniBusiness(res)
            }
            break
          default:
            this.productPageIndex = 1
            this.getProducts(res)
        }
      },
      handleSearchBtn (res) {
        // 每次搜索需重置分页索引，并滚动到指定高度(让搜索框显示出来，表明这是搜索结果)
        setScrollTop(150)
        this.search(res)
      },
      handleSearchBar () {
        showBack((status) => {
          this.showGoTopBtn = status
          if (this.activeIndex === 1) {
            this.showSearchBar = false
          } else if (this.activeIndex === 0) {
            this.showSearchBar = status
            this.header = status ? '产品' : '名片'
          } else if (this.activeIndex === 2) {
            this.showSearchBar = status
            this.header = status ? '校友班级' : '名片'
          } else if (this.activeIndex === 3) {
            this.showSearchBar = status
            this.header = status ? '校友企业' : '名片'
          }
        }, this.height)
      },
      goProductDetail (item) {
        this.$router.push({name: 'ProductDetail', params: {id: item.id}})
      },
      goEnterpriseDetail (id) {
        if (!this.hasLogin) {
          // Toast('登录后才能查看协会详细信息')
          this.goLogin()
        } else {
          this.$router.push({name: 'EnterpriseDetail', params: {id: id}})
        }
      },
      iconClick (item) {
        switch (item.type) {
          case 'chat':
            if (!this.hasLogin) {
              setStore('beforeLogin', 'true')
              this.$router.push({name: 'Login'})
            } else {
              this.$router.push({name: 'Chat', query: {type: 'Product', productId: item.value}})
            }
            break
          case 'email':
            this.showPopDialog(2, '邮箱地址', item.value)
            break
          case 'weixin':
            this.showPopDialog(1, '微信号', item.value)
            break
          case 'website':
            window.location.href = item.value.indexOf('http') > -1 ? item.value : `http://${item.value}`
            break
          case 'qq':
            this.showPopDialog(0, 'QQ号', item.value)
            break
          case 'address':
            if (item.value.latitude && item.value.longitude) {
              this.$router.push({name: 'Maps', query: {lat: item.value.latitude, lng: item.value.longitude, title: this.$store.state.teams.company}})
            } else {
              this.$router.push({name: 'Maps', query: {lat: '', lng: '', title: this.$store.state.teams.company, address: item.value.address}})
            }
            break
        }
      },
      showPopDialog (type, name, value) {
        this.message = {
          type: type,
          name: name,
          value: value
        }
        this.showDialog = true
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
      loadProductBottom () {
        this.productPageIndex += 1
        this.getProducts()
      },
      loadEnterpriseBottom () {
        this.enterprisePageIndex += 1
        this.getEnterpriseList()
      },
      loadPersonBottom () {
        this.personPageIndex += 1
        if (getStore('user')) {
          this.getAlumniBusiness()
        }
      },
      closeDialog () {
        this.showDialog = false
      },
      favoriteAction () {
        if (!this.hasLogin) {
          setStore('beforeLogin', 'true')
          this.$router.push({name: 'Login'})
        } else if (!this.hasAddFavorites) {
          this.favoriteRequest()
        } else {
          Toast({
            message: '您已将该校友会添加收藏，无需重复添加',
            duration: 1000
          })
        }
      },
      favoriteRequest () {
        this.$store.dispatch('commonAction', {
          url: '/favorites',
          method: 'post',
          params: {},
          data: {
            token: this.token,
            team_id: this.teamId
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.favorites && res.data.favorites.id === parseInt(this.teamId)) {
              this.hasAddFavorites = true
              this.favoratesText = '已收藏'
              Toast({
                message: '你已成功收藏该校友会',
                className: 'toast-content',
                iconClass: 'iconfont icon-caozuochenggong toast-icon-big',
                duration: 1000
              })
            } else {
              Toast({
                message: '收藏该校友会失败',
                duration: 1000
              })
            }
          },
          reject: () => {
          }
        })
      },
      handleFavoriteStatus (id) {
        if (this.hasLogin) {
          this.getTeamDetail(id)
        }
      },
      async getTeamDetail (id) {
        let { res } = await requestFn({
          url: `/enterprises/${id}/details`,
          params: {
            token: this.token
          }
        })
        if (res.data) {
          this.hasAddFavorites = res.data.enterprises.organization.favorable
          this.favoratesText = res.data.enterprises.organization.favorable ? '已收藏' : '收藏'
        }
      }
    },
    mounted () {
      removeStore('beforeLogin')
      this.getEnterpriseDetail()
      this.handleSearchBar()
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

</style>
