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
    a {
      @include pm2rem(padding, 10px, 30px, 10px, 30px);
      @include px2rem(margin-right, 20px);
      line-height: normal;
      border: 1px solid $tenth-grey;
      background-color: $tenth-grey;
      @include px2rem(border-radius, 10px);
    }
    .active {
      background-color: $green;
      span {
        color: $white;
      }
    }
  }
</style>
