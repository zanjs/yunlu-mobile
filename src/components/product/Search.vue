<template>
  <section class="search-bar">
    <div
      class="icon-box"
      @click="handleBack()">
      <i class="iconfont icon-fanhui"></i>
    </div>
    <form
      class="input-container"
      action=""
      target="iframe">
      <slot name="input"></slot>
      <div
        v-show="canClear"
        class="clear-btn"
        @click.stop="handleClick()">
        <i class="iconfont icon-shanchubiaoqian"></i>
      </div>
      <iframe
        name="iframe"
        style="display: none;">
      </iframe>
    </form>
    <a
      class="search-btn"
      @click="handleSearch()">搜索</a>
  </section>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props: ['canClear'],
  name: 'ProductSearchBar',
  methods: {
    handleClick () {
      this.$emit('clear')
    },
    handleSearch () {
      this.$emit('search')
    },
    handleBack () {
      this.$emit('back')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .search-bar {
    position: fixed;
    @include px2rem(height, 98px);
    width: 100%;
    max-width: 540px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid $fifth-grey;
    background-color: $white;
    z-index: 2;
    .icon-box {
      @include pm2rem(padding, 0px, 40px, 0px, 30px);
      display: flex;
      align-items: center;
      justify-content: center;
      i {
        @include font-dpr(19px);
        color: $second-dark;
        line-height: 1;
      }
    }
    .input-container {
      display: flex;
      align-items: center;
      flex: 1;
      position: relative;
      @include px2rem(height, 70px);
      @include px2rem(border-radius, 14px);
      background-color: $ninth-grey;
      .clear-btn {
        position: absolute;
        @include px2rem(right, 20px);
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        justify-content: flex-end;
        i {
          @include font-dpr(21px);
          color: $fifth-grey;
          @include px2rem(margin-top, -4px);
        }
      }
    }
    a:active {
      color: rgba(255, 0, 0, .5);
    }
    .search-btn {
      @include pm2rem(padding, 0px, 28px, 0px, 28px);
      height: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FF0000;
      @include font-dpr(15px);
      line-height: 1;
    }
  }
</style>
