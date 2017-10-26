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
    <template v-if="folders && folders.length > 0">
      <div class="space-container">
        <div>
          <space-folders
            :store="folders"
            @view-more="goFolder"
            @view-full-screen="showFullScreenPreview">
          </space-folders>
          <mugen-scroll
            :handler="loadFolderBottom"
            :handle-on-mount="false"
            :should-handle="!loading">
            <div
              v-if="loading || noMoreData"
              class="loading">
              <mt-spinner
                v-if="loading"
                type="snake"
                :size="18">
              </mt-spinner>
              <p>{{loadingText}}</p>
            </div>
          </mugen-scroll>
        </div>
      </div>
      <template v-if="showPreview">
        <div class="option-bar full-width">
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
            @click="goReportPhoto">
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
    </template>
    <template v-else>
      <div class="no-data">
        <img src="../../assets/noFile.png">
      </div>
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
  import CommonHeader from '../../components/header/CommonHeader'
  import Card from '../../components/common/Card'
  import { mapGetters } from 'vuex'
  import { getStore, setStore, removeStore } from '../../config/mUtils'
  import SpaceFolders from '../../components/common/SpaceFolers'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import PopDialog from '../../components/common/PopDialog'
  import MugenScroll from 'vue-mugen-scroll'
  export default {
    name: 'Spaces',
    data () {
      return {
        headerName: '私人空间',
        p: this.$route.query.p || '',
        cluster_id: this.$route.query.cluster_id || '',
        space_id: this.$route.params.space_id || '',
        user_id: this.$route.params.user_id || '',
        token: getStore('user') ? getStore('user').authentication_token : '',
        thumbnails: [],
        showDialog: false,
        message: null,
        folders: [],
        pageIndex: 1,
        pageSize: 5,
        targetSpaceId: '',
        targetUserId: '',
        photos: [],
        currentIndex: 1,
        showPreview: false,
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
        loading: false,
        loadingText: '加载中...',
        noMoreData: false
      }
    },
    components: {
      CommonHeader,
      Card,
      PopDialog,
      SpaceFolders,
      swiper,
      swiperSlide,
      MugenScroll
    },
    methods: {
      goFolder (item) {
        this.$router.push({path: `/photos/${item.id}`,
          query: {
            name: item.name,
            p: this.p
          }
        })
      },
      getData () {
        this.loading = true
        this.$store.dispatch('commonAction', {
          url: '/shares/zone',
          method: 'get',
          params: {
            p: this.p,
            page: this.pageIndex,
            per_page: this.pageSize
          },
          target: this,
          resolve: (state, res) => {
            this.loading = false
            state.userCard = res.data.cards
            this.headerName = res.data.cluster
            if (this.pageIndex === 1) {
              this.folders = res.data.gallery
            } else {
              if (res.data.gallery.length === 0) {
                this.noMoreData = true
                this.loadingText = '没有更多数据了...'
              }
              this.folders = [...this.folders, ...res.data.gallery]
            }
          },
          reject: () => {
            this.loading = false
            this.$router.replace({name: 'ReportExpired'})
          }
        })
      },
      cardClick (item) {
        switch (item.type) {
          case 'chat':
            if (!this.token) {
              this.goLogin()
            } else {
              this.$router.push({name: 'Chat', query: {type: item.inContact ? 'Stranger' : 'User', linkId: item.value}})
            }
            break
          case 'email':
            this.showPopDialog(2, '邮箱地址', item.value)
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
      goBack () {
        if (getStore('Spaces_goHome')) {
          removeStore('Spaces_goHome')
          this.$router.push({name: 'See'})
        } else if (getStore('Zone_goHome')) { // 当前页面有两种方式进入，路由名称不一样
          removeStore('Zone_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      goReportPhoto () {
        this.$router.push({name: 'Report', query: {resourceId: this.photos[this.currentIndex - 1].id, resourceClass: 'photo'}})
      },
      showFullScreenPreview (item) {
        this.photos = [...item.photos]
        this.currentIndex = item.index + 1
        this.swiperOption.initialSlide = item.index
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
            e.preventDefault()
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
      loadFolderBottom () {
        if (!this.noMoreData) {
          this.pageIndex += 1
          this.getData()
        }
      },
      goLogin () {
        setStore('beforeLogin', 'true')
        this.$router.push({name: 'Login'})
      }
    },
    mounted () {
      this.getData()
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
  .no-data {
    @include pm2rem(padding, 100px, 20px, 100px, 0px);
    @include pm2rem(margin, 20px, 22px, 0px, 22px);
    background-color: $white;
    text-align: center;
    border: 1px solid $fifth-grey;
    img {
      @include px2rem(width, 260px);
      height: auto;
    }
  }

</style>
