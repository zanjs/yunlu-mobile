<template>
  <section class="container">
    <div class="hello">
      <span>Hello</span>
    </div>
    <div class="box">
      <span>Hello World</span>
    </div>
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
    @include px2rem(height, 40px);
    text-align: center;
    span {
      @include font-dpr(20px);
    }
  }

  .box {
    background-color: pink;
    // width: 10rem;
    // height: 4rem;
    @include px2rem(height, 200px);
    @include px2rem(width, 375px);
    text-align: center;
    span {
      @include font-dpr(20px);
    }
  }
</style>
