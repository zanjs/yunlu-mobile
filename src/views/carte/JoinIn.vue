<template>
  <section class="full-width">
    <common-header
      :title="header"
      @back="goBack()">
    </common-header>
    <div v-if="!loading" class="container">
      <section class="info-wrapper">
        <a class="item" @click="goMall()">
          <span>加入机构</span>
          <span>{{name}}</span>
        </a>
        <a v-show="files.length > 0" class="item">
          <span>个人会员年费</span>
          <span>{{personMoney}}</span>
        </a>
        <a v-show="files.length > 0" class="item">
          <span>企业会员年费</span>
          <span>{{orgMoney}}</span>
        </a>
        <a v-show="files.length > 0" class="item">
          <span>会员缴费时间</span>
          <span>{{payTime}}</span>
        </a>
        <a v-show="files.length > 0" class="item">
          <span>协会销售提成</span>
          <span>{{orgSaleRate}}</span>
        </a>
        <a v-show="files.length > 0" class="item">
          <span>会员返点比例</span>
          <span>{{personSaleRate}}</span>
        </a>
      </section>
      <section class="files-wrapper">
        <p>章程详情</p>
        <div v-if="files.length > 0" class="gallery">
          <div
            v-for="(item, index) in files"
            :key="index"
            @click.stop="viewImgs(files)"
            class="img-container">
            <img v-lazy="{
                  src: item.thumb_urls[0],
                  error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
                  loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
                }">
          </div>
        </div>
        <div v-else class="flex no-constitution-wrapper">
          <img src="../../assets/noConstitution.png">
        </div>
        <div v-show="files.length > 0" class="flex join-tips">
          <div class="switch">
            <mt-switch v-model="agree"></mt-switch>
          </div>
          <span class="tips">我已阅读并同意章程内容</span>
        </div>
      </section>
    </div>
    <div class=""></div>
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
          <img v-lazy="{
              src: item.url,
              error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
              loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
            }">
        </swiper-slide>
      </swiper>
    </div>
    <div class="full-width button-block">
      <a class="flex btn" @click="beforeSubmit()">申请加入</a>
    </div>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import { getStore, removeStore } from '../../config/mUtils'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import { Toast, Indicator } from 'mint-ui'
  export default {
    props: ['id'],
    name: 'JoinIn',
    data () {
      return {
        header: '申请成为会员',
        name: this.$route.query.name || '',
        token: getStore('user') ? getStore('user').authentication_token : '',
        payTime: null,
        orgSaleRate: null,
        personSaleRate: null,
        personMoney: null,
        orgMoney: null,
        fileIds: [],
        files: [],
        agree: false,
        previewImgs: [],
        currentIndex: 1,
        showPreview: false,
        loading: true,
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
      swiper,
      swiperSlide
    },
    methods: {
      goBack () {
        if (getStore('JoinIn_goHome')) {
          removeStore('JoinIn_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      handleFileIds (arr) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          tmpArr.push(arr[i].file_id)
        }
        return tmpArr
      },
      openIndicator () {
        Indicator.open({
          text: '加载中...',
          spinnerType: 'snake'
        })
      },
      closeIndicator () {
        Indicator.close()
      },
      getJoinDetails () {
        this.$store.dispatch('commonAction', {
          url: `/team/${this.id}/archives`,
          method: 'get',
          params: {
            token: this.token,
            type: 'Constitution',
            mode: 'constitution'
          },
          target: this,
          resolve: (state, res) => {
            this.payTime = `每年${res.data.archives[0].pay_on[0]}月${res.data.archives[0].pay_on[1]}日`
            this.personSaleRate = `${res.data.archives[0].personal_rate}%`
            this.orgSaleRate = `${res.data.archives[0].organization_rate}%`
            this.orgMoney = `${res.data.archives[0].organization_price} 元/年`
            this.personMoney = `${res.data.archives[0].personal_price} 元/年`
            this.fileIds = this.handleFileIds(res.data.archives[0].files)
            this.getFiles(this.fileIds)
          },
          reject: (state, error) => {
            this.loading = false
            this.closeIndicator()
          }
        })
      },
      goMall () {
        this.$router.push({path: `/malls/${this.id}`})
      },
      getFiles (ids) {
        this.loading = true
        this.$store.dispatch('commonAction', {
          url: '/links/files/publisheds',
          method: 'get',
          params: {
            token: this.token,
            team_id: this.id,
            type: 'document',
            thumbs: ['general'],
            ids: ids
          },
          target: this,
          resolve: (state, res) => {
            this.files = res.data.files
            this.loading = false
            this.closeIndicator()
          },
          reject: (state, error) => {
            this.loading = false
            this.closeIndicator()
          }
        })
      },
      beforeSubmit () {
        if (this.files.length > 0 && !this.agree) {
          Toast({
            message: '请先阅读并同意章程内容',
            duration: 1000
          })
        } else {
          this.submitApplication()
        }
      },
      submitApplication () {
        this.$store.dispatch('commonAction', {
          url: '/jobs',
          method: 'post',
          params: {
            token: this.token,
            team_id: this.id
          },
          data: {
            token: this.token,
            team_id: this.id
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.preps && res.data.preps.state === 'submitted') {
              Toast({
                message: '提交成功，请等待对方审核',
                className: 'toast-content',
                iconClass: 'iconfont icon-caozuochenggong toast-icon-big',
                duration: 1000
              })
            } else if (res.data.code === 0) {
              Toast({
                message: res.data.detail,
                duration: 1000
              })
            }
          },
          reject: (state, error) => {
          }
        })
      },
      viewImgs (files) {
        this.previewImgs = files
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
      this.openIndicator()
      this.getJoinDetails()
      this.stopTouchMove()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .container {
    @include pm2rem(padding, 88px, 0px, 100px, 0px);
    .info-wrapper {
      @include px2rem(margin-bottom, 20px);
      background-color: $white;
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: normal;
        @include px2rem(height, 100px);
        @include pm2rem(padding, 0px, 30px, 0px, 30px);
        border-bottom: 1px solid $second-grey;
        span {
          @include font-dpr(14px);
        }
      }
      a:active {
        background-color: rgba(239, 234, 234, .5);
      }
    }
    .files-wrapper {
      background-color: $white;
      border-top: 1px solid $second-grey;
      @include pm2rem(padding, 20px, 0px, 30px, 30px);
      @include px2rem(min-height, 380px);
      p {
        @include px2rem(height, 60px);
        @include font-dpr(16px);
        color: $primary-dark;
      }
      .gallery {
        @include pm2rem(padding, 20px, 0px, 0px, 0px);
        @include px2rem(min-height, 260px);
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;

      }
      .no-constitution-wrapper {
        @include px2rem(height, 300px);
        @include px2rem(padding-right, 30px);
        img {
          @include px2rem(width, 184px);
          @include px2rem(height, 161px);
        }
      }
      .img-container {
        @include px2rem(width, 220px);
        @include px2rem(height, 220px);
        @include pm2rem(margin, 0px, 30px, 30px, 0px);
        img {
          width: 100%;
          height: 100%;
        }
        img[lazy=loading] {
          width: 100%;
          height: 100%;
          background-position: center center!important;
          background: url("../../assets/imgLoading3.jpg");
          background-repeat: no-repeat;
          background-size: cover;
        }
        img[lazy=error] {
          width: 100%;
          height: 100%;
          background-position: center center!important;
          background: url("../../assets/imgLoadingError.png");
          background-repeat: no-repeat;
          background-size: cover;
        }
        img[lazy=loaded] {
          width: 100%;
          height: 100%;
        }
      }
      .join-tips {
        @include pm2rem(padding, 20px, 0px, 20px, 0px);
        .switch {
          @include px2rem(margin-right, 30px);
        }
        .tips {
          line-height: normal;
          @include font-dpr(14px);
          color: $green;
        }
      }
    }
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
  .button-block {
    position: fixed;
    bottom: 0;
    .btn {
      flex: 1;
      @include px2rem(height, 100px);
      line-height: normal;
      background-color: $green;
      color: $white;
      @include font-dpr(16px);
    }
    a:active {
      opacity: .8;
    }
  }
</style>

<style lang="scss">
  @import "../../styles/mixin";

  .join-tips {
    .mint-switch {
      .mint-switch-core {
        width: 40px;
        height: 20px;
        &::before {
          width: 38px;
          height: 18px;
        }
        &::after {
          width: 18px;
          height: 18px;
          background-color: $white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, .4);
        }
      }
    }
    .mint-switch-input:checked + .mint-switch-core {
      border-color: $green;
      background-color: #52CAA7;
    }
    .mint-switch-input:checked + .mint-switch-core::after {
      transform: tranlasteX(20px);
    }
  }
</style>

