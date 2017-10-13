<template>
  <section>
    <div
      class="float-btn"
      :class="{'up': single}">
      <div
        class="cirlce-btn"
        @click="handleClick()">
        <i class="iconfont icon-tianjiashoucang"></i>
        <p v-if="text">{{text}}</p>
        <p v-else>收藏</p>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    data () {
      return {

      }
    },
    props: ['text', 'single'],
    methods: {
      handleClick () {
        this.$emit('click')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .float-btn {
    position: fixed;
    @include px2rem(bottom, 200px);
    @include px2rem(height, 0px);
    display: block;
    width: 100%;
    max-width: 540px;
    .cirlce-btn {
      right: 0;
      bottom: 0;
      @include px2rem(width, 100px);
      @include px2rem(height, 100px);
      @include px2rem(border-radius, 50px);
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      @include px2rem(margin-right, 40px);
      color: $white;
      background-color: rgba(254, 104, 48, 0.8);
      line-height: 1;
      z-index: 1004;
      box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px rgba(0,0,0,.14), 0 1px 18px rgba(0,0,0,.12);
      i {
        @include font-dpr(21px);
      }
      p {
        @include font-dpr(12px);
      }
    }
  }

  .up {
    @include px2rem(bottom, 76px);
  }
</style>
