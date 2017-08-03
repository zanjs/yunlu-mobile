<template>
  <section>
    <mt-header
      title="帮助手册"
      fixed
      class="header">
      <mt-button
        slot="left"
        @click="goBack()"
        class="button-text">
        <i class="iconfont icon-fanhui"></i>
      </mt-button>
    </mt-header>
    <div class="content">
      <iframe
        class="iframe"
        :src="html">
      </iframe>
    </div>
  </section>
</template>

<script>
  import { getStore, removeStore } from '../../config/mUtils'
  export default {
    data () {
      return {
        html: `http://www.360stones.com/docs/topic-${this.$route.params.id}.html`
      }
    },
    methods: {
      goBack () {
        if (getStore('HelpDetail_goHome')) {
          removeStore('HelpDetail_goHome')
          this.$router.replace({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      }
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
  .content {
    position: fixed;
    @include px2rem(top, 88px);
    left: 0;
    right: 0;
    bottom: 0;
    .iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  }
</style>
