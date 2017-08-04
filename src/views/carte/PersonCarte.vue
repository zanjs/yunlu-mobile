<template>
  <section>
    <common-header
      :title="header"
      :icon-class="iconClass"
      :right-text="rightBtnText"
      @right-click="goReport()"
      @back="goBack()">
    </common-header>
    <div class="card-container">
      <card
        :store="userCard"
        @click="cardClick"></card>
    </div>
    <div
      v-if="clusters && clusters.length === 0"
      class="no-data">
      <img src="../../assets/noPersonCarte.png">
    </div>
    <template v-else>
      <div class="carte-container white-bg">
        <a
          v-for="(item, index) in clusters"
          :key="index"
          @click="goCarte(item)"
          class="flex item">
          <img
            v-if="item.type === 'personal'"
            src="../../assets/spaceLogo.png">
          <img
            v-if="item.type === 'company'"
            src="../../assets/enterpriseLogo.png">
          <img
            v-if="item.type === 'association'"
            src="../../assets/associationLogo.png">
          <img
            v-if="item.type === 'class'"
            src="../../assets/classLogo.png">
          <img
            v-if="item.type === 'school'"
            src="../../assets/alumniLogo.png">
          <span class="ellipsis second-text font-13">{{item.name}}</span>
        </a>
      </div>
      <template v-if="folders && folders.length > 0">
        <div class="space-container">
          <mt-loadmore
            :top-method="loadFolderTop"
            :bottom-method="loadFolderBottom"
            :bottom-pull-text="bottomPullText"
            :bottom-drop-text="bottomDropText"
            :auto-fill="false"
            ref="loadMoreFolders">
            <space-folders
              :store="folders"
              @view-more="goFolder"
              @view-full-screen="showFullScreenPreview">
            </space-folders>
          </mt-loadmore>
        </div>
        <template v-if="showPreview">
          <div class="flex-between option-bar full-width">
            <div class="left">
              <div
                class="flex close white"
                @click="closePreview()">
                <i class="iconfont icon-fanhui"></i>
              </div>
              <span class="page-nav flex">{{currentIndex}}/{{photos.length}}</span>
            </div>
            <div
              class="report flex white"
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
  import { getStore, removeStore } from '../../config/mUtils'
  import { mapGetters } from 'vuex'
  import { Toast, MessageBox } from 'mint-ui'
  import PopDialog from '../../components/common/PopDialog'
  import SpaceFolders from '../../components/common/SpaceFolers'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  export default {
    data () {
      return {
        header: '名片',
        rightBtnText: '投诉',
        iconClass: 'icon-jubao',
        user_id: this.$route.params.user_id || '',
        p: this.$route.query.p || '',
        token: getStore('user') ? getStore('user').authentication_token : null,
        showDialog: false,
        message: null,
        folders: [],
        pageIndex: 1,
        pageSize: 5,
        bottomPullText: '上拉加载更多',
        bottomDropText: '释放加载',
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
        }
      }
    },
    components: {
      CommonHeader,
      Card,
      PopDialog,
      SpaceFolders,
      swiper,
      swiperSlide
    },
    methods: {
      beforeGetData () {
        if (this.p) {
          this.getPersonDetail('/shares/card', {p: this.p})
        } else {
          this.shouldLogin()
        }
      },
      goReport () {
        this.$router.push({name: 'Report', query: {resourceId: typeof this.$store.state.userCard.id === 'number' ? this.$store.state.userCard.user_id : this.$store.state.userCard.id, resourceClass: 'user'}})
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
      getPersonDetail (url, params) {
        this.$store.dispatch('commonAction', {
          url: url,
          method: 'get',
          params: params,
          target: this,
          resolve: (state, res) => {
            state.userCard = res.data.cards
            state.clusters = res.data.clusters
            let firstSpace = this.handleFirstSpace(res.data.clusters)
            if (firstSpace && firstSpace.id) {
              this.header = firstSpace.name
              this.getFirstSpace(this.p ? '/shares/zone' : '/galleries', firstSpace.id, typeof res.data.cards.id === 'number' ? res.data.cards.user_id : res.data.cards.id, this.token, this.p)
            }
          },
          reject: () => {
            this.$router.replace({name: 'ReportExpired'})
          }
        })
      },
      handleFirstSpace (arr) {
        let obj = null
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].type === 'personal') {
            obj = arr[i]
            break
          }
        }
        return obj || null
      },
      getFirstSpace (url, spaceId, userId, token, p) {
        this.targetSpaceId = spaceId
        this.targetUserId = userId
        this.$store.dispatch('commonAction', {
          url: url,
          method: 'get',
          params: {
            ...(token && !p ? {token: token} : {}),
            ...(p ? {p: p} : {}),
            cluster_id: spaceId,
            ...(p ? {} : {user_id: userId}),
            page: this.pageIndex,
            per_page: this.pageSize
          },
          target: this,
          resolve: (state, res) => {
            if (this.pageIndex === 1) {
              this.folders = res.data.gallery
              // folders为空时，上拉加载、下拉刷新组件未初始化，不能直接调用它的重置位置方法
              if (this.$refs.loadMoreFolders && this.$refs.loadMoreFolders.onTopLoaded) {
                this.$refs.loadMoreFolders.onTopLoaded()
              }
            } else {
              if (res.data.gallery.length === 0) {
                Toast({
                  message: '没有更多数据了',
                  duration: 1000
                })
              }
              this.folders = [...this.folders, ...res.data.gallery]
              if (this.$refs.loadMoreFolders && this.$refs.loadMoreFolders.onBottomLoaded) {
                this.$refs.loadMoreFolders.onBottomLoaded()
              }
            }
          },
          reject: () => {
            this.$router.replace({name: 'ReportExpired'})
          }
        })
      },
      cardClick (item) {
        switch (item.type) {
          case 'chat':
            this.$router.push({name: 'Chat', query: {type: item.inContact ? 'Stranger' : 'User', linkId: item.value}})
            break
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
      showPopDialog (type, name, value) {
        this.message = {
          type: type,
          name: name,
          value: value
        }
        this.showDialog = true
      },
      showMessageBox (str) {
        MessageBox({
          title: '长按复制到剪切板',
          message: str
        })
      },
      goCarte (item) {
        this.pageIndex = 1
        if (item.type === 'personal') {
          // 如果点击的是个人空间，则不跳转页面，在当前页面切换显示
          // if (this.$route.query.p) {
          //   this.$router.push({path: '/zone', query: {p: this.$route.query.p, cluster_id: item.id}})
          // } else {
          //   this.$router.push({path: `/users/${this.user_id}/spaces/${item.id}`})
          // }
          this.header = item.name
          this.getFirstSpace(this.p ? '/shares/zone' : '/galleries', item.id, this.$route.params.user_id, this.token, this.p)
        } else if (item.type === 'association') {
          this.$router.push({name: 'ComityCarte', params: {id: item.team_id}})
        } else if (item.type === 'company') {
          this.$router.push({name: 'EnterpriseCarte', params: {id: item.team_id}})
        } else if (item.type === 'class') {
          this.$router.push({name: 'Class', params: {id: item.team_id}})
        } else if (item.type === 'school') {
          this.$router.push({name: 'Alumni', params: {id: item.team_id}})
        }
      },
      goFolder (item) {
        this.$router.push({path: `/photos/${item.id}`,
          query: {
            name: item.name,
            ...(this.p ? {p: this.p} : {})
          }
        })
      },
      goBack () {
        if (getStore('PersonCarte_goHome')) {
          removeStore('PersonCarte_goHome')
          this.$router.push({name: 'See'})
        } else if (getStore('Card_goHome')) { // 当前页面有两种方式进入，路由名称不一样
          removeStore('Card_goHome')
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
          this.getPersonDetail('/business_cards', {token: this.token, user_id: this.user_id})
        }
      },
      closeDialog () {
        this.showDialog = false
      },
      loadFolderTop () {
        this.pageIndex = 1
        this.getFirstSpace(this.p ? '/shares/zone' : '/galleries', this.targetSpaceId, this.targetUserId, this.token, this.p)
      },
      loadFolderBottom () {
        this.pageIndex += 1
        this.getFirstSpace(this.p ? '/shares/zone' : '/galleries', this.targetSpaceId, this.targetUserId, this.token, this.p)
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

  .carte-container {
    display: flex;
    overflow-x: scroll;
    @include px2rem(margin-top, 15px);
    box-shadow: 0px 2px 12px 3px rgba(220, 223, 223, .45);
    .item {
      flex-direction: column;
      @include px2rem(width, 250px);
      @include px2rem(max-width, 250px);
      @include px2rem(min-width, 250px);
      img {
        @include pm2rem(margin, 20px, 0px, 20px, 0px);
        @include px2rem(width, 92px);
        @include px2rem(height, 87px);
      }
      span {
        @include px2rem(width, 200px);
        @include pm2rem(margin, 0px, 25px, 20px, 25px);
        line-height: 1;
        text-align: center;
      }
    }
    a:active {
      background-color: $tenth-grey;
    }
  }
  .option-bar {
    position: fixed;
    @include px2rem(top, 38px);
    z-index: 1004;
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
        z-index: 1003;
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
      z-index: 1003;
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
