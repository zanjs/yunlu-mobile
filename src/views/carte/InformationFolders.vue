<template>
  <section>
    <mt-header title="资讯"
               fixed
               class="header">
      <mt-button slot="left"
                 @click="goBack()"
                 class="button-text">
        <i class="iconfont icon-fanhui"></i>
      </mt-button>
    </mt-header>
    <div class="gallery-container">
      <information-gallery
        :store="informationFolderArchives"
        @click="viewImgs">
      </information-gallery>
    </div>
    <div v-if="showPreview">
      <span class="page-nav">{{currentIndex}}/{{previewImgs.length}}</span>
      <div class="close"
           @click="closePreview()">
        <i class="fa fa-times"></i>
      </div>
      <swiper :options="swiperOption"
              class="full-screen-swiper">
        <!-- slides -->
        <swiper-slide class="swiper-zoom-container full-screen-bg"
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
  import { getStore } from '../../config/mUtils'
  import InformationGallery from '../../components/common/InformationGallery'
  import { mapGetters } from 'vuex'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  export default {
    data () {
      return {
        teamId: getStore('InformationFoldersParams') ? getStore('InformationFoldersParams').teamId : this.$route.params.teamId,
        type: getStore('InformationFoldersParams') ? getStore('InformationFoldersParams').type : this.$route.params.type,
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
      InformationGallery,
      swiper,
      swiperSlide
    },
    methods: {
      goBack () {
        this.$router.push({name: 'ComityCarte'})
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
      }
    },
    mounted () {
      this.getArchives()
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

  .header {
    background-color: $green;
    @include px2rem(height, 88px);
    @include font-dpr(17px);
    position: fixed;
    z-index: 1002 !important;
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
  .gallery-container {
    @include px2rem(padding-top, 88px);
  }
  .page-nav {
    position: absolute;
    @include px2rem(top, 38px);
    @include px2rem(left, 130px);
    color: white;
    z-index: 1003;
    @include font-dpr(20px);
  }
  .close {
    position: absolute;
    @include px2rem(top, 38px);
    @include px2rem(left, 52px);
    color: white;
    z-index: 1003;
    @include font-dpr(30px);
    line-height: 1;
  }
  .full-screen-swiper {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1002;
  }
  .full-screen-bg {
    background-color: #000;
  }
</style>
