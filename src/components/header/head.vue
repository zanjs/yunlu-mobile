<template>
  <header id="head-top">
    <section class="head_goback" v-if="goBack" @click="$router.go(-1)">
      <i class="fa fa-backward"></i>
    </section>
    <section class="title"
             v-if="headTitle">
      <span class="title-text">{{headTitle}}</span>
    </section>
    <slot name="report"></slot>
  </header>
</template>

<script>
  export default {
    data () {
      return {}
    },
    methods: {

    },
    mounted () {

    },
    props: ['headTitle', 'goBack'],
    computed: {

    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  #head-top {
    background-color: $green;
    width: 100%;
    @include px2rem(height, 88px);
    @include px2rem(padding-left, 30px);
    @include px2rem(padding-right, 30px);
  }

  .title {
    .title-text {
      text-align: center;
      font-weight: bold;
      color: $white;
      @include font-dpr(34px);
    }
  }
</style>
