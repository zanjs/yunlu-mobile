<template>
  <section>
    <common-header
      v-if="hasHeader"
      :title="header"
      @back="goBack()">
    </common-header>
    <div class="content full-width" :class="{'has-header': hasHeader}">
      <iframe
        class="iframe"
        :src="html">
      </iframe>
    </div>
    <div v-if="!hasHeader" class="float-btn">
      <a class="flex btn" @click="goBack()">
        <i class="iconfont icon-zuo"></i>
      </a>
    </div>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import { getStore, removeStore } from '../../config/mUtils'
  export default {
    name: 'HelpDetail',
    data () {
      return {
        header: '帮助中心',
        hasHeader: this.$route.query.from || '',
        html: `https://www.yunlu6.com/${this.$route.query.url}/${this.$route.params.id}`
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
    top: 0;
    bottom: 0;
    .iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  }
  .has-header {
    @include px2rem(top, 88px);
  }
  .float-btn {
    position: fixed;
    height: 0;
    .btn {
      @include px2rem(width, 100px);
      @include px2rem(height, 100px);
      @include px2rem(border-radius, 50px);
      background-color: rgba(0, 0, 0, .5);
      color: $white;
      cursor: pointer;
      i {
        @include font-dpr(20px);
        line-height: normal;
      }
    }
    a:active {
      opacity: .8;
    }
  }
</style>
