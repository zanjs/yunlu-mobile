<template>
  <section class="container">
    <div v-for="(item, index) in dataSource"
         :key="index"
         class="album"
         @click="handleClick(index)">
      <img :src="item.thumb_url"
           class="cover">
    </div>
  </section>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    name: 'Album',
    props: ['dataSource'],
    methods: {
      handleClick (value) {
        this.$emit('click', value)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .container {
    @include pm2rem(padding, 26px, 0px, 0px, 26px);
    border: 1px solid $fifth-grey;
    display: flex;
    flex-wrap: wrap;
    .album {
      position: relative;
      @include pm2rem(margin, 0px, 26px, 26px, 0px);
      .cover {
        @include px2rem(width, 312px);
        @include px2rem(height, 360px);
      }
    }
  }
</style>
