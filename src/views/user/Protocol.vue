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
        :style="{height: scrollHeight}"
        :src="html">
      </iframe>
    </div>
    <div v-if="!hasHeader && !hideBtn" class="float-btn">
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
    name: 'Protocol',
    data () {
      return {
        header: this.$route.query.title || '使用条款和隐私政策',
        hasHeader: this.$route.query.from || '',
        hideBtn: this.$route.query.noback || '',
        html: `https://www.yunlu6.com/protocol/${this.$route.query.name || 'service_protocol.html'}`,
        scrollHeight: '15rem'
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
      },
      handleScrollHeight () {
        let appHeight = document.getElementById('app').offsetHeight
        let rootFontSize = document.documentElement.style.fontSize.split('p')[0]
        let divHeight = (appHeight / parseFloat(rootFontSize + '')).toFixed(2)
        this.scrollHeight = `${Math.round(divHeight * 100) / 100}rem`
      }
    },
    mounted () {
      this.handleScrollHeight()
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .content {
    position: relative;
    box-sizing: border-box;
    .iframe {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      bottom: 0;
      border: none;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      margin-bottom: 1px;
    }
  }
  .has-header {
    @include px2rem(padding-top, 88px);
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
