<template>
  <section>
    <div class="gallery">
      <img v-for="(item, index) in dataSource"
           :key="index"
           :src="item.url"
           class="photo"/>
    </div>
    <template>
      <swiper :options="swiperOption" ref="mySwiper">
        <!-- slides -->
        <swiper-slide class="swiper-container"
                      v-for="item in certificatesSelected.photos"
                      :key="item.url">
          <img :src="item.url"
                alt=""
                @click="viewBigImg(item.url)"
                class="model-img">
        </swiper-slide>
        <!-- Optional controls -->
        <div class="swiper-pagination"  slot="pagination"></div>
        <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
      </swiper>
    </template>
  </section>
</template>
<script>
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  export default {
    data () {
      return {}
    },
    name: 'Gallery',
    props: ['dataSource', 'headTitle'],
    methods: {
      swiperOption: {
          // notNextTick是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
          notNextTick: true,
          // swiper configs 所有的配置同swiper官方api配置
          autoplay: 3000,
          direction: 'horizontal',
          grabCursor: true,
          setWrapperSize: true,
          autoHeight: true,
          pagination: '.swiper-pagination',
          paginationClickable: true,
          prevButton: '.swiper-button-prev',
          nextButton: '.swiper-button-next',
          mousewheelControl: true,
          observeParents: true,
          // 如果自行设计了插件，那么插件的一些配置相关参数，也应该出现在这个对象中，如下debugger
          debugger: true,
          preventClicks: false
        },
    }
  }
</script>
<style lang="scss">
  @import '../../styles/mixin';

  .gallery {
    @include pm2rem(margin, 98px, 0px, 40px, 0px);

  }
</style>
