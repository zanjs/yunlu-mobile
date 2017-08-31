<template>
  <section>
    <div class="bar-container full-width">
      <img src="../../assets/downloadBarBg.png">
      <div
        class="icon-box"
        @click="close()">
        <i class="iconfont icon-guanbi"></i>
      </div>
      <a
        class="download-btn absolute-vertical"
        @click="download()">
        下载APP
      </a>
    </div>
  </section>
</template>

<script>
  export default {
    data () {
      return {

      }
    },
    methods: {
      close () {
        this.$emit('close')
      },
      download () {
        this.$emit('download')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .bar-container {
    line-height: normal;
    position: relative;
    @include px2rem(height, 120px);
    img {
      width: 100%;
      height: 100%;
    }
    .icon-box {
      position: absolute;
      top: 0;
      left: 0;
      @include px2rem(width, 102px);
      @include px2rem(height, 120px);
      display: flex;
      align-items: center;
      justify-content: center;
      i {
        @include font-dpr(21px);
        color: $white;
      }
    }
    .download-btn {
      position: absolute;
      @include px2rem(right, 34px);
      @include px2rem(height, 70px);
      @include px2rem(width, 165px);
      @include px2rem(border-radius, 10px);
      display: flex;
      justify-content: center;
      align-items: center;
      @include font-dpr(14px);
      color: #2C5B39;
      background-color: #92F9DB;
    }
  }
</style>
