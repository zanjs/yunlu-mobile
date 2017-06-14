<template>
  <section>
    <div class="gallery">
      <img v-for="(item, index) in dataSource"
           :key="index"
           :src="item.cover"
           class="photo"
           @click="showFullScreenPreview(index)"/>
    </div>
    <template>
      <span v-if="showPreview"
            v-bind:class="{'slide-out-bck-center': cssAnimation, 'slide-in-fwd-center': !cssAnimation}"
            class="page-nav">{{currentIndex}}/{{dataSource.length}}</span>
      <swiper v-if="showPreview"
              :options="swiperOption"
              v-bind:class="{'slide-out-bck-center': cssAnimation, 'slide-in-fwd-center': !cssAnimation}"
              class="full-screen-swiper">
        <!-- slides -->
        <swiper-slide class="swiper-zoom-container full-screen-bg"
                      v-for="(item, index) in dataSource"
                      :key="item.cover">
          <img :src="item.cover"
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
          onTouchMoveOpposite: () => {
            this.cssAnimation = true
            setTimeout(() => {
              this.showPreview = false
              this.cssAnimation = false
            }, 500)
          },
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
      }
    }
  }
</script>
<style lang="scss">
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
    @include px2rem(left, 52px);
    color: white;
    z-index: 1000;
    @include font-dpr(20px);
  }
  .full-screen-swiper {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 999;
  }
  .full-screen-bg {
    background-color: #000;
  }

  .slide-in-fwd-center {
    -webkit-animation: slide-in-fwd-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
            animation: slide-in-fwd-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  }

  .slide-out-bck-center {
    -webkit-animation: slide-out-bck-center 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
            animation: slide-out-bck-center 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
  }

  @-webkit-keyframes slide-in-fwd-center {
    0% {
      -webkit-transform: translateZ(-1400px);
              transform: translateZ(-1400px);
      opacity: 0;
    }
    100% {
      -webkit-transform: translateZ(0);
              transform: translateZ(0);
      opacity: 1;
    }
  }
  @keyframes slide-in-fwd-center {
    0% {
      -webkit-transform: translateZ(-1400px);
              transform: translateZ(-1400px);
      opacity: 0;
    }
    100% {
      -webkit-transform: translateZ(0);
              transform: translateZ(0);
      opacity: 1;
    }
  }

  @-webkit-keyframes slide-out-bck-center {
    0% {
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
      opacity: 1
    }

    100% {
      -webkit-transform: translateZ(-1100px);
      transform: translateZ(-1100px);
      opacity: 0
    }
  }

  @keyframes slide-out-bck-center {
    0% {
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
      opacity: 1
    }

    100% {
      -webkit-transform: translateZ(-1100px);
      transform: translateZ(-1100px);
      opacity: 0
    }
  }
</style>
