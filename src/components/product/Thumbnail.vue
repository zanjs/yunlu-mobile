<template>
  <section>
    <div class="gallery">
      <div
        v-for="(item, index) in store"
        :key="index"
        @click.stop="handleClick(item)"
        class="img-box white-bg">
        <img
          v-if="item.file_thumb_urls"
          v-lazy="{
            src: item.file_thumb_urls,
            error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
            loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
          }"
          class="normal">
        <img
          v-else
          src="../../assets/imgLoadingError.png"
          class="empty">
         <div class="cover">
           <div class="wraper">
            <div class="name">{{item.name}}</div>
            <div class="money">
              <span class="font-12">&yen;</span>
              <span class="font-18">
                {{item.prices.length === 0 ? '定制' : item.prices[0].money}}
              </span>
            </div>
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
      @include px2rem(width, 346px);
      @include px2rem(height, 460px);
      @include pm2rem(margin, 0px, 14px, 20px, 0px);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      box-sizing: border-box;
      border: 1px solid $tenth-grey;
      box-shadow: 0 4px 6px -2px rgba(181, 181, 181, 0.2);
      img[lazy=loading] {
        @include px2rem(height, 346px);
        width: 100%;
        background-position: center center!important;
        background: url("../../assets/imgLoading3.jpg");
        background-repeat: no-repeat;
        background-size: cover;
      }
      img[lazy=error] {
        @include px2rem(height, 346px);
        width: 100%;
        background-position: center center!important;
        background: url("../../assets/imgLoadingError.png");
        background-repeat: no-repeat;
        background-size: cover;
      }
      img[lazy=loaded] {
        @include px2rem(height, 346px);
        width: 100%;
      }
      .normal {
        @include px2rem(height, 346px);
        width: 100%;
      }
      .empty {
        @include px2rem(height, 346px);
        @include px2rem(width, 346px);
      }
      .cover {
        @include px2rem(height, 110px);
        display: block;
        color: $primary-dark;
        @include font-dpr(14px);
        width: inherit;
        .wraper {
          @include pm2rem(padding, 0px, 0px, 0px, 20px);
          width: inherit;
          height: inherit;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          box-sizing: border-box;
          div {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            width: 100%;
          }
          .name {
            @include pm2rem(margin, 10px, 0px, 14px, 0px);
            line-height: normal;
            box-sizing: border-box;
            position: relative;
          }
          .money {
            box-sizing: border-box;
            color: #FF0000;
            line-height: normal;
          }
        }
      }
    }
  }
</style>
