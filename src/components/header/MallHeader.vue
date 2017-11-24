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
    <div class="flex icon-container">
      <div class="flex icon-text" @click="goCategorise()">
        <i class="iconfont icon-fenlei1"></i>
        <span>分类</span>
      </div>
      <div class="flex icon-text" @click="goReport()">
        <i class="iconfont icon-jubao"></i>
        <span>投诉</span>
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
    props: ['canClear'],
    methods: {
      goBack () {
        this.$emit('back')
      },
      goCategorise () {
        this.$emit('click-categories')
      },
      goReport () {
        this.$emit('report')
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
    @include px2rem(height, 100px);
    line-height: normal;
    align-items: center;
    justify-content: space-between;
    z-index: 4;
    background: url("../../assets/mallBg.png") no-repeat;
    background-size: cover;
    .icon-box {
      @include px2rem(width, 120px);
      height: inherit;
      color: $white;
      i {
        @include font-dpr(20px);
        line-height: normal;
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
    .icon-container {
      height: inherit;
      @include px2rem(padding-left, 30px);
    }
    .icon-text {
      color: $white;
      flex-direction: column;
      line-height: normal;
      @include pm2rem(margin, 10px, 30px, 0px, 5px);
      height: inherit;
    }
  }
</style>
