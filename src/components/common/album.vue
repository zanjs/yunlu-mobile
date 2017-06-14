<template>
  <section class="container">
    <div v-for="(item, index) in dataSource"
         :key="index"
         class="album"
         @click="handleClick(item.id)">
      <img :src="item.cover"
           class="cover"/>
      <div class="label">
        <span class="text">{{item.title}}</span>
        <span class="count">{{item.count}}</span>
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
    name: 'Album',
    props: ['dataSource'],
    methods: {
      handleClick (value) {
        this.$emit('click', value)
      }
    },
    mountd: {

    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .container {
    @include pm2rem(padding, 26px, 26px, 0px, 0px);
    border: 1px solid #D1D1D1;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    .album {
      position: relative;
      @include pm2rem(margin, 0px, -26px, 26px, 0px);
      .cover {
        @include px2rem(width, 312px);
        @include px2rem(height, 360px);
      }
      .label {
        position: absolute;
        bottom: 0;
        width: 100%;
        background-color: rgba(0,0,0,.5);
        @include px2rem(height, 57px);
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: $white;
        .text {
          @include px2rem(padding-left, 26px);
        }
        .count {
          @include px2rem(width, 70px);
          background-color: $green;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
</style>
