<template>
  <section>
    <mt-header title="企业"
               fixed
               class="header">
      <mt-button slot="left"
                 @click="goBack()"
                 class="button-text">
        <i class="iconfont icon-fanhui"></i>
      </mt-button>
    </mt-header>
    <search
      :placeholder="placeholder"
      @search="getEnterprises">
    </search>
    <mt-loadmore
            :top-method="loadEnterpriseTop"
            :bottom-method="loadEnterpriseBottom"
            :bottom-pull-text="bottomPullText"
            :bottom-drop-text="bottomDropText"
            :auto-fill="false"
            ref="loadMoreEnterprises">
    <list
      class="list"
      :store="allEnterprises"
      @click="goEnterpriseCarte"></list>
    </mt-loadmore>
  </section>
</template>

<script>
  import Search from '../../components/common/Search.vue'
  import List from '../../components/enterprise/List.vue'
  import { mapGetters } from 'vuex'
  import { setStore } from '../../config/mUtils'
  export default {
    data () {
      return {
        placeholder: '请输入企业名称',
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
            if (this.enterprisePageIndex === 1 || q !== '') {
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
        if (item.organization.service.aliaz === 'association') {
          setStore('comityCarteParams', {teamId: item.organization.id})
          this.$router.push({name: 'ComityCarte', params: {teamId: item.organization.id}})
        } else {
          setStore('enterpriseCarteParams', {teamId: item.organization.id})
          this.$router.push({name: 'EnterpriseCarte', params: {teamId: item.organization.id}})
        }
      },
      goBack () {
        this.$router.push({name: 'Home', params: {}})
      },
      loadEnterpriseTop () {
        this.enterprisePageIndex = 1
        this.hasPullUpEnterprise = true // 列表数量较少时，下拉刷新需要重置位置
        this.getEnterprises()
      },
      loadEnterpriseBottom () {
        this.enterprisePageIndex += 1
        this.getEnterprises()
      }
    },
    mounted () {
      this.getEnterprises()
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
    @include px2rem(padding-top, 170px);
  }
</style>
