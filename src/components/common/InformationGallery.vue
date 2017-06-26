<template>
  <section class="gallery">
    <div
      v-for="(item, index) in store"
      :key="index"
      @click.stop="handleClick(item)"
      class="img-container">
      <img :src="item.files[0].url">
      <div class="cover">
        {{item.name}}（{{item.files.length}})
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
        @include line-height(26px);
      }
    }
  }
</style>
