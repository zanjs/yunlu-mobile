<template>
  <section class="container full-width">
    <div class="icon-box flex" @click="goBack()">
      <i class="iconfont icon-fanhui"></i>
    </div>
    <form
      class="input-container"
      action=""
      target="iframe">
      <slot name="input"></slot>
      <i
        class="iconfont icon-sousuo absolute-vertical"
        @click.stop="handleSearch()"></i>
      <iframe
        name="iframe"
        style="display: none;">
      </iframe>
    </form>
  </section>
</template>

<script>
  export default {
    data () {
      return {

      }
    },
    methods: {
      goBack () {
        this.$emit('back')
      },
      handleSearch () {
        this.$emit('search')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .container {
    position: fixed;
    display: flex;
    @include px2rem(height, 88px);
    line-height: normal;
    align-items: center;
    justify-content: space-between;
    z-index: 3;
    background-color: $green;
    @include pm2rem(padding, 0px, 130px, 0px, 30px);
    box-sizing: border-box;
    .icon-box {
      @include px2rem(width, 100px);
      height: inherit;
      color: $white;
      justify-content: flex-start;
      i {
        @include font-dpr(20px);
      }
    }
    .input-container {
      height: inherit;
      flex: 1;
      display: flex;
      align-items: center;
      position: relative;
      @include px2rem(height, 60px);
      @include px2rem(border-radius, 40px);
      background-color: $ninth-grey;
      input {
        background-color: $white;
        width: 100%;
        @include px2rem(height, 60px);
        @include px2rem(border-radius, 40px);
        @include pm2rem(padding, 0px, 60px, 0px, 30px);
        color: $second-dark;
        @include font-dpr(14px);
        line-height: normal;
        border: none;
      }
      ::-webkit-input-placeholder{
        color: $third-dark;
        @include px2rem(height, 60px);
        @include pm2rem(padding, 0px, 60px, 0px, 0px);
        line-height: normal;
        border: none;
      }
      i {
        @include px2rem(right, 20px);
        @include px2rem(height, 58px);
        @include px2rem(padding-top, 8px);
        color: $eleventh-grey;
        @include px2rem(line-height, 58px);
      }
    }
  }
</style>
