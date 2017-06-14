<template>
  <section>
    <div class="gallery">
      <img v-for="(item, index) in dataSource"
           :key="index"
           :src="item.cover"
           class="photo"
           @click="showPreview = true"/>
    </div>
    <template>
      <swiper v-show="showPreview"
              :options="swiperOption"
              ref="mySwiper"
              v-bind:class="{'slide-out-bck-center': cssAnimation}"
              class="full-screen-swiper">
        <!-- slides -->
        <swiper-slide class="swiper-zoom-container full-screen-bg"
                      v-for="item in dataSource"
                      :key="item.cover">
          <img :src="item.cover"
              alt=""
              class="big-photo">
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
        swiperOption: {
          // notNextTick是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
          notNextTick: true,
          // swiper configs 所有的配置同swiper官方api配置
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
          onTouchMoveOpposite: () => {
            this.cssAnimation = true
            setTimeout(() => {
              this.showPreview = false
              this.cssAnimation = false
            }, 500)
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
    },
    computed: {
      swiper () {
        return this.$refs.mySwiper.swiper
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

  .slide-out-bck-center {
    -webkit-animation: slide-out-bck-center 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
            animation: slide-out-bck-center 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
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
