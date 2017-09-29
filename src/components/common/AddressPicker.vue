<template>
  <section class="container">
    <slot name="header"></slot>
    <transition
      name="fade"
      mode="out-in"
      :appear="true">
      <div
        v-if="level === 0"
        key="0">
        <a
          v-for="(p, index) in province"
          :key="index"
          class="flex-between row-item"
          @click="handleSelect(1, p.code, p.name)">
          <span class="primary-text font-15">{{p.name}}</span>
          <i class="iconfont icon-you font-20"></i>
        </a>
      </div>
      <div
        v-if="level === 1"
        key="1">
        <a
          v-for="(c, index) in city"
          :key="index"
          class="flex-between row-item"
          @click="handleSelect(2, c.code, c.name)">
          <span class="primary-text font-15">{{c.name}}</span>
          <i class="iconfont icon-you font-20"></i>
        </a>
      </div>
      <div
        v-if="level === 2"
        key="2">
        <a
          v-for="(d, index) in district"
          :key="index"
          class="flex-between row-item"
          @click="handleSelect(3, d.code, d.name)">
          <span class="primary-text font-15">{{d.name}}</span>
          <i class="iconfont icon-you font-20"></i>
        </a>
      </div>
    </transition>
  </section>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    props: ['level', 'province', 'city', 'district'],
    methods: {
      handleSelect (level, code, name) {
        this.$emit('select', {level: level, code: code, name: name})
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .container {
    width: 100%;
  }
  .row-item {
    align-items: center;
    @include px2rem(height, 80px);
    @include pm2rem(padding, 0px, 20px, 0px, 36px);
    border-bottom: 1px solid $twelfth-grey;
    background-color: $white;
    i {
      color: $fifth-grey;
    }
  }
  .fade-enter-active {
    transition: opacity .25s ease-in;
  }
  .fade-leave-active {
    transition: opacity .25s ease-out;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
