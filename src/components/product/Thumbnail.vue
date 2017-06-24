<template>
  <section>
    <div class="gallery">
      <div v-for="(item, index) in store"
           :key="index"
           @click.stop="handleClick(item)"
           class="img-box">
        <img :src="item.file_url">
        <div class="cover">
          <span class="name">{{item.name}}</span>
          <span class="money">&yen; ：{{item.prices[0].money}}</span>
        </div>
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
  name: 'ProductThumbnailMode',
  props: ['store'],
  methods: {
    handleClick (item) {
      this.$emit('click', item)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .gallery {
    @include pm2rem(padding, 16px, 2px, 0px, 30px);
    display: flex;
    flex-wrap: wrap;
    .img-box {
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
        @include px2rem(height, 90px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: $white;
        @include pm2rem(padding, 0px, 00px, 0px, 20px);
        @include font-dpr(13px);
        .money {
          font-weight: bold;
        }
      }
    }
  }
</style>
