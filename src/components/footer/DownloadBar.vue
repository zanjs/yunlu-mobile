<template>
  <transition name="router-fade">
    <section v-if="show" class="download-bar-container full-width">
      <div class="wrapper">
        <a class="flex close" @click="close()">
          <i class="iconfont icon-guanbi"></i>
        </a>
        <a class="absolute-vertical flex btn" @click="download()">去制作</a>
      </div>
    </section>
  </transition>
</template>

<script>
  export default {
    name: 'DownLoadBar',
    props: {
      show: {
        default: true
      }
    },
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

  .download-bar-container {
    position: fixed;
    bottom: 0;
    .wrapper {
      position: relative;
      background: url("../../assets/downloadBarBg.png") no-repeat;
      background-size: 100% 100%;
      @include px2rem(height, 120px);
      @include px2rem(width, 750px);
      .close {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        height: inherit;
        @include px2rem(width, 96px);
        i {
          @include font-dpr(20px);
          color: $white;
        }
      }
      .btn {
        position: absolute;
        @include px2rem(height, 70px);
        @include px2rem(right, 26px);
        @include px2rem(width, 160px);
        color: $white;
        @include font-dpr(15px);
        @include px2rem(border-radius, 10px);
        background-color: $green;
        line-height: normal;
      }
      & a:active {
        opacity: .8;
      }
    }
  }
</style>
