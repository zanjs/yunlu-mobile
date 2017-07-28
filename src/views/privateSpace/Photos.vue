<template>
  <section>
    <common-header
      :title="headerName"
      @back="goBack()">
    </common-header>
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
          <gallery
            :data-source="photos"
            @click="showFullScreenPreview">
          </gallery>
        </div>
      </mt-loadmore>
    </section>
    <template v-if="showPreview">
      <div class="option-bar">
        <div class="left">
          <div
            class="close"
            @click="closePreview()">
            <i class="iconfont icon-fanhui"></i>
          </div>
          <span class="page-nav">{{currentIndex}}/{{photos.length}}</span>
        </div>
        <div
          class="report"
          @click="goReport">
          <i class="iconfont icon-jubao"></i>
        </div>
      </div>
      <swiper
        :options="swiperOption"
        class="full-screen-swiper">
        <!-- slides -->
        <swiper-slide
          class="swiper-zoom-container full-screen-bg"
          v-for="(item, index) in photos"
          :key="item.url">
          <img
            v-lazy="item.url"
            alt="">
        </swiper-slide>
      </swiper>
    </template>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import Gallery from '../../components/common/Gallery'
  import { getStore, removeStore } from '../../config/mUtils'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        headerName: this.$route.query.name,
        id: this.$route.params.id,
        p: this.$route.query.p || '',
        pageIndex: 1,
        pageSize: 24,
        token: getStore('user') ? getStore('user').authentication_token : '',
        photos: [],
        bottomPullText: '上拉加载更多',
        bottomDropText: '释放加载',
        topDistance: 10,
        showPreview: false,
        currentIndex: 1,
        swiperOption: {
          notNextTick: false,
          autoplay: 0,
          direction: 'horizontal',
          grabCursor: true,
          setWrapperSize: true,
          autoHeight: false,
          paginationClickable: false,
          prevButton: null,
          nextButton: null,
          mousewheelControl: true,
          observeParents: true,
          // 如果自行设计了插件，那么插件的一些配置相关参数，也应该出现在这个对象中，如下debugger
          debugger: true,
          preventClicks: false,
          passiveListeners: false,
          zoom: true,
          height: window.innerHeight,
          width: window.innerWidth,
          touchAngle: 45,
          initialSlide: 0,
          onSlideChangeEnd: (swiper) => {
            this.currentIndex = swiper.activeIndex + 1
          }
        }
      }
    },
    components: {
      CommonHeader,
      Gallery,
      swiper,
      swiperSlide
    },
    methods: {
      beforeGetData () {
        if (this.p) {
          this.getData('/shares/photos', {p: this.p, id: this.id, page: this.pageIndex, per_page: this.pageSize})
        } else {
          this.shouldLogin()
        }
      },
      getData (url, params) {
        this.$store.dispatch('commonAction', {
          url: url,
          method: 'get',
          params: params,
          target: this,
          resolve: (state, res) => {
            if (this.pageIndex === 1) {
              this.photos = res.data.photos
              // photos为空时，上拉加载、下拉刷新组件未初始化，不能直接调用它的重置位置方法
              if (this.$refs.loadMorePhotos && this.$refs.loadMorePhotos.onTopLoaded) {
                this.$refs.loadMorePhotos.onTopLoaded()
              }
            } else {
              if (res.data.photos.length === 0 || url === '/shares/photos') {
                Toast({
                  message: '没有更多数据了',
                  duration: 1000
                })
              } else {
                this.photos = [...this.photos, ...res.data.photos]
              }
              if (this.$refs.loadMorePhotos && this.$refs.loadMorePhotos.onBottomLoaded) {
                this.$refs.loadMorePhotos.onBottomLoaded()
              }
            }
          },
          reject: () => {
          }
        })
      },
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
                Toast({
                  message: '没有更多数据了',
                  duration: 1000
                })
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
        this.beforeGetData()
      },
      loadPhotosBottom () {
        this.pageIndex += 1
        this.beforeGetData()
      },
      showFullScreenPreview (index) {
        this.currentIndex = index + 1
        this.swiperOption.initialSlide = index
        this.showPreview = true
        this.stopTouchMove()
      },
      closePreview () {
        this.showPreview = false
        this.allowTouchMove()
      },
      stopTouchMove () {
        let self = this
        document.getElementById('app').addEventListener('touchmove', (e) => { // 监听滚动事件
          if (self.showPreview) {
            e.preventDefault() // 最关键的一句，禁止浏览器默认行为
          }
        })
      },
      allowTouchMove () {
        let self = this
        document.getElementById('app').removeEventListener('touchmove', (e) => { // 监听滚动事件
          if (self.showPreview) {
            e.preventDefault()
          }
        })
      },
      goReport () {
        this.$router.push({name: 'Report', query: {resourceId: this.photos[this.currentIndex - 1].id, resourceClass: 'photo', backUrl: 'Photos'}})
      },
      shouldLogin () {
        if (!this.token) {
          let toast = Toast({
            message: `您未登录，正在转入登录页`
          })
          setTimeout(() => {
            toast.close()
            this.$router.push({name: 'Login'})
          }, 2000)
        } else {
          this.getData(`/galleries/${this.id}/photos`, {token: this.token, page: this.pageIndex, per_page: this.pageSize})
        }
      }
    },
    mounted () {
      this.beforeGetData()
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

.container {
    @include px2rem(padding-top, 88px);
  }
  .option-bar {
    position: fixed;
    @include px2rem(top, 38px);
    width: 100%;
    max-width: 540px;
    z-index: 1004;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      align-items: center;
      .page-nav {
        background-color: rgba(0, 0, 0, .5);
        color: white;
        z-index: 1003;
        @include font-dpr(20px);
        @include pm2rem(padding, 4px, 10px, 4px, 10px);
        @include px2rem(border-radius, 10px);
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .close {
        @include pm2rem(padding, 4px, 10px, 4px, 10px);
        @include px2rem(border-radius, 10px);
        @include pm2rem(margin, 0px, 30px, 0px, 30px);
        background-color: rgba(0, 0, 0, .5);
        color: white;
        z-index: 1003;
        display: flex;
        align-items: center;
        i {
          @include font-dpr(20px);
        }
      }
    }
    .report {
      @include pm2rem(padding, 4px, 10px, 4px, 10px);
      @include px2rem(border-radius, 10px);
      @include pm2rem(margin, 0px, 30px, 0px, 30px);
      background-color: rgba(0, 0, 0, .5);
      color: white;
      z-index: 1003;
      display: flex;
      align-items: center;
      i {
        @include font-dpr(20px);
      }
    }
  }
  .full-screen-swiper {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1002;
    background-color: #000;
  }
  .full-screen-bg {
    background-color: #000;
    img[lazy=loading] {
      width: inherit;
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      background-position: center center!important;
      background: url("../../assets/imgLoading3.jpg");
      background-repeat: no-repeat;
      background-size: cover;
    }
    img[lazy=error] {
      width: inherit;
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      background-position: center center!important;
      background: url("../../assets/imgLoading3.jpg");
      background-repeat: no-repeat;
      background-size: cover;
    }
    img[lazy=loaded] {
      width: inherit;
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }
</style>
