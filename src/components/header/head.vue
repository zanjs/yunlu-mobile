<template>
  <header class="head-product">
    <div class="left"
         @click="$router.go(-1)">
      <i class="iconfont icon-fanhui"></i>
    </div>
    <section class="right">
      <div>
        <i class="iconfont icon-gouwuche"></i>
      </div>
      <div class="icon">
        <i class="iconfont icon-fenlei"></i>
      </div>
    </section>
  </header>
</template>

<script>
  export default {
    data () {
      return {}
    },
    name: 'ProductHeader',
    methods: {

    },
    mounted () {

    },
    computed: {

    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .head-product {
    background-color: transparent;
    width: 100%;
    @include px2rem(height, 88px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    top: 0;
    z-index: 999;
    div {
      display: flex;
      justify-content: center;
      align-items: center;
      @include px2rem(border-radius, 35px);
      @include px2rem(width, 70px);
      @include px2rem(height, 70px);
      background-color: rgba(0, 0, 0, 0.45);
      color: $white;
    }
    .left {
      @include pm2rem(margin, 0px, 0px, 0px, 20px);
    }
    .right {
      display: flex;
      justify-content: space-between;
      align-items: center;
      @include pm2rem(margin, 0px, 18px, 0px, 20px);
      .icon {
        @include pm2rem(margin, 0px, 0px, 0px, 28px);
      }
    }
  }

  .title {
    .title-text {
      text-align: center;
      font-weight: bold;
      color: $white;
      @include font-dpr(34px);
    }
  }
</style>
