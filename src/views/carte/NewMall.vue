<template>
  <section class="full-width">
    <div class="absolute-horizontal top-bg">

    </div>
    <mall-header>
    </mall-header>
    <div class="container" ref="newMallContainer" :style="{height: scrollHeight}">
      <div class="flex card">
        <div class="flex content">
          <img src="../../assets/blank.jpg">
          <div class="name">
            <span class="font-16">喵喵喵喵的商城</span>
            <div class="flex favorite">
              <i class="iconfont icon-shoucang1"></i>
              <span class="font-12">收藏</span>
            </div>
          </div>
        </div>
        <a class="flex btn">
          商城详情
        </a>
      </div>
      <div class="nav-container" :class="{'full-width nav-hide': hideIcon}">
        <div class="flex nav-bars">
          <a class="bar" :class="{'selected': activeIndex === 0}" @click="selectTab(0)">
            <div class="icon-box nav-icon">
              <i class="iconfont icon-shangjia"></i>
              <span>商城首页</span>
            </div>
            <div class="icon-box nav-text">
              <span>商城首页</span>
            </div>
            <div class="border"></div>
          </a>
          <a class="bar" :class="{'selected': activeIndex === 1}" @click="selectTab(1)">
            <div class="icon-box nav-icon">
              <i class="iconfont icon-shangjia"></i>
              <span>全部产品</span>
            </div>
            <div class="icon-box nav-text">
              <span>全部产品</span>
            </div>
            <div class="border"></div>
          </a>
          <a class="bar" :class="{'selected': activeIndex === 2}" @click="selectTab(2)">
            <div class="icon-box nav-icon">
              <i class="iconfont icon-shangjia"></i>
              <span>企业会员</span>
            </div>
            <div class="icon-box nav-text">
              <span>企业会员</span>
            </div>
            <div class="border"></div>
          </a>
          <a class="bar" :class="{'selected': activeIndex === 3}" @click="selectTab(3)">
            <div class="icon-box nav-icon">
              <i class="iconfont icon-shangjia"></i>
              <span>个人会员</span>
            </div>
            <div class="icon-box nav-text">
              <span>个人会员</span>
            </div>
            <div class="border"></div>
          </a>
        </div>
      </div>
      <div class="tabs" :class="{'text-tabs': hideIcon}">
        <div v-for="(item, index) in 20" :key="index">
          <p class="flex">{{item}}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import MallHeader from '../../components/header/MallHeader'
  import { showBack } from '../../config/mUtils'
  export default {
    data () {
      return {
        activeIndex: 0,
        height: 65,
        scrollActive: false,
        hideIcon: false,
        scrollHeight: '15rem'
      }
    },
    components: {
      MallHeader
    },
    methods: {
      selectTab (index) {
        this.activeIndex = index
      },
      handleNavBar () {
        if (!this.scrollActive) {
          showBack((status) => {
            this.hideIcon = status
            this.scrollActive = true // 滚动监听被激活，不需要再次监听
          }, this.height, this.$refs.newMallContainer)
        }
      },
      handleScrollHeight () {
        let appHeight = document.getElementById('app').offsetHeight
        let rootFontSize = document.documentElement.style.fontSize.split('p')[0]
        let divHeight = (appHeight / parseFloat(rootFontSize + '')).toFixed(2)
        this.scrollHeight = `${Math.round(divHeight * 100) / 100}rem`
        this.height = rootFontSize * 130 / 75
      }
    },
    mounted () {
      this.handleScrollHeight()
      this.handleNavBar()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .container {
    overflow-y: scroll;
    padding-bottom: 1px; // 避免安卓手机QQ浏览器，滑动到底部后第一次不能直接上滑的bug
    -webkit-overflow-scrolling: touch;
  }
  .top-bg {
    @include px2rem(height, 210px);
    width: 100%;
    max-width: 540px;
  }
  .card {
    @include px2rem(padding-top, 100px);
    background-color: transparent;
    position: relative;
    background: url("../../assets/confirmQQ.png") no-repeat;
    background-size: cover;
    .content {
      flex: 1;
      @include px2rem(height, 110px);
      img {
        @include px2rem(width, 80px);
        @include px2rem(height, 80px);
        @include px2rem(border-radius, 20px);
        @include pm2rem(margin, 0px, 20px, 0px, 30px);
      }
      .name {
        flex: 1;
        flex-direction: column;
        color: $white;
        .favorite {
          justify-content: flex-start;
          line-height: normal;
          @include px2rem(max-width, 140px);
          i {
            @include font-dpr(16px);
          }
          span {
            @include px2rem(margin-left, 20px);
          }
        }
      }
    }
    .btn {
      @include px2rem(width, 160px);
      @include px2rem(height, 60px);
      @include pm2rem(margin, 0px, 40px, 0px, 30px);
      @include px2rem(border-radius, 40px);
      color: #F75541;
      line-height: normal;
      background-color: $white;
    }
  }
  .nav-container {
    overflow: hidden;
    @include px2rem(height, 110px);
    position: relative;
  }
  .nav-hide {
    position: fixed;
    @include px2rem(top, 70px);
    .nav-icon {
      transform: translateY(-100%);
    }
    .nav-text {
      transform: translateY(-100%);
    }
  }
  .nav-bars {
    background-color: $white;
    @include px2rem(height, 110px);
    .bar {
      flex: 1;
      position: relative;
      height: inherit;
      .icon-box {
        flex: 1;
        height: inherit;
        transition: transform .3s;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        i {
          @include font-dpr(18px);
        }
        span {
          @include font-dpr(12px);
        }
      }
      .nav-text {
        height: inherit;
        span {
          display: block;
          height: inherit;
          @include px2rem(padding-top, 30px);
          @include px2rem(line-height, 80px);
          @include font-dpr(12px);
          box-sizing: border-box;
        }
      }
      .border {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 0;
        background-color: #F96B09;
      }
    }
    .selected {
      .icon-box {
        color: #F96B09;
      }
      .border {
        @include px2rem(height, 8px);
      }
    }
  }
  .tabs {
    p {
      @include px2rem(height, 88px);
    }
  }
  .text-tabs {
    @include px2rem(padding-top, 110px);
  }

</style>
