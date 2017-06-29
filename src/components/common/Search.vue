<template>
  <section>
    <div class="search-container">
      <input type="text"
             v-model="searchParams"
             :placeholder="placeholder">
      <i class="iconfont icon-sousuo"
         @click.stop="handleClick"></i>
    </div>
  </section>
</template>

<script>
  export default {
    data () {
      return {
        searchParams: ''
      }
    },
    props: ['placeholder'],
    methods: {
      handleClick () {
        this.$emit('search', this.searchParams)
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
    left: 0;
    right: 0;
    z-index: 1001;
    border: none;
    box-sizing: border-box;
    input {
      background-color: #EDEDED;
      width: 100%;
      @include px2rem(border-radius, 14px);
      color: #595959;
      @include font-dpr(14px);
      @include px2rem(line-height, 58px);
      @include px2rem(height, 58px);
      vertical-align: middle;
      text-align: center;
      border: none;
    }
    ::-webkit-input-placeholder{
      color: #A6A6A6;
    }
    i {
      position: absolute;
      @include px2rem(right, 60px);
      @include px2rem(height, 10px);
      @include px2rem(top, 16px);
    }
  }
</style>
