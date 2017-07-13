<template>
  <section>
    <div class="list-container">
      <div
        class="row-item">
        <div
          class="check-box">
          <i class="iconfont icon-xuanzhong"></i>
        </div>
        <div
          class="container">
          <img>
          <div
            class="content">
            <div class="top">

            </div>
            <div class="msg">

            </div>
          </div>
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
    methods: {

    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .list-container {
    background-color: $white;
    .row-item {
      display: flex;
      align-items: center;
      .check-box {
        @include px2rem(width, 74);
        @include px2rem(padding-left, 28px);
        i {
          @include font-dpr(21px);
          color: #D1D1D1;
        }
      }
    }
  }
</style>
