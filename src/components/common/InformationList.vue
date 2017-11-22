<template>
  <section id="informationList">
    <div class="gallery">
      <template v-if="loading && store.length === 0">
        <div
          v-for="(item, index) in num"
          :key="index"
          class="empty-img-box">
        </div>
      </template>
      <template v-else>
        <div
          v-for="(item, index) in store"
          :key="index"
          @click.stop="handleClick(item)"
          class="img-box">
          <img
            v-lazy="{
              src: item.thumb_urls[0],
              error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
              loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
            }">
          <div class="cover ellipsis">
            {{item.cnname}}（{{item.count}}）
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script>
  export default {
    data () {
      return {

      }
    },
    props: ['store', 'num', 'loading'],
    methods: {
      handleClick (item) {
        this.$emit('click', item)
      }
    },
    mounted () {
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .gallery {
    @include pm2rem(padding, 16px, 2px, 0px, 30px);
    display: flex;
    flex-wrap: wrap;
    .empty-img-box {
      @include px2rem(height, 306px);
      @include px2rem(width, 330px);
      @include pm2rem(margin, 0px, 28px, 30px, 0px);
      position: relative;
      background-color: $ninth-grey;
    }
    .img-box {
      @include px2rem(height, 306px);
      @include px2rem(width, 330px);
      @include pm2rem(margin, 0px, 28px, 30px, 0px);
      position: relative;
      img {
        width: 100%;
        height: 100%;
        box-shadow: 0 4px 6px -2px rgba(0, 0, 0, 0.2);
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
      .cover {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, .5);
        @include px2rem(height, 50px);
        @include px2rem(width, 330px);
        color: $white;
        @include font-dpr(13px);
        @include px2rem(line-height, 50px);
        text-align: center;
      }
    }
  }
</style>
