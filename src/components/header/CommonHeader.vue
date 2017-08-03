<template>
  <mt-header
    :title="title"
    class="header full-width font-17">
    <mt-button
      slot="left"
      @click="handleClick()"
      class="font-15">
      <i class="iconfont icon-fanhui font-20"></i>
    </mt-button>
    <mt-button
      v-if="iconClass"
      slot="right"
      @click="handleRightClick()"
      class="font-15 button-text">
      <i
        class="iconfont font-20"
        v-bind:class="iconClass"></i>
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
    h1 {
      @include font-dpr(17px);
    }
    .button-text {
      @include font-dpr(15px);
    }
  }
</style>
