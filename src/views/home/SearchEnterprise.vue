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
        @keyup.enter="handleSearch(searchParams)"
        v-model="searchParams"
        :placeholder="placeholder">
    </search>
    <div class="list">
      <template v-if="allEnterprises && allEnterprises.length > 0">
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
          <p>SORRY! 暂没有找到符合条件的信息</p>
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
  export default {
    data () {
      return {
        title: '企业',
        placeholder: '请输入企业名称',
        searchParams: this.$route.query.q || '',
        hasSearch: false,
        enterprisePageIndex: 1,
        enterprisePageSize: 10,
        bottomPullText: '上拉加载更多',
        bottomDropText: '释放加载',
        height: 160, // 向上滚动到160px，就显示回到顶部按钮
        showGoTopBtn: false
      }
    },
    components: {
      Search,
      List,
      CommonHeader,
      BackToTop
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
            if (this.enterprisePageIndex === 1) {
              document.body.scrollTop = 0
              state.allEnterprises = res.data.enterprises
              if (this.$refs.loadMoreEnterprises && this.$refs.loadMoreEnterprises.onTopLoaded) {
                this.$refs.loadMoreEnterprises.onTopLoaded()
              }
            } else {
              if (res.data.enterprises === 0) {
                Toast({
                  message: '没有更多数据了',
                  duration: 1000
                })
              }
              state.allEnterprises = [...state.allEnterprises, ...res.data.enterprises]
              if (this.$refs.loadMoreEnterprises && this.$refs.loadMoreEnterprises.onBottomLoaded) {
                this.$refs.loadMoreEnterprises.onBottomLoaded()
              }
            }
          },
          reject: () => {
          }
        })
      },
      resetSearchBar () {
        this.searchParams = ''
        this.hasSearch = false
        this.pageIndex = 1
        this.getEnterprises()
      },
      handleInput () {
        if (this.searchParams === '') {
          this.resetSearchBar()
        }
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
        document.body.scrollTop = 0
      },
      handleGoTopBtn () {
        showBack((status) => {
          this.showGoTopBtn = status
        }, this.height)
      },
      loadEnterpriseTop () {
        this.enterprisePageIndex = 1
        this.getEnterprises(this.searchParams)
      },
      loadEnterpriseBottom () {
        this.enterprisePageIndex += 1
        this.getEnterprises(this.searchParams)
      }
    },
    mounted () {
      this.getEnterprises(this.searchParams)
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

  input[type=search]::-webkit-search-cancel-button {
    -webkit-appearance: none; // 此处只是去掉默认的小×
  }
  .list {
    @include px2rem(padding-top, 170px);
    position: relative;
    .float-btn {
      position: fixed;
      @include px2rem(bottom, 76px);
      display: block;
      width: 100%;
      max-width: 540px;
      .cirlce-btn {
        float: right;
        @include px2rem(width, 100px);
        @include px2rem(height, 100px);
        @include px2rem(border-radius, 50px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        @include px2rem(margin-right, 40px);
        color: $white;
        background-color: rgba(0, 0, 0, .68);
        line-height: 1;
        z-index: 1004;
        i {
          @include font-dpr(21px);
        }
        p {
          @include font-dpr(12px);
        }
      }
    }
    .empty-products {
      color: #A6A6A6;
      .img-container {
        text-align: center;
        @include pm2rem(padding, 30px, 0px, 40px, 0px);
        img {
          width: 50%;
        }
      }
      p {
        @include font-dpr(16px);
        text-align: center;
      }
    }
  }
</style>
