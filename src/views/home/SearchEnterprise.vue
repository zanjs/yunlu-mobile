<template>
  <section class="full-width">
    <common-header
      :title="title"
      @back="goBack()">
    </common-header>
    <search :show="true" @search="getEnterprises(searchParams)">
      <input
        slot="input"
        type="search"
        @input="handleInput"
        @keyup.enter.prevent="handleSearch(searchParams)"
        v-model="searchParams"
        :placeholder="placeholder">
    </search>
    <div
      class="list full-width"
      ref="searchEnterprise"
      :style="{height: scrollHeight}">
      <template v-if="loading || allEnterprises && allEnterprises.length > 0">
        <list
          :store="allEnterprises"
          :loading="loading"
          :num="enterprisePageSize"
          @click="goEnterpriseCarte">
        </list>
        <mugen-scroll
          :handler="loadEnterpriseBottom"
          :handle-on-mount="false"
          :should-handle="!loading"
          scroll-container="searchEnterprise">
          <div class="loading">
            <mt-spinner
              v-show="!noMoreData"
              type="snake"
              :size="18">
            </mt-spinner>
            <p>{{loadingText}}</p>
          </div>
        </mugen-scroll>
      </template>
      <template v-else>
        <div class="empty-products">
          <div class="img-container">
            <img src="../../assets/noSearchProducts.png">
          </div>
          <p class="third-text font-16">SORRY! 暂没有找到符合条件的信息</p>
        </div>
      </template>
    </div>
    <back-to-top
      :show="showGoTopBtn"
      @click="goScroll(0)">
    </back-to-top>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import Search from '../../components/common/Search'
  import List from '../../components/enterprise/List'
  import BackToTop from '../../components/common/BackToTop'
  import { getStore, removeStore, showBack, setScrollTop } from '../../config/mUtils'
  import { requestFn } from '../../config/request'
  import MugenScroll from 'vue-mugen-scroll'
  export default {
    name: 'SearchEnterprise',
    data () {
      return {
        title: '企业',
        placeholder: '请输入企业名称',
        searchParams: this.$route.query.q || '',
        hasSearch: false,
        enterprisePageIndex: 1,
        enterprisePageSize: 10,
        height: 160, // 向上滚动到160px，就显示回到顶部按钮
        showGoTopBtn: false,
        exclude_service_ids: [], // 企业搜索需要过滤掉班级,页面维护一套services数组，里面包含了所有服务类型
        loading: true,
        loadingText: '加载中...',
        noMoreData: false,
        scrollHeight: '15rem',
        scrollActive: false,
        allEnterprises: []
      }
    },
    components: {
      Search,
      List,
      CommonHeader,
      BackToTop,
      MugenScroll
    },
    methods: {
      async getServices () {
        let {res} = await requestFn({url: '/services'})
        if (res.data) {
          this.exclude_service_ids = this.handleExcludeServiceIds(res.data.services)
          this.getEnterprises(this.searchParams)
        }
      },
      handleExcludeServiceIds (arr) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          // 只过滤班级(班级的别名为class)
          if (arr[i].aliaz === 'class') {
            tmpArr.push(arr[i].id)
          }
        }
        return tmpArr
      },
      async getEnterprises (q = '') {
        this.loading = true
        let {res} = await requestFn({
          url: '/enterprises',
          params: {
            page: this.enterprisePageIndex,
            per_page: this.enterprisePageSize,
            keyword: q,
            exclude_service_ids: this.exclude_service_ids
          }
        })
        if (res.data) {
          this.hasSearch = q !== ''
          if (res.data.enterprises.length < this.enterprisePageSize) {
            this.noMoreData = true
            this.loadingText = '没有更多数据了...'
          }
          if (this.enterprisePageIndex === 1) {
            setScrollTop(0, this.$refs.searchEnterprise)
            this.allEnterprises = res.data.enterprises
          } else {
            this.allEnterprises = [...this.allEnterprises, ...res.data.enterprises]
          }
        }
        this.loading = false
      },
      resetSearchBar () {
        this.searchParams = ''
        this.hasSearch = false
        this.loading = true
        this.enterprisePageIndex = 1
        this.noMoreData = false
        this.loadingText = '加载中...'
        this.throttle(this.getEnterprises, this)
        setScrollTop(0, this.$refs.searchEnterprise)
      },
      // 节流函数
      throttle (method, context) {
        clearTimeout(method.tId)
        method.tId = setTimeout(() => {
          method.call(context)
        }, 500)
      },
      handleInput (e) {
        if (e.target.value === '') {
          this.resetSearchBar()
        }
        this.enterprisePageIndex = 1
      },
      handleSearch (q) {
        this.getEnterprises(q)
        document.activeElement.blur()
      },
      goEnterpriseCarte (item) {
        if (!item.organization) {
          this.$router.push({name: 'EmptyEnterpriseCarte', query: {name: item.name}})
        } else if (item.organization.service.aliaz === 'association') {
          this.$router.push({name: 'ComityCarte', params: {id: item.organization.id}})
        } else if (item.organization.service.aliaz === 'school') {
          this.$router.push({name: 'Alumni', params: {id: item.organization.id}})
        } else if (item.organization.service.aliaz === 'class') {
          this.$router.push({name: 'Class', params: {id: item.organization.id}})
        } else if (item.organization.service.aliaz === 'mall') {
          this.$router.push({name: 'Mall', params: {id: item.organization.id}})
        } else {
          this.$router.push({name: 'EnterpriseCarte', params: {id: item.organization.id}})
        }
      },
      goBack () {
        if (this.hasSearch) {
          this.searchParams = ''
          this.getEnterprises()
        } else if (getStore('SearchEnterprise_goHome')) {
          removeStore('SearchEnterprise_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      // 滚动到页面指定位置
      goScroll (scroll = 0) {
        setScrollTop(scroll, this.$refs.searchEnterprise)
      },
      handleGoTopBtn () {
        if (!this.scrollActive) {
          showBack((status) => {
            this.showGoTopBtn = status
            this.scrollActive = true
          }, this.height, this.$refs.searchEnterprise)
        }
      },
      loadEnterpriseBottom () {
        if (!this.noMoreData) {
          this.enterprisePageIndex += 1
          this.getEnterprises(this.searchParams)
        }
      }
    },
    mounted () {
      let appHeight = document.getElementById('app').offsetHeight
      let rootFontSize = document.documentElement.style.fontSize.split('p')[0]
      let divHeight = (appHeight / parseFloat(rootFontSize + '')).toFixed(2)
      this.scrollHeight = `${Math.round(divHeight * 100) / 100}rem`
    },
    activated () {
      this.showGoTopBtn = false
      if (!this.$store.state.popState) {
        setScrollTop(0, this.$refs.searchEnterprise)
        this.enterprisePageIndex = 1
        this.loading = true
        this.searchParams = this.$route.query.q || ''
        this.hasSearch = false
        this.exclude_service_ids = []
        this.loadingText = '加载中...'
        this.noMoreData = false
        this.getServices()
        this.handleGoTopBtn()
      } else {
        setScrollTop(this.$store.state.scrollMap.SearchEnterprise || 0, this.$refs.searchEnterprise)
      }
    },
    beforeRouteLeave (to, from, next) {
      this.$store.dispatch('saveScroll', {name: 'SearchEnterprise', value: this.$refs.searchEnterprise.scrollTop})
      if (to.name === 'See') {
        this.allEnterprises = []
      }
      next()
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .list {
    position: relative;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    @include pm2rem(margin, 176px, 0px, 0px, 0px);
    .empty-products {
      text-align: center;
      .img-container {
        @include pm2rem(padding, 30px, 0px, 40px, 0px);
        img {
          width: 50%;
        }
      }
    }
    .loading {
      @include px2rem(height, 120px);
      @include font-dpr(15px);
      color: $second-dark;
      line-height: normal;
      display: flex;
      align-items: center;
      justify-content: center;
      p {
        @include px2rem(margin-left, 20px);
      }
    }
  }
</style>
