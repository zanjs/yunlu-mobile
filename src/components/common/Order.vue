<template>
  <section>
    <div class="option-bar">
      <div class="item">
        <div class="text"
             @click="changeOrder(orderUp)">价格</div>
        <div class="order-icon">
          <div class="icon-box">
            <i class="iconfont icon-shang"
               v-bind:class="{'icon-actinve': orderUp, 'icon-inactive': !orderUp}"></i>
          </div>
          <div class="icon-box">
            <i class="iconfont icon-xia"
               v-bind:class="{'icon-actinve': !orderUp, 'icon-inactive': orderUp}"></i>
          </div>
        </div>
      </div>
      <div class="item">
        <i class="iconfont"
           v-bind:class="{'icon-liebiao': !showList, 'icon-liebiao1': showList}"
           @click="swithList(showList)"></i>
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
  props: ['orderUp', 'showList'],
  methods: {
    changeOrder (val) {
      this.$emit('order-change', !val)
    },
    swithList (val) {
      this.$emit('switch', !val)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin.scss';

  .option-bar {
    @include px2rem(height, 74px);
    border-top: 1px solid $fifth-grey;
    border-bottom: 1px solid $fifth-grey;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    @include px2rem(top, 176px);
    background-color: $white;
    z-index: 1001;
    width: 100%;
    max-width: 540px;
    .item {
      height: inherit;
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
      .order-icon {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        i {
          @include font-dpr(12px);
          line-height: 1;
        }
      }
      .text {
        @include font-dpr(16px);
        line-height: 1;
        @include px2rem(padding-right, 50px);
        @include px2rem(margin-right, -40px);
        color: $second-dark;
      }
    }
    .icon-box {
      @include px2rem(width, 24px);
      @include px2rem(height, 24px);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .icon-actinve {
      color: $green;
    }
    .icon-inactive {
      color: $third-dark;
    }
  }
</style>
