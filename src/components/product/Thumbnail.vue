<template>
  <section>
    <div class="gallery">
      <div v-for="(item, index) in store"
           :key="index"
           @click.stop="handleClick(item)"
           class="img-box">
        <img
          v-if="item.file_thumb_urls"
          :src="item.file_thumb_urls"
          class="normal">
        <img
          v-else
          src="../../assets/imgLoading.png"
          class="empty">
         <div class="cover">
           <div class="wraper">
            <div class="name">{{item.name}}</div>
            <div class="money">&yen; ：{{item.prices[0].money}}</div>
           </div>
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
    @include pm2rem(padding, 16px, 8px, 0px, 22px);
    @include px2rem(min-height, 600px);
    display: flex;
    flex-wrap: wrap;
    .img-box {
      // @include px2rem(height, 396px);
      @include px2rem(width, 346px);
      @include pm2rem(margin, 0px, 14px, 20px, 0px);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      border: 1px solid #E0E0E0;
      box-sizing: border-box;
      .normal {
        @include px2rem(height, 346px);
        width: 100%;
        // @include px2rem(width, 346px);
      }
      .empty {
        // width: 60%;
        // height: 60%;
        @include px2rem(height, 346px);
        @include px2rem(width, 346px);
      }
      .cover {
        @include px2rem(height, 110px);
        display: block;
        color: #262626;
        @include font-dpr(14px);
        width: inherit;
        .wraper {
          @include pm2rem(padding, 0px, 0px, 0px, 20px);
          width: inherit;
          height: inherit;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          box-sizing: border-box;
          div {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            width: 100%;
          }
          .name {
            @include pm2rem(margin, 16px, 0px, 16px, 0px);
            line-height: 1;
            box-sizing: border-box;
            position: relative;
          }
          .money {
            font-weight: bold;
            box-sizing: border-box;
            color: #FF0000;
          }
        }
      }
    }
  }
</style>
