<template>
  <section class="gallery">
    <div
      v-for="(item, index) in store"
      :key="index"
      @click.stop="handleClick(item)"
      class="img-container">
      <img v-lazy="{
            src: item.files[0].thumb_url,
            error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
            loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
          }">
      <div class="cover">
        <span class="ellipsis">{{item.name}}</span>
        <span>({{item.files.length}})</span>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props: ['store'],
  methods: {
    handleClick (item) {
      this.$emit('click', item)
    }
  }
}
</script>

<style lang="scss" scoped>
   @import '../../styles/mixin.scss';
  .gallery {
    @include pm2rem(padding, 16px, 2px, 0px, 30px);
    display: flex;
    flex-wrap: wrap;
    .img-container {
      @include px2rem(height, 306px);
      @include px2rem(width, 330px);
      @include pm2rem(margin, 0px, 28px, 30px, 0px);
      position: relative;
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
      .cover {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, .5);
        @include px2rem(height, 50px);
        display: flex;
        justify-content: center;
        color: $white;
        @include font-dpr(13px);
        line-height: normal;
        align-items: center;
      }
    }
  }
</style>
