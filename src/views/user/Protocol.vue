<template>
  <section>
    <mt-header title="使用条款和隐私政策"
               fixed
               class="header">
      <mt-button slot="left"
                 @click="goBack()"
                 class="button-text">
        <i class="iconfont icon-fanhui"></i>
      </mt-button>
    </mt-header>
    <div v-html="html">

    </div>
  </section>
</template>

<script>
  import { getStore } from '../../config/mUtils'
  export default {
    data () {
      return {
        html: 'http://api.yunlu6.com/service_protocol.html'
      }
    },
    methods: {
      goBack () {
        if (getStore('showGoHome')) {
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      }
    },
    mounted () {

    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .header {
    background-color: $green;
    @include px2rem(height, 88px);
    @include pm2rem(padding, 0px, 30px, 0px, 30px);
    @include font-dpr(17px);
    position: fixed;
    z-index: 1002 !important;
    h1 {
      @include font-dpr(17px);
    }
    .button-text {
      @include font-dpr(15px);
    }
    i {
      @include font-dpr(20px);
    }
  }
</style>
