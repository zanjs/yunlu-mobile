<template>
  <section>
    <common-header
      :title="header"
      @back="goBack()">
    </common-header>
    <div class="content full-width">
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
    name: 'Protocol',
    data () {
      return {
        header: '使用条款和隐私政策',
        html: 'https://api.yunlu6.com/service_protocol.html'
      }
    },
    components: {
      CommonHeader
    },
    methods: {
      goBack () {
        if (getStore('Protocol_goHome')) {
          removeStore('Protocol_goHome')
          this.$router.push({name: 'See'})
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
    bottom: 0;
    .iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  }
</style>
