<template>
  <mt-header
    :title="title"
    class="header full-width">
    <mt-button
      slot="left"
      @click="handleClick()"
      class="font-15">
      <i class="iconfont icon-fanhui"></i>
    </mt-button>
    <mt-button
      v-if="iconClass || rightText"
      slot="right"
      @click="handleRightClick()"
      class="font-15 button-text">
      <i
        class="iconfont"
        v-bind:class="iconClass || ''"></i>
      {{rightText | textFilter}}
    </mt-button>
  </mt-header>
</template>

<script>
  export default {
    data () {
      return {

      }
    },
    props: ['title', 'iconClass', 'rightText'],
    methods: {
      handleClick () {
        this.$emit('back')
      },
      handleRightClick () {
        this.$emit('right-click')
      }
    },
    filters: {
      textFilter (val) {
        return val || ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .header {
    background-color: $green;
    @include px2rem(height, 88px);
    @include pm2rem(padding, 0px, 30px, 0px, 30px);
    position: fixed;
    top: 0;
    z-index: 1002 !important;
    @include font-dpr(17px);
    h1 {
      @include font-dpr(17px);
    }
    .button-text {
      @include font-dpr(15px);
    }
    i {
      @include font-dpr(20px);
    }
  }
</style>
