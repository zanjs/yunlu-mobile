<template>
  <section>
    <mt-header title="登陆"
               class="header">
      <router-link to="/" slot="left">
        <mt-button>
          <i class="iconfont icon-zhuye"/>
        </mt-button>
      </router-link>
      <mt-button slot="right"
                 class="button-text">
        <i class="iconfont icon-jubao"/>
        投诉
      </mt-button>
    </mt-header>
    <mt-navbar v-model="selected"
               class="nav-bar">
      <mt-tab-item id="1">手机注册登陆</mt-tab-item>
      <mt-tab-item id="2">密码登陆</mt-tab-item>
    </mt-navbar>
    <mt-tab-container v-model="selected"
                      class="nav-bar-container">
      <mt-tab-container-item id="1">
        <div class="mobile-login-item">
          <div class="row-item">
            <input type="text" placeholder="请输入11位手机号码"/>
          </div>
          <div class="row-item">
            <input type="text" class="confirm" placeholder="请输入验证码"/>
            <input type="button" class="fr" value="获取验证码"/>
          </div>
          <div class="row-item">
            <input type="button" class="btn-box" value="按钮"/>
          </div>
        </div>

      </mt-tab-container-item>
      <mt-tab-container-item id="2"
                             class="mobile-login-item">
        <div class="row-item">
          <input type="text" placeholder="输入手机号"/>
        </div>
        <div class="row-item">
          <input type="text" placeholder="请输入11位手机号码"/>
        </div>
        <div class="row-item">
          <input type="button" @click="showUnlocking" value="提交"/>
        </div>

      </mt-tab-container-item>
    </mt-tab-container>
    <section v-if="leftTime > 0" class="unlock-box">
      <div class="main ">
        <div class="title">
          <span>提醒</span>
        </div>
        <div class="content">
          <div class="item"><p>登录请求已发送,请等待授权...</p></div>
          <div class="item"><p>{{ time }}</p></div>
      </div>
      <div class="footer">
        <input type="button" class="box" value="取消"/><input class="box" type="button" value="申请主控设备"/>
      </div>
      </div>
    </section>

  </section>
</template>


<script>
  export default {
    data () {
      return {
        selected: '1',
        popupVisible1: false,
        leftTime: 0,
        time: ''
      }
    },
    methods: {
      showUnlocking: function () {
        this.leftTime = 200
        let time = setInterval(() => {
          if (this.leftTime <= 0) {
            clearInterval(time)
          }
          this.timeDown()
        }, 1000)
      },
      timeDown: function () {
        this.leftTime = this.leftTime - 1
        let m = this.formate(parseInt(this.leftTime / 60))
        let s = this.formate(parseInt(this.leftTime % 60))
        this.time = `${m}:${s}`
      },
      formate (time) {
        if (time >= 10) {
          return time
        } else {
          return `0${time}`
        }
      }

    },
    mounted () {

    }
  }
</script>


<style lang="scss" scoped>
  @import '../../styles/mixin';

  .swipe {
    @include px2rem(height, 634px);
    @include pm2rem(margin, 0px, 0px, 0px, 0px);
    position: relative;
    img {
      width: 100%;
      height: auto;
    }

  }

  .page-nav {
    position: absolute;
    @include px2rem(bottom, 16px);
    @include px2rem(right, 16px);
    color: $white;
    @include font-dpr(16px);
    @include pm2rem(padding, 4px, 20px, 4px, 20px);
    background-color: rgba(0, 0, 0, .5);
  }

  .info-container {
    @include pm2rem(padding, 42px, 0px, 0px, 26px);
    background-color: $white;
    border-bottom: 1px solid #D1D1D1;
    .name {
      @include font-dpr(17px);
      @include pm2rem(margin, 0px, 0px, 30px, 0px);
    }
    .money {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      @include pm2rem(padding, 0px, 70px, 0px, 0px);
      .number {
        color: #FF0000;
        @include font-dpr(26px);
      }
      .unit {
        color: #343434;
        @include font-dpr(13px);
      }
      .more {
        color: #000;
        @include font-dpr(14px);
      }
      .icon-box {
        display: inline-block;
      }
      .more-icon {
        color: #52CAA7;
        @include font-dpr(15px);
      }
      .more-price {
        position: absolute;
        @include px2rem(right, 70px);
        @include px2rem(width, 150px);
        @include px2rem(top, 60px);
        @include pm2rem(padding, 4px, 10px, 4px, 10px);
        text-align: center;
        color: #FF0000;
        background-color: $white;
        border: 1px solid #D1D1D1;
        @include font-dpr(16px);
      }
    }
    .inventory {
      color: #595959;
      @include font-dpr(13px);
      @include pm2rem(padding, 0px, 0px, 22px, 0px);
    }
  }

  .nav-bar {

    .mint-tab-item {
      @include font-dpr(17px);
      border-bottom: 1px solid #D1D1D1;
      div {
        @include font-dpr(17px);
      }
    }
    .is-selected {
      color: #52CAA7;
      margin-bottom: 0;
      @include px2rem(border-bottom-width, 10px);
      border-bottom-color: #52CAA7;
      text-decoration: none;
    }
    a:active, a:hover {
      text-decoration: none;
    }
    .row-item {
      display: block;
    }
  }

  .nav-bar-container {
    border-bottom: 1px solid #DEDEDE;
  }

  .company-info {
    @include pm2rem(margin, 22px, 0px, 100px, 0px);
    @include pm2rem(padding, 24px, 24px, 24px, 24px);
    border-top: 1px solid #D1D1D1;
    background-color: $white;
    display: -webkit-box;
    line-height: 1;
    .company-img {
      @include pm2rem(padding, 2px, 24px, 0px, 0px);
      img {
        @include px2rem(width, 82px);
        @include px2rem(height, 82px);
      }
    }
    .company-content {
      height: auto;
      line-height: 1;
      .title {
        @include font-dpr(16px);
        color: #000;
      }
      .info {
        @include pm2rem(margin, 28px, 0px, 0px, 0px);
        span {
          @include font-dpr(14px);
          color: #535252;
          @include px2rem(margin-right, 50px);
        }
      }
    }
  }

  .product-tab-bar {
    @include px2rem(height, 97px);
    display: -webkit-box;
    background-color: $white;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    .btn-box {
      border-top: 1px solid #D1D1D1;
      border-bottom: 1px solid #D1D1D1;
      width: 17.6%;
      border-right: 1px solid #D1D1D1;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      i {
        @include font-dpr(17px);
      }
      span {
        @include font-dpr(12px);
        color: #595959;
      }
    }
    .btn-shopping-car {
      width: 23.6%;
      i {
        @include font-dpr(18px);
      }
    }
    .btn-buy {
      width: 23.6%;
      background: linear-gradient(to bottom right, #ff7f46, #ff5001);
      border: none;
      span {
        @include font-dpr(14px);
        color: $white;
        @include px2rem(line-height, 97px);
      }
    }
  }

  .productdetail-product-tags {
    display: flex;
    flex-wrap: wrap;
    @include pm2rem(padding, 20px, 0px, 0px, 20px);
    background-color: $white;
    .tag {
      @include px2rem(border-radius, 7px);
      border: 1px solid #ACACAC;
      @include pm2rem(padding, 10px, 20px, 10px, 20px);
      @include pm2rem(margin, 0px, 20px, 20px, 0px);
      line-height: 1;
      @include font-dpr(14px);
      color: #595959;
    }
  }

  .product-popup-dialog {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    z-index: 1001;
    top: 0;
    .main {
      position: absolute;
      @include px2rem(width, 562px);
      @include px2rem(top, 200px);
      position: absolute;
      left: 50%;
      -webkit-transform: translateX(-50%);
      transform: translateX(-50%);
    }
    .title {
      background-color: #52CAA7;
      color: $white;
      @include font-dpr(16px);
      @include px2rem(height, 80px);
      text-align: center;
      @include px2rem(line-height, 80px);
    }
    .content {
      background-color: $white;
      @include px2rem(min-height, 500px);
      border-bottom: 1px solid #D1D1D1;
      .item {
        border-bottom: 1px solid #D1D1D1;
        @include px2rem(height, 108px);
        display: flex;
        align-items: center;
        box-sizing: border-box;
        @include pm2rem(padding, 20px, 12px, 20px, 12px);
        img {
          @include px2rem(width, 70px);
          @include px2rem(height, 70px);
          @include px2rem(margin-right, 22px);
        }
        .info {
          div {
            line-height: 1;
          }
          p {
            @include font-dpr(13px);
            line-height: 1;
            color: #595959;
            @include px2rem(margin-bottom, 20px);
          }
          span {
            @include font-dpr(12px);
            @include px2rem(margin-right, 50px);
            color: #A6A6A6;
          }
        }
      }
    }
    .footer {
      @include px2rem(height, 80px);
      background-color: $white;
      @include px2rem(line-height, 80px);
      text-align: center;
      @include font-dpr(16px);
      color: #595959;
    }
  }

  .slide-in-fwd-center {
    -webkit-animation: slide-in-fwd-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    animation: slide-in-fwd-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  }

  .slide-out-bck-center {
    -webkit-animation: slide-out-bck-center 0.4s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
    animation: slide-out-bck-center 0.4s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
  }

  @-webkit-keyframes slide-in-fwd-center {
    0% {
      -webkit-transform: translateZ(-1400px);
      transform: translateZ(-1400px);
      opacity: 0;
    }
    100% {
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
      opacity: 1;
    }
  }

  @keyframes slide-in-fwd-center {
    0% {
      -webkit-transform: translateZ(-1400px);
      transform: translateZ(-1400px);
      opacity: 0;
    }
    100% {
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
      opacity: 1;
    }
  }

  @-webkit-keyframes slide-out-bck-center {
    0% {
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
      opacity: 1;
    }
    100% {
      -webkit-transform: translateZ(-1100px);
      transform: translateZ(-1100px);
      opacity: 0;
    }
  }

  @keyframes slide-out-bck-center {
    0% {
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
      opacity: 1;
    }
    100% {
      -webkit-transform: translateZ(-1100px);
      transform: translateZ(-1100px);
      opacity: 0;
    }
  }

  .more-price-show {
    animation: fadeInDown 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both
  }

  .more-price-hide {
    animation: fadeOutUp 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translate3d(0, -100%, 0);
    }

    to {
      opacity: 1;
      transform: none;
    }
  }

  @keyframes fadeOutUp {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
      transform: translate3d(0, -100%, 0);
    }
  }

  .rotate-90-cw {
    -webkit-animation: rotate-90-cw 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    animation: rotate-90-cw 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  }

  .rotate-90-ccw {
    -webkit-animation: rotate-90-ccw 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    animation: rotate-90-ccw 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  }

  @-webkit-keyframes rotate-90-cw {
    0% {
      -webkit-transform: rotate(0);
      transform: rotate(0);
    }
    100% {
      -webkit-transform: rotate(90deg);
      transform: rotate(90deg);
    }
  }

  @keyframes rotate-90-cw {
    0% {
      -webkit-transform: rotate(0);
      transform: rotate(0);
    }
    100% {
      -webkit-transform: rotate(90deg);
      transform: rotate(90deg);
    }
  }

  @-webkit-keyframes rotate-90-ccw {
    0% {
      -webkit-transform: rotate(0);
      transform: rotate(0);
    }
    100% {
      -webkit-transform: rotate(-90deg);
      transform: rotate(-90deg);
    }
  }

  @keyframes rotate-90-ccw {
    0% {
      -webkit-transform: rotate(0);
      transform: rotate(0);
    }
    100% {
      -webkit-transform: rotate(-90deg);
      transform: rotate(-90deg);
    }
  }

</style>

<style lang="scss">
  @import '../../styles/mixin';
  /*覆盖mint-ui中nav-bar组件默认样式，故不用scoped*/

  .swipe {
    .mint-swipe-indicator {
      opacity: .5;
    }
    .is-active {
      opacity: 1;
    }
  }

  .mobile-login-item {
    @include pm2rem(padding, 36px, 0px, 0px, 38px);
    background-color: $white;
    .row-item {
      display: block;
      border: 1px;

      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      margin-bottom: 20px;

      input {
        width: 75%;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #bfcbd9;
        box-sizing: border-box;
        color: #1f2d3d;
        font-size: inherit;
        height: 36px;
        line-height: 1;
        outline: 0;
        padding: 3px 10px;
        transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
      }

      input.confirm {
        width: 45%
      }

      input.fr {
        margin-left: 20px;
        width: 25%
      }
      input.btn-box {
        background: #52CAA7;
      }

    }
  }

  .unlock-box {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    z-index: 1001;
    top: 0;

    .main {
      position: absolute;
      @include px2rem(width, 562px);
      @include px2rem(top, 200px);
      position: absolute;
      left: 50%;
      -webkit-transform: translateX(-50%);
      transform: translateX(-50%);
    }
    .title {
      background-color: #52CAA7;
      color: $white;
      @include px2rem(height, 80px);
      text-align: center;
      @include px2rem(line-height, 80px);
      @include font-dpr(16px);

    }
    .content {
      background-color: $white;
      border-bottom: 1px solid #D1D1D1;
      .item {
        @include px2rem(height, 108px);
        align-items: center;
        box-sizing: border-box;
        @include pm2rem(padding, 20px, 12px, 20px, 12px);
        p {
          text-align: center;
          @include font-dpr(15px);
          font-weight: 300;
        }

      }
    }
    .footer {
      @include px2rem(height, 80px);
      background-color: $white;
      @include px2rem(line-height, 80px);
      text-align: center;
      @include font-dpr(16px);
      color: #595959;
      .box {
        border-right: 1px solid #d1d1d1;
        width: 50%;
        height: 100%;
        box-sizing: border-box;
        background-color: $white;
        border-width: 1px;
      }
    }
  }

</style>

