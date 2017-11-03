<template>
  <section>
    <common-header
      :title="header"
      @back="goBack()">
    </common-header>
    <div class="gallery-container">
      <information-gallery
        :store="informationFolderArchives"
        @click="viewImgs">
      </information-gallery>
    </div>
    <div v-if="showPreview">
      <div class="option-bar full-width">
        <div class="close"
            @click="closePreview()">
          <i class="iconfont icon-fanhui"></i>
        </div>
        <span class="page-nav flex">{{currentIndex}}/{{previewImgs.length}}</span>
      </div>
      <swiper
        :options="swiperOption"
        class="full-screen-swiper">
        <swiper-slide
          class="swiper-zoom-container"
          v-for="(item, index) in previewImgs"
          :key="index">
          <img :src="item.url"
               alt="">
        </swiper-slide>
      </swiper>
    </div>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import { getStore, removeStore } from '../../config/mUtils'
  import InformationGallery from '../../components/common/InformationGallery'
  import { mapGetters } from 'vuex'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  export default {
    name: 'InformationFolders',
    data () {
      return {
        header: '资讯',
        teamId: this.$route.params.id,
        type: this.$route.query.type,
        token: getStore('user') ? getStore('user').authentication_token : '',
        pageIndex: 1,
        pageSize: 20,
        tmpArchives: [],
        showPreview: false,
        previewImgs: [],
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
          preventClicks: false,
          passiveListeners: false,
          zoom: true,
          height: window.innerHeight,
          width: window.innerWidth,
          initialSlide: 0,
          onSlideChangeEnd: (swiper) => {
            this.currentIndex = swiper.activeIndex + 1
          }
        }
      }
    },
    components: {
      CommonHeader,
      InformationGallery,
      swiper,
      swiperSlide
    },
    methods: {
      goBack () {
        if (getStore('InformationFolders_goHome')) {
          removeStore('InformationFolders_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      getArchives () {
        this.$store.dispatch('commonAction', {
          url: '/archives',
          method: 'get',
          params: {
            team_id: this.teamId,
            token: this.token,
            type: this.type,
            page: this.pageIndex,
            per_page: this.pageSize
          },
          target: this,
          resolve: (state, res) => {
            state.informationFolderArchives = res.data.archives
            this.tmpArchives = res.data.archives
            let ids = this.handleFileIds(res.data.archives)
            this.getCovers(ids)
          },
          reject: () => {
          }
        })
      },
      handleFileIds (arr) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < arr[i].files.length; j++) {
            tmpArr.push(arr[i].files[j].file_id)
          }
        }
        return tmpArr
      },
      handleArchives (arr, arr2) {
        let tmpArr = [...arr]
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < arr2.length; j++) {
            for (let m = 0; m < arr[i].files.length; m++) {
              if (arr[i].files[m].file_id === arr2[j].id) {
                tmpArr[i].files[m].url = arr2[j].url
                tmpArr[i].files[m].thumb_url = arr2[j].thumb_urls[0]
              }
            }
          }
        }
        return tmpArr
      },
      getCovers (ids) {
        this.$store.dispatch('commonAction', {
          url: '/links/files/publisheds',
          method: 'get',
          params: {
            team_id: this.teamId,
            type: 'document',
            thumbs: ['general'],
            ids: ids
          },
          target: this,
          resolve: (state, res) => {
            state.informationFolderArchives = this.handleArchives(this.tmpArchives, res.data.files)
          },
          reject: () => {
          }
        })
      },
      viewImgs (item) {
        this.previewImgs = item.files
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
      }
    },
    mounted () {
      this.getArchives()
      this.stopTouchMove()
    },
    computed: {
      ...mapGetters([
        'informationFolderArchives'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .gallery-container {
    @include px2rem(padding-top, 88px);
  }
  .option-bar {
    position: fixed;
    @include px2rem(top, 38px);
    display: flex;
    align-items: center;
    z-index: 1004;
    .page-nav {
      background-color: rgba(0, 0, 0, .5);
      color: white;
      z-index: 1003;
      @include font-dpr(20px);
      @include pm2rem(padding, 4px, 10px, 4px, 10px);
      @include px2rem(border-radius, 10px);
    }
    .close {
      @include px2rem(border-radius, 10px);
      @include pm2rem(margin, 0px, 30px, 0px, 30px);
      @include pm2rem(padding, 4px, 10px, 4px, 10px);
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
    z-index: 1002;
    background-color: $dark;
  }
</style>
