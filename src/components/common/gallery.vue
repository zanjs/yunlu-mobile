<template>
  <section>
    <div class="gallery">
      <img v-for="(item, index) in dataSource"
           :key="index"
           :src="item.url"
           class="photo"
           @click="showFullScreenPreview(index)">
    </div>
    <template>
      <span v-if="showPreview"
            class="page-nav">{{currentIndex}}/{{dataSource.length}}</span>
      <div v-if="showPreview"
           class="close"
           @click="closePreview()">
        <i class="fa fa-times"></i>
      </div>
      <swiper v-if="showPreview"
              :options="swiperOption"
              class="full-screen-swiper">
        <!-- slides -->
        <swiper-slide class="swiper-zoom-container full-screen-bg"
                      v-for="(item, index) in dataSource"
                      :key="item.url">
          <img :src="item.url"
               alt="">
        </swiper-slide>
      </swiper>
    </template>
  </section>
</template>
<script>
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  export default {
    data () {
      return {
        showPreview: false,
        cssAnimation: false,
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
      swiper,
      swiperSlide
    },
    name: 'Gallery',
    props: ['dataSource'],
    methods: {
      showFullScreenPreview (index) {
        this.currentIndex = index + 1
        this.swiperOption.initialSlide = index
        this.showPreview = true
      },
      closePreview () {
        this.showPreview = false
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../styles/mixin';

  .gallery {
    @include pm2rem(margin, 0px, 0px, 40px, 0px);
    @include pm2rem(padding, 98px, 4px, 0px, 12px);
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .photo {
      @include px2rem(width, 236px);
      @include px2rem(height, 236px);
      @include pm2rem(margin, 0px, 8px, 10px, 0px)
    }
  }
  .page-nav {
    position: absolute;
    @include px2rem(top, 38px);
    @include px2rem(left, 150px);
    @include pm2rem(padding, 4px, 10px, 4px, 10px);
    @include px2rem(border-radius, 10px);
    color: white;
    z-index: 1003;
    @include font-dpr(20px);
    background-color: rgba(0, 0, 0, .5);
  }
  .close {
    position: fixed;
    @include px2rem(top, 38px);
    @include px2rem(left, 52px);
    @include pm2rem(padding, 4px, 10px, 4px, 10px);
    @include px2rem(border-radius, 10px);
    background-color: rgba(0, 0, 0, .5);
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
    background-color: #000;
  }
  .full-screen-bg {
    background-color: #000;
  }
</style>
