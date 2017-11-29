<template>
  <section>
    <div v-if="loading && store.length === 0" class="gallery">
      <div
        v-for="(item, index) in num"
        :key="index"
        class="flex loading-box">
        <div class="img-loading"></div>
        <p></p>
      </div>
    </div>
    <div v-else class="gallery">
      <div
        v-for="(item, index) in store"
        :key="index"
        @click.stop="handleClick(item)"
        class="img-box white-bg">
        <img
          v-lazy="{
            src: item.logo,
            error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
            loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
          }"
          class="normal">
          <p class="flex font-12 second-text">{{item.name}}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    props: ['store', 'loading', 'num'],
    data () {
      return {

      }
    },
    methods: {
      handleClick (item) {
        this.$emit('click', item)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .gallery {
    @include pm2rem(padding, 20px, 15px, 0px, 30px);
    @include px2rem(min-height, 600px);
    display: flex;
    flex-wrap: wrap;
    .img-box {
      @include px2rem(width, 220px);
      @include px2rem(height, 280px);
      @include pm2rem(margin, 0px, 15px, 20px, 0px);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      box-sizing: border-box;
      border: 1px solid $tenth-grey;
      box-shadow: 0 4px 6px -2px rgba(181, 181, 181, 0.2);
      img[lazy=loading] {
        @include px2rem(height, 220px);
        width: 100%;
        background-position: center center!important;
        background: url("../../assets/imgLoading3.jpg");
        background-repeat: no-repeat;
        background-size: cover;
      }
      img[lazy=error] {
        @include px2rem(height, 220px);
        width: 100%;
        background-position: center center!important;
        background: url("../../assets/imgLoadingError.png");
        background-repeat: no-repeat;
        background-size: cover;
      }
      img[lazy=loaded] {
        @include px2rem(height, 220px);
        width: 100%;
      }
      .normal {
        @include px2rem(height, 220px);
        width: 100%;
      }
      p {
        @include px2rem(height, 60px);
        @include px2rem(width, 220px);
        background-color: $white;
        line-height: normal;
      }
    }
    .loading-box {
      @include px2rem(width, 220px);
      @include px2rem(height, 280px);
      @include pm2rem(margin, 0px, 15px, 20px, 0px);
      flex-direction: column;
      box-sizing: border-box;
      border: 1px solid $tenth-grey;
      background-color: $white;
      box-shadow: 0 4px 6px -2px rgba(181, 181, 181, 0.2);
      .img-loading {
        width: inherit;
        background-color: $ninth-grey;
        @include px2rem(height, 220px);
      }
      p {
        @include px2rem(width, 160px);
        @include px2rem(height, 40px);
        @include pm2rem(margin, 10px, 0px, 10px, 0px);
        background-color: $ninth-grey;
      }
    }
  }
</style>
