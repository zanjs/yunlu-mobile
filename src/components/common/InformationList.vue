<template>
  <section id="informationList">
    <div
      v-if="store && store.length > 0"
      class="gallery">
      <div v-for="(item, index) in store"
           :key="index"
           @click.stop="handleClick(item)"
           class="img-box">
        <img :src="item.url">
        <div class="cover">
          {{item.cnname}}（{{item.count}}）
        </div>
      </div>
    </div>
    <div
      v-else
      class="no-info">
      <img src="../../assets/noInformation.png">
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
        @include px2rem(height, 50px);
        display: flex;
        justify-content: center;
        color: $white;
        @include font-dpr(13px);
        @include line-height(26px);
      }
    }
  }
  .no-info {
    @include pm2rem(padding, 100px, 20px, 100px, 0px);
    @include pm2rem(margin, 20px, 22px, 0px, 22px);
    background-color: $white;
    text-align: center;
    img {
      @include px2rem(width, 360px);
      height: auto;
    }
  }
</style>
