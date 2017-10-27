<template>
  <section
    class="wrapper full-width"
    ref="photos"
    :style="{height: scrollHeight}">
    <common-header
      :title="headerName"
      @back="goBack()">
    </common-header>
    <transition
      name="fade"
      :appear="true"
      mode="out-in">
      <section
        v-if="photos && photos.length > 0"
        class="container">
        <gallery
          :data-source="photos"
          @click="showFullScreenPreview">
        </gallery>
        <mugen-scroll
          :handler="loadPhotosBottom"
          :handle-on-mount="false"
          :should-handle="!photoLoading"
          scroll-container="photos">
          <div
            v-if="photoLoading || noMoreData"
            class="loading">
            <mt-spinner
              v-if="photoLoading"
              type="snake"
              :size="18">
            </mt-spinner>
            <p>{{photoLoadingText}}</p>
          </div>
        </mugen-scroll>
      </section>
      <template v-else>
        <div class="empty">
          <div class="no-data">
            <img src="../../assets/noFile.png">
          </div>
        </div>
      </template>
    </transition>
    <div v-show="showPreview">
      <div class="option-bar full-width">
        <div class="left">
          <div
            class="close"
            @click="closePreview()">
            <i class="iconfont icon-fanhui"></i>
          </div>
          <span class="page-nav flex">{{currentIndex}}/{{photos.length}}</span>
        </div>
        <div
          class="report"
          @click="goReport">
          <i class="iconfont icon-jubao"></i>
        </div>
      </div>
      <swiper
        :options="swiperOption"
        class="full-screen-swiper"
        ref="mySwiper">
        <!-- slides -->
        <swiper-slide
          class="swiper-zoom-container full-screen-bg"
          v-for="(item, index) in previewPhotos"
          :key="item.url">
          <img
            v-lazy="{
              src: item.url,
              error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
              loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
            }"
            alt="">
        </swiper-slide>
      </swiper>
    </div>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import Gallery from '../../components/common/Gallery'
  import { getStore, setStore, removeStore, setScrollTop } from '../../config/mUtils'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import { Toast } from 'mint-ui'
  import MugenScroll from 'vue-mugen-scroll'
  export default {
    name: 'Photos',
    props: ['id'],
    data () {
      return {
        headerName: this.$route.query.name,
        p: this.$route.query.p || '',
        pageIndex: 1,
        pageSize: 24,
        token: getStore('user') ? getStore('user').authentication_token : '',
        photos: [],
        previewPhotos: [],
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
          preloadImages: false,
          onSlideNextEnd: (swiper) => {
            this.currentIndex += 1
            if (swiper.isEnd) {
              if (this.photos.length - this.currentIndex >= this.pageSize - 2) {
                this.previewPhotos = this.photos.slice(this.currentIndex - 2, this.currentIndex + this.pageSize - 2)
                this.$refs.mySwiper.swiper.slideTo(1, 1, true)
              } else if (this.photos.length - this.currentIndex < this.pageSize - 2 && this.photos.length - this.currentIndex > 0) {
                this.previewPhotos = this.photos.slice(this.photos.length - this.pageSize, this.photos.length)
                this.$refs.mySwiper.swiper.slideTo(this.pageSize + this.currentIndex - 1 - this.photos.length, 1, true)
              } else if (this.photos.length - this.currentIndex === 0) {
                // do nothing
              } else {
                console.error(new Error('this.previewPhotos配置出错'))
              }
            }
          },
          onSlidePrevEnd: (swiper) => {
            this.currentIndex -= 1
            if (swiper.isBeginning) {
              if (this.currentIndex === 1 || this.photos.length <= this.pageSize) {
                // do nothind
              } else if (this.currentIndex <= this.pageSize && this.photos.length - this.currentIndex >= 1) {
                this.previewPhotos = this.photos.slice(0, this.pageSize)
                this.$refs.mySwiper.swiper.slideTo(this.currentIndex - 1, 1, true)
              } else if (this.currentIndex > this.pageSize && this.photos.length - this.currentIndex > 1) {
                this.previewPhotos = this.photos.slice(this.currentIndex - this.pageSize, this.currentIndex)
                this.$refs.mySwiper.swiper.slideTo(this.currentIndex - 1, 1, true)
              } else {
                console.error(new Error('未知错误'))
              }
            }
          }
        },
        photoLoading: false,
        photoLoadingText: '加载中...',
        scrollHeight: '17rem',
        noMoreData: false
      }
    },
    components: {
      CommonHeader,
      Gallery,
      swiper,
      swiperSlide,
      MugenScroll
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
        this.photoLoading = true
        this.$store.dispatch('commonAction', {
          url: url,
          method: 'get',
          params: params,
          target: this,
          resolve: (state, res) => {
            this.photoLoading = false
            if (this.pageIndex === 1) {
              this.photos = res.data.photos
            } else {
              if (res.data.photos.length === 0) {
                if (this.pageIndex !== 1) {
                  this.noMoreData = true
                  this.photoLoadingText = '没有更多数据了...'
                }
              }
              this.photos = [...this.photos, ...res.data.photos]
            }
          },
          reject: () => {
            this.photoLoading = false
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
      loadPhotosBottom () {
        if (!this.noMoreData) {
          this.pageIndex += 1
          this.beforeGetData()
        }
      },
      handlePreviewPhotos (index, arr, pageSize) {
        let tmpArr = []
        if (arr.length <= pageSize) {
          tmpArr = [...arr]
        } else if (index > 0 && arr.length - index >= pageSize) {
          tmpArr = arr.slice(index - 1, index + pageSize - 1)
        } else if (index === 0) {
          tmpArr = arr.slice(index, index + pageSize)
        } else if (index > 0 && arr.length - index < pageSize) {
          tmpArr = arr.slice(arr.length - index + 1, pageSize + arr.length - index + 1)
        }
        return tmpArr
      },
      showFullScreenPreview (index) {
        this.currentIndex = index + 1
        if (this.photos.length <= this.pageSize) {
          this.previewPhotos = [...this.photos]
          this.$refs.mySwiper.swiper.slideTo(index, 1, true)
        } else if (index > 0 && this.photos.length - index >= this.pageSize) {
          this.previewPhotos = this.photos.slice(index - 1, index + this.pageSize - 1)
          this.$refs.mySwiper.swiper.slideTo(1, 1, true)
        } else if (index === 0) {
          this.previewPhotos = this.photos.slice(index, index + this.pageSize)
          this.$refs.mySwiper.swiper.slideTo(0, 1, true)
        } else if (index > 0 && this.photos.length - index < this.pageSize) {
          this.previewPhotos = this.photos.slice(this.photos.length - this.pageSize, this.photos.length)
          this.$refs.mySwiper.swiper.slideTo(this.pageSize + index - this.photos.length, 1, true)
        }
        this.showPreview = true
      },
      closePreview () {
        this.showPreview = false
      },
      goReport () {
        this.$router.push({name: 'Report', query: {resourceId: this.photos[this.currentIndex - 1].id, resourceClass: 'photo'}})
      },
      goLogin () {
        setStore('beforeLogin', 'true')
        this.$router.push({name: 'Login'})
      },
      shouldLogin () {
        if (!this.token) {
          let toast = Toast({
            message: `您未登录，正在转入登录页`
          })
          setTimeout(() => {
            toast.close()
            this.goLogin()
          }, 2000)
        } else {
          this.getData(`/galleries/${this.id}/photos`, {token: this.token, page: this.pageIndex, per_page: this.pageSize})
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
      if (!this.$store.state.popState || this.$store.state.fromLogin) {
        setScrollTop(0, this.$refs.photos)
        this.beforeGetData()
      } else {
        setScrollTop(this.$store.state.scrollMap.Photos || 0, this.$refs.photos)
      }
    },
    beforeRouteLeave (to, from, next) {
      this.$store.dispatch('saveScroll', {name: 'Photos', value: this.$refs.photos.scrollTop})
      if (to.name !== 'Report') {
        this.pageIndex = 1
        this.currentIndex = 1
        this.photos = []
        this.previewPhotos = []
        this.noMoreData = false
        this.showPreview = false
      }
      next()
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .wrapper {
    position: absolute;
    top: 0;
    overflow-y: scroll;
    padding-bottom: 1px;
    background-color: $tenth-grey;
  }
  .container {
    @include pm2rem(padding, 88px, 0px, 10px, 0px);
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
  .empty {
    @include px2rem(padding-top, 88px);
  }
  .option-bar {
    position: fixed;
    @include px2rem(top, 38px);
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
    background-color: $dark;
  }
  .full-screen-bg {
    background-color: $dark;
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
      background: url("../../assets/imgLoadingError.png");
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
