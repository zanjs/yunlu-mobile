<template>
  <header
    class="head-product full-width">
    <div
      class="left icon-box flex"
      @click="goBack()">
      <i class="iconfont icon-fanhui"></i>
    </div>
    <section class="right">
      <div
        class="icon icon-box flex"
        @click="openDropMenu()">
        <i class="iconfont icon-fenlei" :class="{'active': showMenu, 'inactive': !showMenu}"></i>
      </div>
    </section>
    <div
      class="menu"
      v-show="showMenu"
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
    <div
      v-show="showMenu"
      id="fullscreen-cover"
      class="full-screen-cover">
    </div>
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
    z-index: 1003 !important;
    .icon-box {
      @include px2rem(border-radius, 35px);
      @include px2rem(width, 70px);
      @include px2rem(height, 70px);
      background-color: rgba(57, 55, 66, .5);
      color: $white;
      // box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px rgba(0,0,0,.14), 0 1px 18px rgba(0,0,0,.12);
    }
    .active {
      animation:rotateTo90 0.2s ease-in-out 0s 1 normal both;
    }
    .inactive {
      animation:rotateTo0 0.2s ease-in-out 0s 1 normal both;
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
  .title {
    .title-text {
      text-align: center;
      font-weight: bold;
      color: $white;
      @include font-dpr(34px);
    }
  }
  .full-screen-cover {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    max-width: 540px;
    bottom: 0;
  }
  .menu {
    width: 100%;
    position: absolute;
    @include px2rem(width, 282px);
    @include px2rem(top, 104px);
    @include px2rem(right, 16px);
    background-color: rgba(57, 55, 66, .8);
    z-index: 9999 !important;
    box-shadow: 0 1px 5px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12);
    @include px2rem(border-radius, 16px);
    .item {
      @include px2rem(height, 96px);
      border-bottom: 1px solid rgba(166, 166, 166, .5);
      @include pm2rem(padding, 0px, 0px, 0px, 34px);
      @include px2rem(line-height, 96px);
      @include font-dpr(15px);
      color: $white;
      i {
        @include px2rem(margin-right, 16px);
      }
    }
    & .item:last-child {
      border-bottom: none;
    }
  }
  .menu:after {
    content: '';
    display: inline-block;
    position: absolute;
    @include px2rem(border-left-width, 14px);
    @include px2rem(border-right-width, 14px);
    @include px2rem(border-bottom-width, 28px);
    border-left-color: transparent;
    border-right-color: transparent;
    border-bottom-color: rgba(57, 55, 66, .8);
    border-style: solid;
    border-top: none;
    width: 0;
    height: 0;
    @include px2rem(top, -28px);
    @include px2rem(right, 24px);
  }

</style>
