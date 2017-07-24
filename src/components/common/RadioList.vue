<template>
  <section>
    <div
      v-for="(item, index) in store"
      :key="index"
      class="list">
      <a
        class="item"
        @click="handleChecked(item.value)">
        <i
          v-if="item.value !== value"
          class="iconfont icon-weixuanzhong"></i>
        <i
          v-if="item.value === value"
          class="iconfont icon-xuanzhong checked"></i>
        <p>{{item.label}}</p>
      </a>
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props: ['store', 'value'],
  methods: {
    handleChecked (val) {
      this.$emit('checked', val)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .list {
    background-color: $white;
    a:active {
      background-color: rgba(239, 234, 234, .5);
    }
    .item {
      display: flex;
      align-items: center;
      @include px2rem(height, 94px);
      @include px2rem(line-height, 94px);
      i {
        @include font-dpr(21px);
        @include pm2rem(margin, 0px, 20px, 0px, 30px);
        color: #A6A6A6;
      }
      p {
        @include font-dpr(16px);
        color: #262626;
      }
      .checked {
        color: #52CAA7;
      }
    }
  }
</style>
