<template>
  <section>
    <div class="gallery">
      <template v-if="loading && dataSource.length === 0">
        <div
          v-for="(item, index) in num"
          :key="index"
          class="empty-img">
        </div>
      </template>
      <template v-else>
        <img
          v-for="(item, index) in dataSource"
          :key="index"
          v-lazy="{
            src: item.thumb_url,
            error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
            loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
          }"
          class="photo"
          @click="handleClick(index)">
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
    name: 'Gallery',
    props: {
      dataSource: {
        required: true
      },
      num: {
        default: 24
      },
      loading: {
        default: true
      }
    },
    methods: {
      handleClick (index) {
        this.$emit('click', index)
      }
    },
    mounted () {
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../styles/mixin';

  .gallery {
    @include pm2rem(padding, 10px, 4px, 0px, 12px);
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-content: flex-start;
    .photo {
      @include px2rem(width, 236px);
      @include px2rem(height, 236px);
      @include pm2rem(margin, 0px, 8px, 10px, 0px);
    }
    .empty-img {
      @include px2rem(width, 236px);
      @include px2rem(height, 236px);
      @include pm2rem(margin, 0px, 8px, 10px, 0px);
      background-color: $ninth-grey;
    }
    img[lazy=loading] {
      @include px2rem(width, 236px);
      @include px2rem(height, 236px);
      @include pm2rem(margin, 0px, 8px, 10px, 0px);
      background-position: center center!important;
      background: url("../../assets/imgLoading3.jpg");
      background-repeat: no-repeat;
      background-size: cover;
    }
    img[lazy=error] {
     @include px2rem(width, 236px);
      @include px2rem(height, 236px);
      @include pm2rem(margin, 0px, 8px, 10px, 0px);
      background-position: center center!important;
      background: url("../../assets/imgLoadingError.png");
      background-repeat: no-repeat;
      background-size: cover;
    }
    img[lazy=loaded] {
      @include px2rem(width, 236px);
      @include px2rem(height, 236px);
      @include pm2rem(margin, 0px, 8px, 10px, 0px);
    }
  }
</style>
