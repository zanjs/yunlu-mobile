<template>
  <header
    class="head-product full-width"
    v-bind:class="{'download': showDownload}">
    <div
      class="left icon-box flex"
      @click="goBack()">
      <i class="iconfont icon-fanhui"></i>
    </div>
    <section class="right">
      <div
        class="icon icon-box flex"
        @click="openDropMenu()">
        <i class="iconfont icon-fenlei"></i>
      </div>
    </section>
    <div
      v-show="showMenu"
      id="fullscreen-cover"
      class="full-screen-cover">
      </div>
    <div
      v-show="showMenu"
      class="drop-menu-arrow">
    </div>
    <section
      v-show="showMenu"
      class="product-drop-menu">
      <div
        class="menu"
        id="product-drop-menu">
        <div
          class="item"
          @click.stop="goHome()">
          <i class="iconfont icon-shouye"></i>
          <span>首页</span>
        </div>
        <div
          class="item"
          @click.stop="goFavorites()">
          <i class="iconfont icon-shoucang"></i>
          <span>收藏夹</span>
        </div>
        <div
          class="item"
          @click.stop="searchNearBy()">
          <i class="iconfont icon-fujin"></i>
          <span>搜附近</span>
        </div>
        <div
          class="item"
          @click.stop="goReport()">
          <i class="iconfont icon-jubao"></i>
          <span>举报Ta</span>
        </div>
      </div>
    </section>
  </header>
</template>

<script>
  export default {
    data () {
      return {
        showMenu: false
      }
    },
    name: 'ProductHeader',
    props: ['showDownload'],
    methods: {
      openDropMenu () {
        this.showMenu = true
      },
      addTouch () {
        let self = this
        document.getElementById('fullscreen-cover').addEventListener('touchstart', (e) => {
          // e.preventDefault()
          setTimeout(() => {
            self.showMenu = false
          }, 500)
        })
        document.getElementById('fullscreen-cover').addEventListener('click', (e) => {
          // e.preventDefault()
          setTimeout(() => {
            self.showMenu = false
          }, 500)
        })
        document.getElementById('product-drop-menu').addEventListener('touchstart', (e) => {
          // e.preventDefault()
          setTimeout(() => {
            self.showMenu = false
          }, 500)
        })
        document.getElementById('product-drop-menu').addEventListener('click', (e) => {
          // e.preventDefault()
          setTimeout(() => {
            self.showMenu = false
          }, 500)
        })
      },
      goFavorites () {
        this.$emit('open-favorites')
      },
      searchNearBy () {
        this.$emit('search-near-by')
      },
      goReport () {
        this.$emit('report')
      },
      goBack () {
        this.$emit('back')
      },
      goHome () {
        this.$emit('home')
      }
    },
    mounted () {
      this.addTouch()
    },
    computed: {

    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .head-product {
    background-color: transparent;
    @include px2rem(height, 88px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    top: 0;
    z-index: 2;
    .icon-box {
      @include px2rem(border-radius, 35px);
      @include px2rem(width, 70px);
      @include px2rem(height, 70px);
      background-color: rgba(57, 55, 66, .8);
      color: $white;
    }
    .left {
      @include pm2rem(margin, 0px, 0px, 0px, 20px);
    }
    .right {
      display: flex;
      justify-content: space-between;
      align-items: center;
      @include pm2rem(margin, 0px, 18px, 0px, 20px);
      .icon {
        @include pm2rem(margin, 0px, 0px, 0px, 28px);
      }
    }
  }
  .download {
    @include px2rem(top, 120px);
  }
  .title {
    .title-text {
      text-align: center;
      font-weight: bold;
      color: $white;
      @include font-dpr(34px);
    }
  }
  .drop-menu-arrow {
    position: absolute;
    background-color: transparent;
    @include px2rem(top, 80px);
    @include px2rem(right, 40px);
    width: 0;
    height: 0;
    @include px2rem(border-left-width, 14px);
    @include px2rem(border-right-width, 14px);
    @include px2rem(border-bottom-width, 26px);
    border-left-color: transparent;
    border-right-color: transparent;
    border-bottom-color: rgba(57, 55, 66, .8);
    border-style: solid;
    border-top: none;
  }
  .full-screen-cover {
    position: fixed;
    top: 0;
    width: 100%;
    max-width: 540px;
    bottom: 0;
  }
  .product-drop-menu {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 0;
    .menu {
      position: absolute;
      @include px2rem(width, 282px);
      @include px2rem(top, 104px);
      @include px2rem(right, 16px);
      background-color: rgba(57, 55, 66, .8);
      z-index: 9999 !important;
      .item {
        @include px2rem(height, 96px);
        border-bottom: 1px solid rgba(255, 255, 255, .45);
        @include pm2rem(padding, 0px, 0px, 0px, 34px);
        @include px2rem(line-height, 96px);
        @include font-dpr(15px);
        color: $white;
        i {
          @include px2rem(margin-right, 16px);
        }
        span {
          font-weight: bold;
        }
      }
      & .item:last-child {
        border-bottom: none;
      }
    }
  }
</style>
