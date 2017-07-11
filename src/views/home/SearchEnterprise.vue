<template>
  <section>
    <mt-header
      title="企业"
      fixed
      class="header">
      <mt-button
        slot="left"
        @click="goBack()"
        class="button-text">
        <i class="iconfont icon-fanhui"></i>
      </mt-button>
    </mt-header>
    <search
      @search="getEnterprises(searchParams)">
      <input
        slot="input"
        type="text"
        v-model="searchParams"
        :placeholder="placeholder">
    </search>
    <div class="list">
      <mt-loadmore
        :top-method="loadEnterpriseTop"
        :bottom-method="loadEnterpriseBottom"
        :bottom-pull-text="bottomPullText"
        :bottom-drop-text="bottomDropText"
        :auto-fill="false"
        ref="loadMoreEnterprises">
        <list
          :store="allEnterprises"
          @click="goEnterpriseCarte">
        </list>
      </mt-loadmore>
    </div>
  </section>
</template>

<script>
  import Search from '../../components/common/Search.vue'
  import List from '../../components/enterprise/List.vue'
  import { mapGetters } from 'vuex'
  import { getStore, removeStore } from '../../config/mUtils'
  export default {
    data () {
      return {
        placeholder: '请输入企业名称',
        searchParams: this.$route.query.q || '',
        hasSearch: false,
        enterprisePageIndex: 1,
        enterprisePageSize: 10,
        bottomPullText: '上拉加载更多',
        bottomDropText: '释放加载',
        hasPullUpEnterprise: false
      }
    },
    components: {
      Search,
      List
    },
    methods: {
      getEnterprises (q = '') {
        this.$store.dispatch('commonAction', {
          url: '/enterprises',
          method: 'get',
          params: {
            page: this.enterprisePageIndex,
            per_page: this.enterprisePageSize,
            keyword: q
          },
          target: this,
          resolve: (state, res) => {
            this.hasSearch = q !== ''
            // this.searchParams = ''
            if (this.enterprisePageIndex === 1) {
              document.body.scrollTop = 0
              state.allEnterprises = res.data.enterprises
            } else {
              state.allEnterprises = [...state.allEnterprises, ...res.data.enterprises]
              this.$refs.loadMoreEnterprises.onBottomLoaded()
            }
            if (this.hasPullUpEnterprise) {
              this.$refs.loadMoreEnterprises.onTopLoaded()
              this.hasPullUpEnterprise = false
            }
          },
          reject: () => {
          }
        })
      },
      goEnterpriseCarte (item) {
        if (!item.organization) {
          this.$router.push({name: 'EmptyEnterpriseCarte', query: {name: item.name}})
        } else if (item.organization.service.aliaz === 'association') {
          this.$router.push({name: 'ComityCarte', params: {id: item.organization.id}})
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
      loadEnterpriseTop () {
        this.enterprisePageIndex = 1
        this.hasPullUpEnterprise = true // 列表数量较少时，下拉刷新需要重置位置
        this.getEnterprises(this.searchParams)
      },
      loadEnterpriseBottom () {
        this.enterprisePageIndex += 1
        this.getEnterprises(this.searchParams)
      }
    },
    mounted () {
      this.getEnterprises(this.searchParams)
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
  .list {
    @include px2rem(margin-top, 170px);
  }
</style>
