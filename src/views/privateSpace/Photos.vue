<template>
  <section>
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
          :should-handle="!photoLoading">
          <div
            v-if="photoLoading"
            class="loading">
            <mt-spinner
              type="snake"
              :size="18">
            </mt-spinner>
            <p>加载中...</p>
          </div>
        </mugen-scroll>
      </section>
      <template v-else>
        <div class="no-data">
          <img src="../../assets/noFile.png">
        </div>
      </template>
    </transition>
    <template v-if="showPreview">
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
        class="full-screen-swiper">
        <!-- slides -->
        <swiper-slide
          class="swiper-zoom-container full-screen-bg"
          v-for="(item, index) in photos"
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
    </template>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import Gallery from '../../components/common/Gallery'
  import { getStore, removeStore } from '../../config/mUtils'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import { Toast } from 'mint-ui'
  import MugenScroll from 'vue-mugen-scroll'
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
        },
        photoLoading: false
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
                document.body.scrollTop -= 10
                if (this.pageIndex !== 1) {
                  Toast({
                    message: '没有更多数据了',
                    duration: 1000
                  })
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
        this.$router.push({name: 'Report', query: {resourceId: this.photos[this.currentIndex - 1].id, resourceClass: 'photo'}})
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
