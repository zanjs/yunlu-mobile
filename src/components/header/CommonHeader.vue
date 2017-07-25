<template>
  <mt-header
    :title="title"
    class="header">
    <mt-button
      slot="left"
      @click="handleClick()"
      class="button-text">
      <i class="iconfont icon-fanhui"></i>
    </mt-button>
    <mt-button
      v-if="iconClass"
      slot="right"
      @click="handleRightClick()"
      class="button-text">
      <i
        class="iconfont"
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
    @include font-dpr(17px);
    position: fixed;
    top: 0;
    width: 100%;
    max-width: 540px;
    z-index: 1002 !important;
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
