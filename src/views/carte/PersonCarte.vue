<template>
  <section>
    <div class="full-width">
      <common-header
        :title="header"
        :icon-class="iconClass"
        :right-text="rightBtnText"
        @right-click="goReport()"
        @back="goBack()">
      </common-header>
      <div class="container" ref="personCarte" :style="{height: scrollHeight}">
        <div class="card-container">
          <card
            :store="userCard"
            @click="cardClick">
          </card>
        </div>
        <div
          v-if="clusters && clusters.length === 0"
          class="no-data">
          <img src="../../assets/noPersonCarte.png">
        </div>
        <template v-else>
          <div class="scroll-container">
            <div
              class="hover move-left"
              ref="hoverLeft">
              <div
                v-show="showScrollBtn"
                class="btn move-left"
                @click="scrollHorizontal(false)">
                <i class="iconfont icon-zuo"></i>
              </div>
            </div>
            <div
              class="carte-container white-bg"
              ref="scrollTarget">
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
                <img
                  v-if="item.type === 'mall'"
                  src="../../assets/mallLogo.png">
                <span class="ellipsis second-text font-13">{{item.name}}</span>
              </a>
            </div>
            <div
              class="hover move-right"
              ref="hoverRight">
              <div
                v-show="showScrollBtn"
                class="btn move-right"
                @click="scrollHorizontal(true)">
                <i class="iconfont icon-you"></i>
              </div>
            </div>
          </div>
          <template v-if="folders && folders.length > 0">
            <div>
              <space-folders
                :store="folders"
                @view-more="goFolder"
                @view-full-screen="showFullScreenPreview">
              </space-folders>
              <mugen-scroll
                :handler="loadFolderBottom"
                :handle-on-mount="false"
                :should-handle="!loading"
                :threshold="0.1"
                scroll-container="personCarte">
                <div class="loading">
                  <mt-spinner
                    v-show="!noMoreData"
                    type="snake"
                    :size="18">
                  </mt-spinner>
                  <p>{{loadingText}}</p>
                </div>
              </mugen-scroll>
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
      </div>
    </div>
    <favorite-btn
      :show="!!userCard"
      :single="true"
      :text="favoratesText"
      @click="favoriteAction()">
    </favorite-btn>
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
  import { getStore, setStore, removeStore, setScrollTop } from '../../config/mUtils'
  import { Toast } from 'mint-ui'
  import PopDialog from '../../components/common/PopDialog'
  import SpaceFolders from '../../components/common/SpaceFolers'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import FavoriteBtn from '../../components/common/FavoriteBtn'
  import MugenScroll from 'vue-mugen-scroll'
  export default {
    props: ['user_id'],
    name: 'PersonCarte',
    data () {
      return {
        header: '名片',
        rightBtnText: '投诉',
        iconClass: 'icon-jubao',
        p: this.$route.query.p || '',
        hasLogin: !!getStore('user'),
        token: getStore('user') ? getStore('user').authentication_token : null,
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
        showScrollBtn: false,
        scrollLeftListener: false,
        scrollRightListener: false,
        loading: true,
        favoratesText: '收藏',
        hasAddFavorites: false,
        loadingText: '加载中...',
        noMoreData: false,
        userCard: null,
        clusters: [],
        scrollHeight: '14rem',
        scrollActive: false
      }
    },
    components: {
      CommonHeader,
      Card,
      PopDialog,
      SpaceFolders,
      swiper,
      swiperSlide,
      MugenScroll,
      FavoriteBtn
    },
    methods: {
      beforeGetData () {
        if (this.p) {
          this.getPersonDetail('/shares/card', {
            p: this.p,
            ...(this.token ? {token: this.token} : {})
          })
        } else {
          this.shouldLogin()
        }
      },
      goReport () {
        this.$router.push({name: 'Report', query: {resourceId: typeof this.userCard.id === 'number' ? this.userCard.user_id : this.userCard.id, resourceClass: 'user'}})
      },
      goReportPhoto () {
        this.$router.push({name: 'Report', query: {resourceId: this.photos[this.currentIndex - 1].id, resourceClass: 'photo'}})
      },
      showFullScreenPreview (item) {
        this.photos = [...item.photos]
        this.currentIndex = item.index + 1
        this.swiperOption.initialSlide = item.index
        this.showPreview = true
      },
      closePreview () {
        this.showPreview = false
      },
      getPersonDetail (url, params) {
        this.$store.dispatch('commonAction', {
          url: url,
          method: 'get',
          params: params,
          target: this,
          resolve: (state, res) => {
            this.userCard = res.data.cards
            this.clusters = res.data.clusters
            this.handleFavoriteStatus(res.data.favoriated || false)
            this.$nextTick(() => {
              this.showScrollBtnFn('hoverLeft')
              this.showScrollBtnFn('hoverRight')
            })
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
        this.loading = true
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
            this.loading = false
            if (res.data.gallery.length < this.pageSize) {
              this.noMoreData = true
              this.loadingText = '没有更多数据了...'
            }
            this.folders = this.pageIndex === 1 ? res.data.gallery : [...this.folders, ...res.data.gallery]
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
            this.$router.push({name: 'Maps', query: {lat: '', lng: '', title: this.userCard.name, address: item.value}})
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
      goCarte (item) {
        this.pageIndex = 1
        if (item.type === 'personal') {
          // 如果点击的是个人空间，则不跳转页面，在当前页面切换显示
          this.header = item.name
          this.getFirstSpace(this.p ? '/shares/zone' : '/galleries', item.id, this.user_id, this.token, this.p)
        } else if (item.type === 'association') {
          this.$router.push({name: 'ComityCarte', params: {id: item.team_id}})
        } else if (item.type === 'company') {
          this.$router.push({name: 'EnterpriseCarte', params: {id: item.team_id}})
        } else if (item.type === 'class') {
          this.$router.push({name: 'Class', params: {id: item.team_id}})
        } else if (item.type === 'school') {
          this.$router.push({name: 'Alumni', params: {id: item.team_id}})
        } else if (item.type === 'mall') {
          this.$router.push({name: 'Mall', params: {id: item.team_id}})
        } else {
          this.$router.push({name: 'EnterpriseCarte', params: {id: item.team_id}})
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
            this.$router.push({name: 'Login'})
          }, 2000)
        } else {
          this.getPersonDetail('/business_cards', {token: this.token, user_id: this.user_id})
        }
      },
      closeDialog () {
        this.showDialog = false
      },
      loadFolderBottom () {
        if (!this.noMoreData) {
          this.pageIndex += 1
          this.getFirstSpace(this.p ? '/shares/zone' : '/galleries', this.targetSpaceId, this.targetUserId, this.token, this.p)
        }
      },
      scrollHorizontal (bool) {
        this.$refs.scrollTarget.scrollLeft += bool ? -250 : 250
      },
      showScrollBtnFn (target) {
        let dom = this.$refs[target]
        if (!this[`${target}Listener`] && dom) {
          dom.addEventListener('mouseenter', e => {
            this.showScrollBtn = true
          })
          dom.addEventListener('mouseover', e => {
            this.showScrollBtn = true
          })
          dom.addEventListener('mouseleave', e => {
            this.showScrollBtn = false
          })
          this[`${target}Listener`] = true
        }
      },
      favoriteAction () {
        if (!this.hasLogin) {
          setStore('beforeLogin', 'true')
          this.$router.push({name: 'Login'})
        } else if (!this.hasAddFavorites) {
          this.favoriteRequest(typeof this.userCard.id === 'number' ? this.userCard.user_id : this.userCard.id)
        } else {
          this.removeFavorites(typeof this.userCard.id === 'number' ? this.userCard.user_id : this.userCard.id)
        }
      },
      removeFavorites (id) {
        this.$store.dispatch('commonAction', {
          url: `/favorites/${id}`,
          method: 'delete',
          params: {},
          data: {
            token: this.token,
            id: id,
            type: 'User'
          },
          target: this,
          resolve: (state, res) => {
            if (res.status === 200 && res.data.favorable_id) {
              this.hasAddFavorites = false
              this.favoratesText = '收藏'
              Toast({
                message: '您已取消收藏该用户',
                duration: 500
              })
            }
          },
          reject: () => {
            Toast({
              message: '取消收藏失败，请重试',
              duration: 500
            })
          }
        })
      },
      favoriteRequest (userId) {
        this.$store.dispatch('commonAction', {
          url: '/favorites',
          method: 'post',
          params: {},
          data: {
            token: this.token,
            user_id: userId
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.favorites && res.data.favorites.id && res.data.favorites.type === 'User') {
              this.hasAddFavorites = true
              this.favoratesText = '已收藏'
              Toast({
                message: '你已成功收藏该用户',
                className: 'toast-content',
                iconClass: 'iconfont icon-caozuochenggong toast-icon-big',
                duration: 1000
              })
            } else {
              Toast({
                message: '收藏该用户失败',
                duration: 1000
              })
            }
          },
          reject: () => {
          }
        })
      },
      handleFavoriteStatus (bool) {
        if (this.hasLogin) {
          this.hasAddFavorites = bool
          this.favoratesText = bool ? '已收藏' : '收藏'
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
      // 个人名片页面，不管前进后退都有可能去的是同一个页面，所以这里不宜缓存
      this.pageIndex = 1
      this.targetSpaceId = ''
      this.targetUserId = ''
      this.loading = true
      this.favoratesText = '收藏'
      this.noMoreData = false
      this.loadingText = '加载中...'
      this.hasAddFavorites = false
      this.hasLogin = !!getStore('user')
      this.token = getStore('user') ? getStore('user').authentication_token : null
      if (!this.$store.state.popState || this.$store.state.fromLogin) {
        setScrollTop(0, this.$refs.personCarte)
      } else {
        setScrollTop(this.$store.state.scrollMap.PersonCarte || 0, this.$refs.personCarte)
      }
      this.beforeGetData()
    },
    beforeRouteLeave (to, from, next) {
      this.$store.dispatch('saveScroll', {name: 'PersonCarte', value: this.$refs.personCarte.scrollTop})
      if (to.name !== 'Chat' && to.name !== 'Report' && to.name !== 'Folders' && to.name !== 'Photos' && to.name !== 'Maps' && to.name !== 'Login') {
        this.pageIndex = 1
        this.currentIndex = 1
        this.targetSpaceId = ''
        this.targetUserId = ''
        this.loading = true
        this.favoratesText = '收藏'
        this.loadingText = '加载中...'
        this.noMoreData = false
        this.hasAddFavorites = false
        this.userCard = null
        this.clusters = []
        this.folders = []
        this.photos = []
      }
      next()
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .container {
    overflow-y: scroll;
    padding-bottom: 1px;
    -webkit-overflow-scrolling: touch;
  }
  .scroll-container {
    overflow-x: scroll;
    @include px2rem(margin-top, 15px);
    -webkit-user-select: none;
    position: relative;
    cursor: grab;
    position: relative;
    box-shadow: 0 1px 5px rgba(119, 113, 113, 0.2), 0 2px 2px rgba(189, 188, 188, 0.14), 0 3px 1px -2px rgba(245, 243, 243, 0.12);
    .hover {
      position: absolute;
      display: block;
      @include px2rem(width, 66px);
      top: 0;
      bottom: 0;
      z-index: 1001;
      .btn {
        position: absolute;
        @include px2rem(width, 66px);
        top: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, .3);
        display: flex;
        justify-content: center;
        align-items: center;
        i {
          @include font-dpr(20px);
          color: $white;
        }
      }
    }
    .move-left {
      left: 0;
    }
    .move-right {
      right: 0;
    }
  }
  .carte-container {
    display: flex;
    overflow-x: scroll;
    -webkit-user-select: none;
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
    a:hover {
      cursor: pointer;
    }
    a:active {
      background-color: $tenth-grey;
    }
  }
  .loading {
    @include px2rem(height, 120px);
    @include font-dpr(15px);
    color: $second-dark;
    line-height: normal;
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
