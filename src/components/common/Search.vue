<template>
  <section>
    <div class="search-container">
      <slot name="input">
      </slot>
      <i
        class="iconfont icon-sousuo"
        @click.stop="handleClick"></i>
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
      handleClick () {
        this.$emit('search')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin.scss';

  .search-container {
    background-color: $white;
    @include pm2rem(padding, 12px, 32px, 12px, 32px);
    position: fixed;
    @include px2rem(top, 88px);
    z-index: 1001;
    width: 100%;
    max-width: 540px;
    border: none;
    box-sizing: border-box;
    input {
      background-color: #EDEDED;
      width: 100%;
      @include px2rem(border-radius, 14px);
      color: #595959;
      @include font-dpr(14px);
      line-height: 1;
      @include px2rem(height, 58px);
      vertical-align: middle;
      text-align: center;
      border: none;
    }
    ::-webkit-input-placeholder{
      color: #A6A6A6;
      @include px2rem(height, 58px);
      vertical-align: middle;
      text-align: center;
      border: none;
    }
    i {
      position: absolute;
      @include px2rem(right, 60px);
      @include px2rem(height, 58px);
      @include px2rem(padding-top, 8px);
      color: #B4B4B4;
      @include px2rem(line-height, 58px);
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
