<template>
  <section>
    <div class="top">
      <div class="header">
        <a @click="goBack()">
          <i class="iconfont icon-fanhui"></i>
        </a>
        <a @click="goHome()">
          <i class="iconfont icon-zhuye"></i>
        </a>
      </div>
      <div class="download-bg">
        <img src="../../assets/download.png">
      </div>
    </div>
    <div class="download-btn">
      <!--https://itunes.apple.com/cn/app/yun-lu/id1040721645?mt=8-->
      <a @click="download()">下载云庐客户端</a>
    </div>
    <div class="tips">
      <p>如果无法下载，你可以复制下面链接，用其他的浏览器打开</p>
      <a href="http://a.app.qq.com/o/simple.jsp?pkgname=com.yunlu6.yunlu">http://a.app.qq.com/o/simple.jsp?pkgname=com.yunlu6.yunlu</a>
    </div>
  </section>
</template>

<script>
  import { getStore, removeStore } from '../../config/mUtils'
  export default {
    name: 'Download',
    data () {
      return {
      }
    },
    methods: {
      goBack () {
        if (getStore('Download_goHome')) {
          removeStore('Download_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      goHome () {
        this.$router.push({name: 'See'})
      },
      download () {
        window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.yunlu6.yunlu'
      }
    }
  }
</script>


<style lang="scss" scoped>
  @import '../../styles/mixin';

  .top {
    position: relative;
    .header {
      z-index: 1001;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      @include pm2rem(padding, 20px, 30px, 0px, 30px);
      color: $white;
      a {
        @include px2rem(height, 68px);
        @include px2rem(width, 68px);
        @include px2rem(border-radius, 34px);
        background-color: #49B495;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
      }
      a:active {
        background-color: rgba(73, 180, 149, .4);
      }
    }
    .download-bg {
      img {
        @include px2rem(width, 750px);
        @include px2rem(height, 539px);
      }
    }
  }
  .download-btn {
    @include px2rem(margin-top, 92px);
    text-align: center;
    a {
      display: block;
      text-align: center;
      margin: 0 auto;
      @include px2rem(height, 86px);
      @include px2rem(line-height, 86px);
      @include px2rem(width, 500px);
      @include font-dpr(16px);
      background-color: $green;
      color: $white;
      @include px2rem(border-radius, 43px);
    }
    a:active {
      background-color: rgba(82, 202, 167, .5);
    }
  }
  .tips {
    text-align: center;
    @include px2rem(margin-top, 255px);
    p {
      color: $third-dark;
      @include font-dpr(12px);
    }
    a {
      color: #3A7FD3;
      @include font-dpr(12px);
    }
  }
</style>
