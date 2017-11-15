<template>
  <section class="container full-width">
    <div class="icon-box flex">
      <i class="iconfont icon-fanhui"></i>
    </div>
    <div class="search flex">
      <input class="flex" placeholder="请输入关键字">
    </div>
    <div class="flex icon-text">
      <i class="iconfont icon-liebiao1"></i>
      <span>分类</span>
    </div>
    <div class="flex icon-text">
      <i class="iconfont icon-jubao"></i>
      <span>投诉</span>
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
    z-index: 2;
    background: url("../../assets/confirmQQ.png") no-repeat;
    background-size: cover;
    .icon-box {
      @include px2rem(width, 120px);
      height: inherit;
      color: $white;
    }
    .search {
      height: inherit;
      flex: 1;
      input {
        flex: 1;
        @include px2rem(height, 60px);
        @include px2rem(border-radius, 40px);
        border: none;
        @include pm2rem(padding, 0px, 20px, 0px, 20px);
      }
    }
    .icon-text {
      color: $white;
      flex-direction: column;
      line-height: normal;
      @include px2rem(width, 120px);
      height: inherit;
      span {
        @include px2rem(margin-top, 10px);
      }
    }
  }
</style>
