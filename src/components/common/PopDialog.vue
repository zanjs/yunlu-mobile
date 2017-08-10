<template>
  <section>
    <div
      class="pop-bg full-width"
      @click.stop="handleClick">
    </div>
    <div class="pop-dialog">
      <div
        class="close-btn flex"
        @click.stop="handleClick">
        <i class="iconfont icon-guanbi"></i>
      </div>
      <div class="container">
         <div class="img-container">
          <img
            v-if="store.type === 0"
            src="../../assets/confirmQQ.png">
          <img
            v-if="store.type === 1"
            src="../../assets/confirmWeiChat.png">
          <img
            v-if="store.type === 2"
            src="../../assets/confirmEmail.png">
         </div>
        <div class="content">
          <div class="name">{{store.name}}</div>
          <div class="value">{{store.value}}</div>
        </div>
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
    name: 'PopDialog',
    props: ['store'],
    methods: {
      handleClick () {
        this.$emit('close')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .pop-bg {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 1004;
    background-color: rgba(0, 0, 0, .45);
  }
  .pop-dialog {
    @include px2rem(width, 700px);
    position: fixed;
    @include px2rem(top, 200px);
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 1005 !important;
    .close-btn {
      position: absolute;
      top: 0;
      @include px2rem(width, 70px);
      @include px2rem(height, 70px);
      @include px2rem(right, 20px);
      i {
        @include font-dpr(32px);
        color: $white;
        line-height: 1;
      }
    }
    .container {
      @include px2rem(padding-top, 70px);
      @include px2rem(width, 562px);
      margin: 0 auto;
      .img-container {
        @include px2rem(width, 562px);
        @include px2rem(height, 213px);
        img {
          width: 100%;
          height: 100%;
        }
      }
      .content {
        background-color: $white;
        @include px2rem(height, 150px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        line-height: 1;
        .name {
          @include font-dpr(16px);
          color: $second-dark;
          @include px2rem(margin-bottom, 20px);
        }
        .value {
          @include font-dpr(15px);
          color: $red;
        }
      }
    }
  }
</style>
