<template>
  <section>
    <div class="tags-container">
      <p class="title">热门搜索</p>
      <div class="tags">
        <a
          v-for="(item, index) in tags"
          :key="index"
          class="item"
          @click="handleClick(item)">
          {{item.name}}
        </a>
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
  props: ['tags'],
  methods: {
    handleClick (item) {
      this.$emit('click', item)
    }
  }
}
</script>

<style lang="scss" scopde>
  @import "../../styles/mixin";

  .tags-container {
    @include pm2rem(padding, 38px, 0px, 0px, 30px);
    .title {
      @include font-dpr(15px);
      @include px2rem(margin-bottom, 30px);
      color: $second-dark;
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      @include px2rem(padding-left, 16px);
      .item {
        display: flex;
        justify-content: center;
        align-items: center;
        align-content: flex-start;
        @include px2rem(border-radius, 8px);
        background-color: #E6E6E6;
        @include pm2rem(padding, 16px, 32px, 12px, 32px);
        @include pm2rem(margin, 0px, 46px, 40px, 0px);
        color: #888;
        @include font-dpr(14px);
        line-height: 1;
      }
      a:active {
        background-color: rgba(230, 230, 230, .7);
        color: rgba(136, 136, 136, .5);
      }
    }
  }
</style>
