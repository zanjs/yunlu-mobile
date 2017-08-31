<template>
  <section>
    <div class="order-container">
      <div class="item">
        <a
        @click="handleClick('', false)"
        v-bind:class="{'active': sortType === ''}">综合</a>
      </div>
      <div class="item">
        <a
          class="text-btn"
          v-bind:class="{'active': sortType !== ''}"
          @click="handleClick(sortType, true)">价格</a>
        <div class="icon-box">
          <i
            class="iconfont icon-shang"
            v-bind:class="{'active': sortType === 1}"></i>
          <i
            class="iconfont icon-xia"
            v-bind:class="{'active': sortType === -1}"></i>
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
  name: 'SearchProductsOrder',
  props: ['sortType'],
  methods: {
    handleClick (item, bool) {
      if (bool) {
        if (item === '') {
          this.$emit('sort', 1)
        } else {
          this.$emit('sort', 0 - item)
        }
      } else {
        this.$emit('sort', item)
      }
    }
  }
}
</script>

<style lang="scss" scopde>
  @import "../../styles/mixin";

  .order-container {
    display: flex;
    align-items: center;
    @include px2rem(height, 74px);
    border-top: 1px solid $third-grey;
    border-bottom: 1px solid $third-grey;
    background-color: $white;
    .item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $second-dark;
      @include font-dpr(14px);
      font-weight: bold;
      a:active {
        color: rgba(0, 0, 0, .5);
      }
      .text-btn {
        @include pm2rem(padding, 0px, 80px, 0px, 0px);
        @include px2rem(margin-right, -60px);
      }
      .icon-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: $third-dark;
        i {
          @include font-dpr(12px);
          line-height: 1;
        }
      }
      .active {
        color: $green;
      }
    }
  }
</style>
