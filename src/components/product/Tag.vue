<template>
  <section class="tags-container">
    <a
      v-for="(item, index) in tags"
      :key="index"
      :class="{'active': price.id === item.id && active}"
      @click="handleClick(item)">
      <span class="second-text font-12">&yen;</span>
      <span class="second-text font-14">{{item.money}}</span>
    </a>
  </section>
</template>

<script>
  export default {
    data () {
      return {

      }
    },
    props: ['tags', 'price', 'active'],
    methods: {
      handleClick (item) {
        this.$emit('tag-click', item)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .tags-container {
    display: flex;
    flex-wrap: wrap;
    a {
      @include pm2rem(padding, 0px, 30px, 0px, 30px);
      @include pm2rem(margin, 0px, 20px, 20px, 0px);
      @include px2rem(line-height, 60px);
      @include px2rem(height, 60px);
      vertical-align: middle;
      background-color: $tenth-grey;
      display: inline-block;
      @include px2rem(border-radius, 10px);
      box-sizing: border-box;
      cursor: pointer;
    }
    .active {
      background-color: $green;
      span {
        color: $white;
      }
    }
  }
</style>
