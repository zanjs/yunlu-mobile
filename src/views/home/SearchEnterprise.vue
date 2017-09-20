<template>
  <section>
    <common-header
      :title="title"
      @back="goBack()">
    </common-header>
    <search
      @search="getEnterprises(searchParams)">
      <input
        slot="input"
        type="search"
        @input="handleInput"
        @keyup.enter.prevent="handleSearch(searchParams)"
        v-model="searchParams"
        :placeholder="placeholder">
    </search>
    <div class="list">
      <template v-if="allEnterprises && allEnterprises.length > 0">
        <list
          :store="allEnterprises"
          @click="goEnterpriseCarte">
        </list>
        <mugen-scroll
          :handler="loadEnterpriseBottom"
          :handle-on-mount="false"
          :should-handle="!loading">
          <div
            v-if="loading"
            class="loading">
            <mt-spinner
              type="snake"
              :size="18">
            </mt-spinner>
            <p>加载中...</p>
          </div>
        </mugen-scroll>
        <back-to-top
          v-if="showGoTopBtn"
          @click="goTop()">
        </back-to-top>
      </template>
      <template v-if="allEnterprises && allEnterprises.length === 0">
        <div class="empty-products">
          <div class="img-container">
            <img src="../../assets/noSearchProducts.png">
          </div>
          <p class="third-text font-16">SORRY! 暂没有找到符合条件的信息</p>
        </div>
      </template>
    </div>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import Search from '../../components/common/Search'
  import List from '../../components/enterprise/List'
  import BackToTop from '../../components/common/BackToTop'
  import { mapGetters } from 'vuex'
  import { getStore, removeStore, showBack } from '../../config/mUtils'
  import { Toast } from 'mint-ui'
  import { requestFn } from '../../config/request'
  import MugenScroll from 'vue-mugen-scroll'
  export default {
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
        loading: false
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
        let {state, res} = await requestFn({
          url: '/enterprises',
          params: {
            page: this.enterprisePageIndex,
            per_page: this.enterprisePageSize,
            keyword: q,
            exclude_service_ids: this.exclude_service_ids
          }
        })
        this.loading = false
        if (res.data) {
          this.hasSearch = q !== ''
          if (this.enterprisePageIndex === 1) {
            document.documentElement.scrollTop = 0
            state.allEnterprises = res.data.enterprises
          } else {
            if (res.data.enterprises.length === 0) {
              // document.documentElement.scrollTop -= 41
              Toast({
                message: '没有更多数据了',
                duration: 1000
              })
            }
            state.allEnterprises = [...state.allEnterprises, ...res.data.enterprises]
          }
        }
      },
      resetSearchBar () {
        this.searchParams = ''
        this.hasSearch = false
        this.enterprisePageIndex = 1
        this.throttle(this.getEnterprises, this)
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
      goTop () {
        document.documentElement.scrollTop = 0
      },
      handleGoTopBtn () {
        showBack((status) => {
          this.showGoTopBtn = status
        }, this.height)
      },
      loadEnterpriseBottom () {
        this.enterprisePageIndex += 1
        this.getEnterprises(this.searchParams)
      }
    },
    mounted () {
      this.goTop()
      this.getServices()
      this.handleGoTopBtn()
    },
    computed: {
      ...mapGetters([
        'allEnterprises'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .list {
    @include pm2rem(padding, 176px, 0px, 10px, 0px);
    position: relative;
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
      height: 40px;
      @include font-dpr(15px);
      color: $second-dark;
      line-height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      p {
        @include px2rem(margin-left, 20px);
      }
    }
  }
</style>
