<template>
  <section>
    <form
      class="search-container full-width"
      action=""
      target="iframe"
      :class="{'active': show}">
      <slot name="input">
      </slot>
      <i
        class="iconfont icon-sousuo absolute-vertical"
        @click.stop="handleClick"></i>
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
    props: ['show'],
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
    border: none;
    box-sizing: border-box;
    box-shadow: 0 1px 5px rgba(0,0,0,.2);
    opacity: .8;
    transform: translateY(-140px);
    transition: all .3s ease-in-out;
    input {
      background-color: $ninth-grey;
      width: 100%;
      @include px2rem(border-radius, 14px);
      color: $second-dark;
      @include font-dpr(14px);
      line-height: normal;
      @include px2rem(height, 66px);
      text-align: center;
      border: none;
    }
    ::-webkit-input-placeholder{
      color: $third-dark;
      @include px2rem(height, 66px);
      line-height: normal;
      text-align: center;
      border: none;
    }
    i {
      @include px2rem(right, 60px);
      @include px2rem(height, 58px);
      @include px2rem(padding-top, 8px);
      color: $eleventh-grey;
      @include px2rem(line-height, 58px);
    }
  }
  .active {
    transform: translateY(0);
    opacity: 1;
  }

</style>
