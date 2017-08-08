<template>
  <section class="load-more-container">
    <template
      v-for="(item, index) in store">
      <div
        :key="index"
        v-if="item.photos.length > 0"
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
            <img v-lazy="{
                  src: i.thumb_url,
                  error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
                  loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
                }">
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
          <img src="../../assets/noFolderImages.png">
          <p>该文件夹暂无图片</p>
        </div>
      </div>
    </template>
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
    @include px2rem(margin-bottom, 20px);
  }
  .container {
    @include px2rem(width, 705px);
    margin: 0 auto;
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      @include px2rem(height, 62px);
      color: $second-dark;
      @include font-dpr(15px);
      hr {
        @include px2rem(width, 60px);
        background-color: $second-grey;
        border-top: 1px solid $second-grey;
        border-bottom: none;
      }
      span {
        @include pm2rem(margin, 0px, 30px, 0px, 30px);
      }
    }
    .gallery-container {
      background-color: $white;
      @include pm2rem(padding, 32px, 19px, 8px, 19px);
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      border: 1px solid $third-grey;
      box-sizing: border-box;
      .item {
        @include px2rem(width, 220px);
        @include px2rem(height, 200px);
        @include pm2rem(margin, 0px, 0px, 24px, 0px);
        text-align: center;
        box-sizing: border-box;
        img {
          @include px2rem(width, 200px);
          @include px2rem(height, 200px);
        }
        img[lazy=loading] {
          @include px2rem(width, 200px);
          @include px2rem(height, 200px);
          background-position: center center!important;
          background: url("../../assets/imgLoading3.jpg");
          background-repeat: no-repeat;
          background-size: cover;
        }
        img[lazy=error] {
          @include px2rem(width, 200px);
          @include px2rem(height, 200px);
          background-position: center center!important;
          background: url("../../assets/imgLoadingError.png");
          background-repeat: no-repeat;
          background-size: cover;
        }
        img[lazy=loaded] {
          @include px2rem(width, 200px);
          @include px2rem(height, 200px);
        }
        .btn {
          @include px2rem(width, 200px);
          @include px2rem(height, 200px);
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
      flex-direction: column;
      justify-content: center;
      align-items: center;
      @include font-dpr(15px);
      color: $fifth-grey;
      border: 1px solid $third-grey;
      img {
        @include px2rem(width, 263px);
        @include px2rem(height, 159px);
        @include px2rem(margin-bottom, 20px);
      }
    }
  }
</style>
