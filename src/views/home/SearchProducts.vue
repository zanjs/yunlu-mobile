<template>
  <section>
    <product-search-bar
      :can-clear="searchParams"
      @clear="resetSearchBar()"
      @search="searchProducts(searchParams)"
      @back="goBack()">
      <input
        slot="input"
        class="search-input"
        v-model="searchParams"
        placeholder="搜一搜">
    </product-search-bar>
    <hot-tags
      v-if="!hasSearch"
      :tags="tags"
      class="tags-area"
      @click="goLink">
    </hot-tags>
  </section>
</template>

<script>
  import ProductSearchBar from '../../components/product/Search'
  import HotTags from '../../components/product/HotTags'
  import { getStore, removeStore } from '../../config/mUtils'
  export default {
    data () {
      return {
        searchParams: '',
        hasSearch: false,
        tags: [
          {
            name: '百石堂',
            url: 'http://www.360stones.com/'
          }, {
            name: '淘宝',
            url: 'https://m.taobao.com/'
          }, {
            name: '京东',
            url: 'https://m.jd.com/'
          }, {
            name: '天猫',
            url: 'https://m.tmall.com/'
          }, {
            name: '美团',
            url: 'https://i.meituan.com/'
          }, {
            name: '58同城',
            url: 'https://m.58.com/'
          }, {
            name: '携程',
            url: 'https://m.ctrip.com/'
          }
        ]
      }
    },
    components: {
      ProductSearchBar,
      HotTags
    },
    methods: {
      resetSearchBar () {
        this.searchParams = ''
        this.hasSearch = false
      },
      searchProducts (params = '') {
        this.hasSearch = true
        console.log(params)
      },
      goLink (item) {
        window.location.href = item.url
      },
      goBack () {
        if (getStore('SearchProducts_goHome')) {
          removeStore('SearchProducts_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      }
    },
    mounted () {

    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .search-input {
    flex: 1;
    border: none;
    @include px2rem(height, 68px);
    background-color: #EDEDED;
    @include px2rem(border-radius, 14px);
    color: #595959;
    @include font-dpr(14px);
    @include pm2rem(padding, 0px, 80px, 0px, 30px);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    ::-webkit-input-placeholder{
      color: #C2C2C2;
      @include px2rem(height, 70px);
      vertical-align: middle;
      text-align: left;
      border: none;
      @include font-dpr(14px);
      line-height: 1;
    }
  }
  .tags-area {
    @include px2rem(padding-top, 98px);
  }
</style>
