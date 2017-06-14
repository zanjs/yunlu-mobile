<template>
  <section class="container">
    <div v-for="(item, index) in albumList"
         :key="index"
         class="album">
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
        albumList: [{
          title: '武当三日游',
          cover: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
          count: 3
        }, {
          title: '踏青旅游',
          cover: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
          count: 12
        }, {
          title: '巴黎三日游',
          cover: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
          count: 19
        }, {
          title: '瑞士三日游',
          cover: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
          count: 36
        }, {
          title: '武当三日游',
          cover: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
          count: 3
        }, {
          title: '踏青旅游',
          cover: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
          count: 12
        }, {
          title: '巴黎三日游',
          cover: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
          count: 19
        }, {
          title: '瑞士三日游',
          cover: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
          count: 36
        }]
      }
    },
    methods: {},
    mountd: {

    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .container {
    @include pm2rem(padding, 26px, 26px, 0px, 26px);
    border: 1px solid #D1D1D1;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .album {
      position: relative;
      @include px2rem(margin-bottom, 26px);
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
