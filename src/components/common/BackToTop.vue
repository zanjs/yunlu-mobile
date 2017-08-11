<template>
  <section>
    <div class="float-btn">
      <div
        class="cirlce-btn"
        @click="handleClick()">
        <i class="iconfont icon-dingzhi"></i>
        <p v-if="text">{{text}}</p>
        <p v-else>置顶</p>
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
    props: ['text'],
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
    @include px2rem(bottom, 76px);
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
      background-color: rgba(0, 0, 0, .68);
      line-height: 1;
      z-index: 1004;
      i {
        @include font-dpr(21px);
      }
      p {
        @include font-dpr(12px);
      }
    }
  }
</style>
