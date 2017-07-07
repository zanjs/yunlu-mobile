<template>
  <section class="container">
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
        @click="goReport()"
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
        <template v-if="activeIndex === 1">
          <template
            v-if="enterpriseInfoFiles && enterpriseInfoFiles.length > 0">
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
        <template v-if="activeIndex === 2">
          <template
            v-if="enterpriseMembers && enterpriseMembers.length > 0">
            <mt-loadmore
              :top-method="loadEnterpriseTop"
              :bottom-method="loadEnterpriseBottom"
              :bottom-pull-text="bottomPullText"
              :bottom-drop-text="bottomDropText"
              :auto-fill="false"
              ref="loadMoreEnterprises">
              <transition
                name="fade"
                :appear="true"
                mode="out-in">
                <enterprise-list
                  :store="enterpriseMembers"
                  @click="goEnterpriseCarte">
                </enterprise-list>
              </transition>
            </mt-loadmore>
          </template>
          <div
            v-else
            class="no-data">
            <img src="../../assets/noEnterprise.png">
          </div>
        </template>
        <template v-if="activeIndex === 3">
          <template v-if="hasLogin">
            <template v-if="personMembers && personMembers.length > 0">
              <mt-loadmore
                :top-method="loadPersonTop"
                :bottom-method="loadPersonBottom"
                :bottom-pull-text="bottomPullText"
                :bottom-drop-text="bottomDropText"
                :auto-fill="false"
                ref="loadMorePeople">
                <transition
                  name="fade"
                  :appear="true"
                  mode="out-in">
                  <person-list
                    :store="personMembers"
                    @click="goPersonCarte">
                  </person-list>
                </transition>
              </mt-loadmore>
            </template>
            <div
              v-else
              class="no-data">
              <img src="../../assets/noPerson.png">
            </div>
          </template>
          <template v-else>
            <div class="tips-container">
              <p>登录后才能查看</p>
              <div class="login-btn">
                <a @click="goLogin()">登录</a>
              </div>
            </div>
          </template>
        </template>
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
        v-show="showSearchBar && activeIndex === 0"
        :order-up="orderUp"
        :show-list="showList"
        @order-change="orderChange"
        @switch="showListChange">
      </order>
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
        token: getStore('user') ? getStore('user').authentication_token : '',
        header: '名片',
        height: 153,
        hasLogin: !!getStore('user'),
        hasSearch: false,
        hasSearchEnterprise: false,
        hasSearchPerson: false,
        showSearchBar: false,
        placeholder: '搜索产品',
        productPageIndex: 1,
        productPageSize: 10,
        productLoaded: false,
        enterprisePageIndex: 1,
        enterprisePageSize: 10,
        hasPullUpEnterprise: false,
        personPageIndex: 1,
        personPageSize: 20,
        hasPullUpPerson: false,
        bottomPullText: '上拉加载更多',
        bottomDropText: '释放加载',
        queryParams: '',
        productOrder: 1,
        orderUp: true,
        showList: false,
        activeIndex: 0
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
            team_id: this.teamId, // 生产环境的一个企业
            page: this.productPageIndex,
            per_page: this.productPageSize,
            sort: order || '',
            q: q || ''
          },
          target: this,
          resolve: (state, res) => {
            this.hasSearch = q !== ''
            // this.queryParams = ''
            let tmpArr = this.handleProductThumbnails(res.data.products)
            this.getFilesPublisheds(tmpArr, res.data.products, q)
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
            if (this.productPageIndex === 1 || q !== '') {
              state.products = this.handleProducts(arr, res.data.files)
              state.productsThumbnails = res.data.files
              // products为空时，上拉加载、下拉刷新组件未初始化，不能直接调用它的重置位置方法
              if (this.$refs.loadMoreProducts && this.$refs.loadMoreProducts.onTopLoaded) {
                this.$refs.loadMoreProducts.onTopLoaded()
              }
            } else {
              if (res.data.files.length === 0) {
                Toast('没有更多数据了')
              }
              state.products = [...state.products, ...this.handleProducts(arr, res.data.files)]
              state.productsThumbnails = [...state.productsThumbnails, ...res.data.files]
              if (this.$refs.loadMoreProducts && this.$refs.loadMoreProducts.onBottomLoaded) {
                this.$refs.loadMoreProducts.onBottomLoaded()
              }
            }
            this.getEnterpriseDocument()
          },
          reject: (state, error) => {
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
            // this.queryParams = ''
            if (this.enterprisePageIndex === 1 || q !== '') {
              state.enterpriseMembers = res.data.members
            } else {
              if (res.data.members.length === 0) {
                Toast('没有更多数据了')
              }
              state.enterpriseMembers = [...state.enterpriseMembers, ...res.data.members]
              this.$refs.loadMoreEnterprises.onBottomLoaded()
            }
            if (this.hasPullUpEnterprise) {
              this.$refs.loadMoreEnterprises.onTopLoaded()
              this.hasPullUpEnterprise = false
            }
            if (getStore('user')) {
              this.getPersonList()
            }
          },
          reject: () => {
          }
        })
      },
      getPersonList (q = this.queryParams) {
        this.queryParams = q
        this.$store.dispatch('commonAction', {
          url: `/team/${this.teamId}/members`,
          method: 'get',
          params: {
            team_id: this.teamId,
            token: this.token,
            states: ['accepted'],
            page: this.personPageIndex,
            per_page: this.personPageSize,
            q: q
          },
          target: this,
          resolve: (state, res) => {
            this.hasSearchPerson = q !== ''
            // this.queryParams = ''
            if (this.personPageIndex === 1 || q !== '') {
              state.personMembers = res.data.preps
            } else {
              if (res.data.preps.length === 0) {
                Toast('没有更多数据了')
              }
              state.personMembers = [...state.personMembers, ...res.data.preps]
              this.$refs.loadMorePeople.onBottomLoaded()
            }
            if (this.hasPullUpPerson) {
              this.$refs.loadMorePeople.onTopLoaded()
            }
          },
          reject: () => {
          }
        })
      },
      goEnterpriseCarte (id) {
        this.$router.push({name: 'EnterpriseCarte', query: {teamId: id}})
      },
      goPersonCarte (id) {
        this.$router.push({name: 'PersonCarte', params: {user_id: id}})
      },
      goBack () {
        if (this.hasSearch || this.hasSearchEnterprise || this.hasSearchPerson) {
          this.queryParams = ''
          document.body.scrollTop = 0
          this.getProducts('', 'price')
        } else if (getStore('ComityCarte_goHome')) {
          removeStore('ComityCarte_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      goReport () {
        document.body.scrollTop = 0
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
            if (getStore('user')) {
              this.getPersonList(res)
            }
            break
          default:
            this.getProducts(res)
        }
      },
      handleSearchBar () {
        showBack((status) => {
          if (this.activeIndex === 1) {
            this.showSearchBar = false
          } else if (this.activeIndex === 0) {
            this.showSearchBar = status
            this.header = status ? '产品' : '名片'
          } else if (this.activeIndex === 2) {
            this.showSearchBar = status
            this.header = status ? '企业会员' : '名片'
          } else if (this.activeIndex === 3) {
            this.showSearchBar = status
            this.header = status ? '个人会员' : '名片'
          }
        }, this.height)
      },
      goProductDetail (item) {
        document.body.scrollTop = 0
        this.$router.push({name: 'ProductDetail', params: {id: item.id}})
      },
      goEnterpriseDetail (id) {
        if (!this.hasLogin) {
          // Toast('登录后才能查看协会详细信息')
          this.goLogin()
        } else {
          this.$router.push({name: 'EnterpriseDetail', query: {teamId: id}})
        }
      },
      iconClick (item) {
        switch (item.type) {
          case 'email':
            // this.linkToast('协会', '邮箱地址', item.value)
            this.showMessageBox(item.value)
            break
          case 'weixin':
            // this.linkToast('协会', '微信号', item.value)
            this.showMessageBox(item.value)
            break
          case 'website':
            // this.linkToast('协会', '网址', item.value)
            window.location.href = item.value.indexOf('http') > -1 ? item.value : `http://${item.value}`
            // this.showMessageBox(item.value)
            break
          case 'qq':
            // window.location.href = `http://wpa.qq.com/msgrd?v=3&uin=${item.value}&site=qq&menu=yes`
            // this.linkToast('协会', 'QQ账号', item.value)
            this.showMessageBox(item.value)
            break
          case 'address':
            this.$router.push({name: 'Maps', query: {lat: item.value.latitude, lng: item.value.longitude, title: this.$store.state.teams.company}})
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
        this.$router.push({name: 'InformationFolders', query: {teamId: this.teamId, type: item.name}})
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
      },
      loadEnterpriseTop () {
        this.enterprisePageIndex = 1
        this.hasPullUpEnterprise = true // 列表数量较少时，下拉刷新需要重置位置
        this.getEnterpriseList()
      },
      loadEnterpriseBottom () {
        this.enterprisePageIndex += 1
        this.getEnterpriseList()
      },
      loadPersonTop () {
        this.personPageIndex = 1
        this.hasPullUpPerson = true // 列表数量较少时，手动重置下拉刷新位置
        if (getStore('user')) {
          this.getPersonList()
        }
      },
      loadPersonBottom () {
        this.personPageIndex += 1
        if (getStore('user')) {
          this.getPersonList()
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
  .container {
    @include px2rem(min-height, 1344px);
    background-color: $white;
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
  .tips-container {
    background-color: $white;
    @include pm2rem(padding, 100px, 0px, 100px, 0px);
     p {
        color: grey;
        text-align: center;
        display: block;
      }
    .login-btn {
      text-align: center;
      margin: 0 auto;
      @include px2rem(margin-top,60px);
      a {
        color: $white;
        display: block;
        margin: 0 auto;
        @include px2rem(height, 70px);
        @include px2rem(line-height, 70px);
        @include font-dpr(13px);
        background-color: #52CAA7;
        @include px2rem(width, 550px);
      }
      a:active {
        background-color: rgba(82, 202, 167, .5);
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
