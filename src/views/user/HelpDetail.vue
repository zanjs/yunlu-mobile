<template>
  <section>
    <common-header
      :title="header"
      @back="goBack()">
    </common-header>
    <div class="content">
      <iframe
        class="iframe"
        :src="html">
      </iframe>
    </div>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import { getStore, removeStore } from '../../config/mUtils'
  export default {
    data () {
      return {
        header: '帮助手册',
        html: `https://www.360stones.com/docs/topic-${this.$route.params.id}.html`
      }
    },
    components: {
      CommonHeader
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
