<template>
  <section class="search-bar">
    <div
      class="icon-box"
      @click="handleBack()">
      <i class="iconfont icon-fanhui"></i>
    </div>
    <div class="input-container">
      <slot name="input"></slot>
      <!--<input
        placeholder="搜一搜">-->
      <div
        v-show="canClear"
        class="clear-btn"
        @click.stop="handleClick()">
        <i class="iconfont icon-shanchubiaoqian"></i>
      </div>
    </div>
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
    display: flex;
    align-items: center;
    border-bottom: 1px solid #D1D1D1;
    .icon-box {
      @include pm2rem(padding, 0px, 40px, 0px, 30px);
      display: flex;
      align-items: center;
      justify-content: center;
      i {
        @include font-dpr(19px);
        color: #595959;
        line-height: 1;
      }
    }
    .input-container {
      display: flex;
      align-items: center;
      flex: 1;
      position: relative;
      @include px2rem(height, 70px);
      border: 1px solid #C2C2C2;
      @include px2rem(border-radius, 14px);
      background-color: #EDEDED;
      .clear-btn {
        position: absolute;
        @include px2rem(right, 20px);
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        justify-content: flex-end;
        i {
          @include font-dpr(21px);
          color: #D1D1D1;
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
