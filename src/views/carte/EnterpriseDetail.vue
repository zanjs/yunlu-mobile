<template>
  <section>
    <mt-header title="资信"
               fixed
               class="header">
      <router-link to="/enterprisecarte" slot="left">
        <mt-button>
          <i class="iconfont icon-fanhui"></i>
        </mt-button>
      </router-link>
      <router-link to="/" slot="right">
        <mt-button>
          <i class="iconfont icon-zhuye"></i>
        </mt-button>
      </router-link>
    </mt-header>
    <div class="container">
      <div class="detail-container">
        <div class="name-info">
          <p>武汉环球万国石材有限公司</p>
          <div class="rate">
            <i class="iconfont icon-icon-test1 selected"></i>
            <i class="iconfont icon-icon-test1 selected"></i>
            <i class="iconfont icon-icon-test1 selected"></i>
            <i class="iconfont icon-icon-test1 selected"></i>
            <i class="iconfont icon-icon-test1"></i>
            <i class="iconfont icon-icon-test1"></i>
          </div>
          <div class="level">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-v3"></use>
            </svg>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-v2"></use>
            </svg>
          </div>
        </div>
        <div class="item">
          <span class="label">机构状态</span>
          <span class="content">有限责任公司(自然人投资或控股)</span>
        </div>
        <div class="item">
          <span class="label">法定代表人</span>
          <span class="content">王秀兵</span>
        </div>
        <div class="item">
          <span class="label">注册号</span>
          <span class="content">420000000000</span>
        </div>
        <div class="item">
          <span class="label">机构代码</span>
          <span class="content">4200000000000</span>
        </div>
        <div class="item">
          <span class="label">信用代码</span>
          <span class="content">43000000000000</span>
        </div>
        <div class="link-container">
          <div class="label">社会认证</div>
          <div class="link">
            <a class="row">
              <span>yao协会</span>
              <i class="iconfont icon-fanhui"/>
            </a>
            <a class="row">
              <span>湖北省石材工业协会</span>
              <i class="iconfont icon-fanhui"/>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    data () {
      return {}
    },
    methods: {

    },
    mounted () {

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
    z-index: 1002 !important;
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
  .container {
    @include px2rem(padding-top, 88px);
  }
  .detail-container {
    @include pm2rem(margin, 20px, 30px, 0px, 30px);
    @include pm2rem(padding, 38px, 22px, 0px, 22px);
    background-color: $white;
    .name-info {
      @include px2rem(padding-bottom, 18px);
      p {
        @include font-dpr(15px);
        color: #262626;
        line-height: 1;
      }
      .rate {
        @include pm2rem(margin, 32px, 0px, 22px, 0px);
        @include font-dpr(15px);
        line-height: 1;
        color: #A6A6A6;
        i {
          @include px2rem(margin-right, 12px);
        }
        .selected {
          color: #F7D14E;
        }
      }
      .level {
        @include font-dpr(23px);
        line-height: 1;
      }
    }
    .item {
      border-top: 1px dashed #D1D1D1;
      @include px2rem(height, 78px);
      @include font-dpr(14px);
      @include px2rem(line-height, 78px);
      .label {
        @include px2rem(width, 186px);
        display: inline-block;
      }
    }
    .link-container {
      border-top: 1px dashed #D1D1D1;
      @include font-dpr(14px);
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .label {
        @include px2rem(width, 186px);
      }
      .link {
        flex: 1;
        .row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          @include pm2rem(padding, 20px, 0px, 20px, 0px);
        }
        i {
          transform: rotateY(180deg);
          @include font-dpr(15px);
          color: #52CAA7;
        }
        a {
          text-decoration: none;
        }
        a:active {
          background-color: #F2F2F2;
        }
      }
    }
  }
</style>
