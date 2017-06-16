<template>
  <header class="head-product">
    <div class="left icon-box"
         @click="$router.go(-1)">
      <i class="iconfont icon-fanhui"></i>
    </div>
    <section class="right">
      <div class="icon-box">
        <i class="iconfont icon-gouwuche"></i>
      </div>
      <div class="icon icon-box"
           @click="openDropMenu()">
        <i class="iconfont icon-fenlei"></i>
      </div>
    </section>
    <div v-show="showMenu"
         class="drop-menu-arrow"
         v-bind:class="{'fade-in': cssAnimation, 'fade-out': !cssAnimation}"></div>
    <section v-show="showMenu"
             id="fullscreen-cover"
             class="product-drop-menu"
             v-bind:class="{'fade-in': cssAnimation, 'fade-out': !cssAnimation}">
      <div class="menu">
        <div class="item">
          <i class="iconfont icon-shoucang"/>
          <span>收藏夹</span>
        </div>
        <div class="item">
          <i class="iconfont icon-fujin"/>
          <span>搜附近</span>
        </div>
        <div class="item"
             @click="goReport()">
          <i class="iconfont icon-jubao"/>
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
        showMenu: false,
        cssAnimation: true
      }
    },
    name: 'ProductHeader',
    methods: {
      openDropMenu () {
        this.showMenu = true
        this.cssAnimation = true
      },
      addTouch () {
        let self = this
        document.getElementById('fullscreen-cover').addEventListener('touchmove', (e) => {
          e.preventDefault()
          this.cssAnimation = false
          setTimeout(() => {
            self.showMenu = false
          }, 400)
        })
      },
      goReport () {
        this.$router.push({path: '/report'})
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
    width: 100%;
    @include px2rem(height, 88px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    top: 0;
    z-index: 999;
    .icon-box {
      display: flex;
      justify-content: center;
      align-items: center;
      @include px2rem(border-radius, 35px);
      @include px2rem(width, 70px);
      @include px2rem(height, 70px);
      background-color: rgba(0, 0, 0, 0.45);
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
    @include px2rem(top, 78px);
    @include px2rem(right, 36px);
    width: 0;
    height: 0;
    @include px2rem(border-left-width, 14px);
    @include px2rem(border-right-width, 14px);
    @include px2rem(border-bottom-width, 26px);
    border-left-color: transparent;
    border-right-color: transparent;
    border-bottom-color: rgba(0, 0, 0, .5);
    border-style: solid;
    border-top: none;
  }
  .product-drop-menu {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4000px;
    background-color: transparent;
    .menu {
      position: absolute;
      @include px2rem(width, 282px);
      @include px2rem(top, 104px);
      @include px2rem(right, 16px);
      background-color: rgba(0, 0, 0, .5);
      z-index: 9999;
      .item {
        @include px2rem(height, 96px);
        border-bottom: 1px solid $white;
        @include pm2rem(padding, 0px, 0px, 0px, 34px);
        @include px2rem(line-height, 96px);
        color: $white;
        i {
          @include px2rem(margin-right, 16px);
        }
      }
      & .item:last-child {
        border-bottom: none;
      }
    }
  }
  .fade-in {animation:fadeIn 0.4s 0s 1 both}

  .fade-out {animation:fadeOut 0.4s 0s 1 both}
  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
  @keyframes fadeOut {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }
</style>
