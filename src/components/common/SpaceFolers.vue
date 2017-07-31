<template>
  <section class="load-more-container">
    <div
      v-for="(item, index) in store"
      :key="index"
      class="container">
      <div class="title">
        <hr>
        <span>{{item.name}}</span>
        <hr>
      </div>
      <div
       v-if="item.photos && item.photos.length > 0"
       class="gallery-container">
        <div
          v-for="(i, indexI) in item.photos"
          :key="indexI"
          class="item"
          @click="viewFullScreen(item.count, item.photos, i.id, indexI)">
          <img v-lazy="i.thumb_url">
        </div>
        <div
          v-if="item.count > 5"
          class="item"
          @click="handleClick(item.id, item.name)">
          <div class="btn">
            <i class="iconfont icon-tubiaolunkuohua34"></i>
            <span>查看更多</span>
          </div>
        </div>
      </div>
      <div
        v-else
        class="empty-folder">
        该文件夹暂无图片展示
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
      handleClick (folderId, name) {
        this.$emit('view-more', {id: folderId, name: name})
      },
      viewFullScreen (count, photos, id, index) {
        if (count <= 5) {
          this.$emit('view-full-screen', {id: id, index: index, photos: photos})
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .load-more-container {
    @include px2rem(min-height, 660px);
  }
  .container {
    @include px2rem(width, 705px);
    margin: 0 auto;
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      @include px2rem(height, 62px);
      color: #595959;
      @include font-dpr(14px);
      hr {
        @include px2rem(width, 60px);
        background-color: #E0E0E0;
        border-top: 1px solid #E0E0E0;
        border-bottom: none;
      }
      span {
        @include pm2rem(margin, 0px, 30px, 0px, 30px);
      }
    }
    .gallery-container {
      background-color: $white;
      @include pm2rem(padding, 32px, 20px, 8px, 20px);
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      .item {
        @include px2rem(width, 221px);
        @include px2rem(height, 202px);
        @include pm2rem(margin, 0px, 0px, 24px, 0px);
        text-align: center;
        box-sizing: border-box;
        img {
          @include px2rem(width, 202px);
          @include px2rem(height, 202px);
        }
        img[lazy=loading] {
          @include px2rem(width, 202px);
          @include px2rem(height, 202px);
          background-position: center center!important;
          background: url("../../assets/imgLoading3.jpg");
          background-repeat: no-repeat;
          background-size: cover;
        }
        img[lazy=error] {
          @include px2rem(width, 202px);
          @include px2rem(height, 202px);
          background-position: center center!important;
          background: url("../../assets/imgLoadingError.png");
          background-repeat: no-repeat;
          background-size: cover;
        }
        img[lazy=loaded] {
          @include px2rem(width, 202px);
          @include px2rem(height, 202px);
        }
        .btn {
          @include px2rem(width, 202px);
          @include px2rem(height, 202px);
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          color: #46B2FF;
          border: 1px solid #46B2FF;
          margin: 0 auto;
          i {
            @include font-dpr(33px);
          }
          span {
            @include font-dpr(14px);
          }
        }
      }
    }
    .empty-folder {
      background-color: $white;
      @include pm2rem(padding, 32px, 20px, 32px, 20px);
      display: flex;
      justify-content: center;
      align-items: center;
      @include font-dpr(15px);
      color: #D1D1D1;
    }
  }
</style>
