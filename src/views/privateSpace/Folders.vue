<template>
  <section>
    <common-header
      :title="headerName"
      @back="goBack()">
    </common-header>
    <div class="card-container">
      <card
        :store="userCard"
        @click="cardClick">
      </card>
    </div>
    <div class="rope">
      <img src="../../assets/shengzi@2x.png"
           class="left">
      <img src="../../assets/shengzi@2x.png"
           class="right">
    </div>
    <div class="album-comtainer">
      <mt-loadmore
        :top-method="loadPhotosTop"
        :bottom-method="loadPhotosBottom"
        :bottom-pull-text="bottomPullText"
        :bottom-drop-text="bottomDropText"
        :auto-fill="false"
        ref="loadMorePhotos">
        <div class="photos-container">
          <album
            :data-source="photos"
            @click="showFullScreenPreview">
          </album>
        </div>
      </mt-loadmore>
    </div>
    <template v-if="showPreview">
      <div class="option-bar">
        <div class="left">
          <div class="close"
               @click="closePreview()">
            <i class="iconfont icon-fanhui"></i>
          </div>
          <span class="page-nav">{{currentIndex}}/{{photos.length}}</span>
        </div>
        <div class="report"
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
          <img :src="item.url"
               alt="">
        </swiper-slide>
      </swiper>
    </template>
    <template v-if="showDialog">
      <pop-dialog
        :store="message"
        @close="closeDialog">
      </pop-dialog>
    </template>
  </section>
</template>

<script>
  // 此文件保留，用以打开分享的单个私人空间文件夹。
  import CommonHeader from '../../components/header/CommonHeader'
  import Card from '../../components/common/Card'
  import Album from '../../components/common/Album'
  import { mapGetters } from 'vuex'
  import { Toast, MessageBox } from 'mint-ui'
  import { getStore, removeStore } from '../../config/mUtils'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import PopDialog from '../../components/common/PopDialog'
  export default {
    name: 'Folders',
    data () {
      return {
        user_id: this.$route.params.user_id,
        id: this.$route.params.id,
        p: this.$route.query.p || '',
        pageIndex: 1,
        pageSize: 24,
        headerName: '私人空间文件夹',
        bottomPullText: '上拉加载更多',
        bottomDropText: '释放加载',
        photos: [],
        token: getStore('user') ? getStore('user').authentication_token : '',
        showPreview: false,
        currentIndex: 1,
        showDialog: false,
        message: null,
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
      Card,
      Album,
      swiper,
      swiperSlide,
      PopDialog
    },
    methods: {
      beforeGetData () {
        if (this.p) {
          this.getData('/shares/photos', {p: this.p})
        } else {
          this.shouldLogin()
        }
      },
      showFullScreenPreview (index) {
        this.currentIndex = index + 1
        this.swiperOption.initialSlide = index
        this.showPreview = true
      },
      closePreview () {
        this.showPreview = false
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
      cardClick (item) {
        switch (item.type) {
          case 'email':
            this.showPopDialog(2, '邮箱地址', item.value)
            break
          case 'wechat':
            this.showPopDialog(1, '微信号', item.value)
            break
          case 'weibo':
            this.showMessageBox(item.value)
            break
          case 'qq':
            this.showPopDialog(0, 'QQ号', item.value)
            break
          case 'address':
            if (item.value.latitude && item.value.longitude) {
              this.$router.push({name: 'Maps', query: {lat: item.value.latitude, lng: item.value.longitude, title: this.$store.state.teams.company}})
            } else {
              this.$router.push({name: 'Maps', query: {lat: '', lng: '', title: this.$store.state.userCard.name, address: item.value}})
            }
            break
        }
      },
      linkToast (str, key, value) {
        Toast({
          message: `该${str}${key}为：${value}`,
          duration: 5000
        })
      },
      showMessageBox (str) {
        MessageBox({
          title: '长按复制到剪切板',
          message: str
        })
      },
      showPopDialog (type, name, value) {
        this.message = {
          type: type,
          name: name,
          value: value
        }
        this.showDialog = true
      },
      closeDialog () {
        this.showDialog = false
      },
      getData (url, params) {
        this.$store.dispatch('commonAction', {
          url: url,
          method: 'get',
          params: params,
          target: this,
          resolve: (state, res) => {
            if (url === '/business_cards') {
              state.userCard = res.data.cards
              state.clusters = res.data.clusters
              this.handleName(this.space_id, res.data.clusters)
            } else {
              this.headerName = res.data.gallery_name
              if (this.pageIndex === 1) {
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
              if (url === '/shares/photos') {
                state.userCard = res.data.cards
              }
            }
          },
          reject: () => {
            this.$router.replace({name: 'ReportExpired'})
          }
        })
      },
      loadPhotosTop () {
        this.pageIndex = 1
        this.getData(`/galleries/${this.id}/photos`, {token: this.token, page: this.pageIndex, per_page: this.pageSize})
      },
      loadPhotosBottom () {
        this.pageIndex += 1
        this.getData(`/galleries/${this.id}/photos`, {token: this.token, page: this.pageIndex, per_page: this.pageSize})
      },
      goBack () {
        if (getStore('Folders_goHome')) {
          removeStore('Folders_goHome')
          this.$router.push({name: 'See'})
        } else if (getStore('FoldersPhotos_goHome')) { // 当前页面有两种方式进入，路由名称不一样
          removeStore('FoldersPhotos_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
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
          this.getData('/business_cards', {token: this.token, user_id: this.user_id})
          this.getData(`/galleries/${this.id}/photos`, {token: this.token, page: this.pageIndex, per_page: this.pageSize})
        }
      }
    },
    mounted () {
      this.beforeGetData()
    },
    computed: {
      ...mapGetters([
        'userCard',
        'clusters'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .card-container {
    @include pm2rem(padding, 96px, 22px, 0px, 22px);
  }
  .rope {
    position: absolute;
    width: 100%;
    max-width: 540px;
    @include px2rem(top, 396px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    img {
      @include px2rem(width, 30px);
    }
    .left {
      @include px2rem(margin-left, 60px);
    }
    .right {
      @include px2rem(margin-right, 50px);
    }
  }
  .album-comtainer {
    @include pm2rem(padding, 24px, 22px, 0px, 22px);
  }
  .option-bar {
    position: fixed;
    @include px2rem(top, 38px);
    width: 100%;
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
    background-color: $dark;
  }
  .full-screen-bg {
    background-color: $dark;
  }
</style>
