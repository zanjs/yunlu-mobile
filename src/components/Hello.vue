<template>
  <section class="container">
    <div class="hello">
      <span>Hello</span>
    </div>
    <div class="box">
      <span>Hello World</span>
    </div>
    <mt-button type="primary"
               @click="goFolder()">primary</mt-button>
  </section>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    goFolder () {
      this.$router.push({path: '/folders'})
    }
  },
  computed: {
    ...mapGetters([
      'pageLoading'
    ])
  }
}
</script>

<style lang="scss" scoped>
  @import '../styles/mixin';

  .container {
    width: 100%;
    text-align: center;
  }

  .hello {
    @include px2rem(height, 80px);
    text-align: center;
    span {
      @include font-dpr(20px);
    }
  }

  .box {
    background-color: pink;
    @include px2rem(height, 400px);
    width: 100%;
    text-align: center;
    span {
      @include font-dpr(20px);
    }
  }
</style>
