<template>
  <section>
    <div class="gallery">
      <img v-for="(item, index) in dataSource"
           :key="index"
           :src="item.thumb_url"
           class="photo"
           @click="handleClick(index)">
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
    props: ['dataSource'],
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
    @include pm2rem(margin, 0px, 0px, 40px, 0px);
    @include pm2rem(padding, 10px, 4px, 0px, 12px);
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-content: flex-start;
    @include px2rem(min-height, 944px);
    .photo {
      @include px2rem(width, 236px);
      @include px2rem(height, 236px);
      @include pm2rem(margin, 0px, 8px, 10px, 0px)
    }
  }
</style>
