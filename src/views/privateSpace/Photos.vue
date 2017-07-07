<template>
  <section>
    <mt-header :title="headerName"
               fixed
               class="header">
      <mt-button slot="left"
                 @click="goBack()"
                 class="button-text">
        <i class="iconfont icon-fanhui"></i>
      </mt-button>
    </mt-header>
    <section class="container">
      <mt-loadmore
        :top-method="loadPhotosTop"
        :bottom-method="loadPhotosBottom"
        :bottom-pull-text="bottomPullText"
        :bottom-drop-text="bottomDropText"
        :top-distance="topDistance"
        :auto-fill="false"
        ref="loadMorePhotos">
        <div class="photos-container">
          <gallery :data-source="photos"></gallery>
        </div>
      </mt-loadmore>
    </section>
  </section>
</template>

<script>
  import Gallery from '../../components/common/Gallery'
  import { getStore, removeStore } from '../../config/mUtils'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        headerName: this.$route.query.name,
        id: this.$route.params.id,
        pageIndex: 1,
        pageSize: 24,
        token: getStore('user') ? getStore('user').authentication_token : '',
        photos: [],
        bottomPullText: '上拉加载更多',
        bottomDropText: '释放加载',
        topDistance: 10
      }
    },
    components: {
      Gallery
    },
    methods: {
      getPhotos () {
        this.$store.dispatch('commonAction', {
          url: `/galleries/${this.id}/photos`,
          method: 'get',
          params: {
            token: this.token,
            page: this.pageIndex,
            per_page: this.pageSize
          },
          target: this,
          resolve: (state, res) => {
            if (this.pageIndex === 1) {
              this.photos = res.data.photos
              // photos为空时，上拉加载、下拉刷新组件未初始化，不能直接调用它的重置位置方法
              if (this.$refs.loadMorePhotos && this.$refs.loadMorePhotos.onTopLoaded) {
                this.$refs.loadMorePhotos.onTopLoaded()
              }
            } else {
              if (res.data.photos.length === 0) {
                Toast('没有更多数据了')
              }
              this.photos = [...this.photos, ...res.data.photos]
              if (this.$refs.loadMorePhotos && this.$refs.loadMorePhotos.onBottomLoaded) {
                this.$refs.loadMorePhotos.onBottomLoaded()
              }
            }
          },
          reject: () => {
          }
        })
      },
      goBack () {
        if (getStore('Photos_goHome')) {
          removeStore('Photos_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      loadPhotosTop () {
        this.pageIndex = 1
        this.getPhotos()
      },
      loadPhotosBottom () {
        this.pageIndex += 1
        this.getPhotos()
      }
    },
    mounted () {
      this.getPhotos()
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .header {
    background-color: $green;
    @include px2rem(height, 88px);
    @include font-dpr(17px);
    position: fixed;
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
    @include px2rem(padding-top, 88px);
  }
</style>
