<template>
  <section>
    <div class="option-bar" :class="{'active': show}">
      <div class="item">
        <div class="text" @click="changeOrder(orderUp)">
          价格
        </div>
        <div class="order-icon">
          <div class="icon-box">
            <i
              class="iconfont icon-shang"
              :class="{'icon-actinve': orderUp, 'icon-inactive': !orderUp}"></i>
          </div>
          <div class="icon-box">
            <i
              class="iconfont icon-xia"
              :class="{'icon-actinve': !orderUp, 'icon-inactive': orderUp}"></i>
          </div>
        </div>
      </div>
      <div class="item">
        <i
          class="iconfont icon-liebiao"
          :class="{'icon-liebiao1': showList}"
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
    props: ['orderUp', 'showList', 'show'],
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
    box-shadow: 0 6px 8px -4px rgba(0, 0, 0, .2);
    transition: opacity .3s;
    opacity: 0;
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
      transition: color .3s;
    }
    .icon-inactive {
      color: $third-dark;
      transition: color .3s;
    }
    &.active {
      transition: opacity .3s;
      opacity: 1;
    }
  }
</style>
