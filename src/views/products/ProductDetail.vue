<template>
  <section>
    <product-header/>
    <div class="swipe">
      <mt-swipe :auto="0"
                @change="handleChange">
        <mt-swipe-item v-for="(item, index) in imgList"
                       :key="index">
          <img :src="item.url"
               @click="viewFullScreenPic(item.id)"/>
        </mt-swipe-item>
      </mt-swipe>
      <span class="page-nav">{{currentIndex}}/{{imgList.length}}</span>
    </div>
    <section class="info-container">
      <div class="name">黑金沙大理石</div>
      <div class="money">
        <div>
          <span class="number">1999</span>
          <span class="unit">元</span>
        </div>
        <div @click="expandMorePrice()">
          <span class="more">更多价格</span>
          <div class="icon-box"
               v-bind:class="{'rotate-90-cw': cssAnimation, 'rotate-90-ccw': !cssAnimation}">
            <i class="iconfont icon-gengduo more-icon"/>
          </div>
        </div>
        <div v-show="morePrice"
             class="more-price"
             v-bind:class="{'more-price-show': cssAnimation, 'more-price-hide': !cssAnimation}">
          <span>定制</span>
        </div>
      </div>
      <div class="inventory">
        库存 ：10000
      </div>
    </section>
    <section>
      <mt-navbar v-model="selected"
                 class="nav-bar">
        <mt-tab-item id="1">价格参数</mt-tab-item>
        <mt-tab-item id="2">产品参数</mt-tab-item>
        <mt-tab-item id="3">关联信息</mt-tab-item>
      </mt-navbar>
      <mt-tab-container v-model="selected"
                        class="nav-bar-container">
        <mt-tab-container-item id="1"
                               class="prodcutdetail-price-item">
          <span class="row-item">发货地址 : 武汉</span>
          <span class="row-item">物流 : 公路运输</span>
          <span class="row-item">单位 : 平方</span>
          <span class="row-item">发货周期 : 3天</span>
          <span class="row-item">包装方式 : 木箱包装</span>
          <span class="row-item">产品登记 : B级</span>
          <span class="row-item">产品类型 : 半成品</span>
        </mt-tab-container-item>
        <mt-tab-container-item id="2"
                               class="productdetail-product-item">
          <div class="row-item">
            <div class="title-container">
              <div class="dot"></div>
              <span class="title">技术全面</span>
            </div>
            <p class="content line2">
              企业网站、营销网站、平台网站；行业应用软件、软硬件系统集成;企业网站、营销网站、平台网站；行业应用软件、软硬件系统集成
            </p>
          </div>
          <div class="row-item">
            <div class="title-container">
              <div class="dot"></div>
              <span class="title">高端定制</span>
            </div>
            <p class="content line2">
              全网高端定制品牌，专业设计师、工程师银行软件开发，P2P软件开发和运维经验
            </p>
          </div>
          <div class="row-item last">
            <div class="title-container">
              <div class="dot"></div>
              <span class="title">荒料来源</span>
            </div>
            <p class="content line2 link">
              万福矿业
              <i class="iconfont icon-guanlian"/>
            </p>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="3"
                               class="productdetail-product-item">
          <div class="row-item">
            <div class="title-container">
              <div class="dot"></div>
              <span class="title">技术全面</span>
            </div>
            <p class="content line2">
              企业网站、营销网站、平台网站；行业应用软件、软硬件系统集成;企业网站、营销网站、平台网站；行业应用软件、软硬件系统集成
            </p>
          </div>
          <div class="row-item">
            <div class="title-container">
              <div class="dot"></div>
              <span class="title">高端定制</span>
            </div>
            <p class="content line2">
              全网高端定制品牌，专业设计师、工程师银行软件开发，P2P软件开发和运维经验
            </p>
          </div>
          <div class="row-item last">
            <div class="title-container">
              <div class="dot"></div>
              <span class="title">荒料来源</span>
            </div>
            <p class="content line2 link">
              万福矿业
              <i class="iconfont icon-guanlian"/>
            </p>
          </div>
        </mt-tab-container-item>
      </mt-tab-container>
    </section>
    <section class="company-info">
      <div class="company-img">
        <img src="http://7xjfsp.com2.z0.glb.qiniucdn.com/FrOXCe48WEH8rwHvPz3ugLpcaTMO-thumb"/>
      </div>
      <div class="company-content">
        <span class="title">武汉天辰石业有限公司</span>
        <div class="info">
          <span>石矿主</span>
          <span>182件商品</span>
        </div>
      </div>
    </section>
    <section class="product-tab-bar">
      <div class="btn-box"
           @click="share()">
        <i class="iconfont icon-fenxiang"/>
        <span>分享</span>
      </div>
      <div class="btn-box">
        <i class="iconfont icon-shoucang1"/>
        <span>收藏</span>
      </div>
      <div class="btn-box">
        <i class="iconfont icon-kefu"/>
        <span>客服</span>
      </div>
      <div class="btn-box btn-shopping-car">
        <i class="iconfont icon-gouwuche"/>
        <span>加入购物车</span>
      </div>
      <div class="btn-box btn-buy">
        <span>立即购买</span>
      </div>
    </section>
    <mt-actionsheet :actions="actions"
                    v-model="sheetVisible"
                    class="product-actionsheet">
    </mt-actionsheet>
  </section>
</template>

<script>
  import ProductHeader from '../../components/header/head'
  export default {
    data () {
      return {
        selected: '1',
        currentIndex: 1,
        morePrice: false,
        cssAnimation: false,
        actions: [
          {
            name: '发送给微信好友',
            method: ''
          }, {
            name: '分享到微信朋友圈',
            method: ''
          }, {
            name: '分享到QQ空间',
            method: ''
          }, {
            name: '分享到QQ',
            method: ''
          }, {
            name: '分享到新浪微博',
            method: ''
          }
        ],
        sheetVisible: false,
        imgList: [
          {
            id: 1,
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 2,
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 3,
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 4,
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }
        ]
      }
    },
    components: {
      ProductHeader
    },
    methods: {
      viewFullScreenPic (id) {
        console.log(id)
      },
      handleChange (index) {
        this.currentIndex = index + 1
      },
      share () {
        this.sheetVisible = true
      },
      expandMorePrice () {
        if (this.morePrice) {
          this.cssAnimation = false
          setTimeout(() => {
            this.morePrice = !this.morePrice
          }, 400)
        } else {
          this.morePrice = !this.morePrice
          this.cssAnimation = true
        }
      }
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
    @include px2rem(height, 100px);
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
    @include px2rem(margin-top, 22px);
    @include pm2rem(padding, 24px, 24px, 24px, 24px);
    border-top: 1px solid #D1D1D1;
    background-color: $white;
    display: -webkit-box;
    .company-img {
      @include px2rem(margin-right, 24px);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    img {
      @include px2rem(width, 82px);
      @include px2rem(height, 82px);
    }
    .company-content {
      height: auto;
      .title {
        @include font-dpr(16px);
        color: #000;
        // line-height: 1;
      }
      .info {
        @include pm2rem(margin, 28px, 0px, 0px, 0px);
        span {
          @include font-dpr(14px);
          color: #535252;
          // line-height: 1;
          @include px2rem(margin-right, 50px);
        }
      }
    }
  }

  .product-tab-bar {
    @include px2rem(height, 97px);
    display: -webkit-box;
    background-color: $white;
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
      background: linear-gradient(to bottom right, #FB713A , #FB511F);
      border: none;
      span {
        @include font-dpr(14px);
        color: $white;
      }
    }
  }

  .more-price-show {animation:fadeInDown 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both}

  .more-price-hide {animation:fadeOutUp 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both}
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
  .nav-bar {
    .mint-tab-item-label {
      @include font-dpr(15px);
    }
  }
  .prodcutdetail-price-item {
    @include pm2rem(padding, 36px, 0px, 0px, 38px);
    background-color: $white;
    .row-item {
      display: block;
      @include pm2rem(margin, 0px, 0px, 36px, 0px);
      @include font-dpr(14px);
      color: #595959;
    }
  }
  .productdetail-product-item {
    @include pm2rem(padding, 0px, 30px, 0px, 30px);
    background-color: $white;
    .row-item {
      border-bottom: 1px solid #DEDEDE;
      @include pm2rem(padding, 20px, 0px, 10px, 2px);
      .title-container {
        .dot {
          @include px2rem(width, 16px);
          @include px2rem(height, 16px);
          @include px2rem(border-radius, 8px);
          @include px2rem(margin-right, 6px);
          background-color: #ACACAC;
          display: inline-block;
        }
        .title {
          @include font-dpr(15px);
          line-height: 1;
        }
      }
      .content {
        @include font-dpr(13px);
        @include line-height(33px);
        @include pm2rem(padding, 10px, 54px, 0px, 24px);
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        display: -webkit-box;
        @include px2rem(height, 132px);
        i {
          color: #F4B223;
          position: absolute;
          @include px2rem(right, 140px);
          @include font-dpr(21px);
        }
      }
      .line2 {
        -webkit-line-clamp: 2
      }
      .link {
        @include px2rem(height, 66px);
      }
    }
    .last {
      border-bottom: none;
    }
  }
  .product-actionsheet {
    background-color: transparent;
    @include px2rem(margin-bottom, 12px);
    .mint-actionsheet-list {
      @include pm2rem(padding, 0px, 41px, 0px, 41px);
    }
    .mint-actionsheet-button {
      @include pm2rem(margin, 28px, 41px, 0px, 41px);
      @include px2rem(border-radius, 10px);
      width: auto;
      color:#004BBD;
    }
    .mint-actionsheet-listitem {
      color: #004BBD;
      @include font-dpr(16px);
      @include px2rem(height, 98px);
      @include px2rem(line-height, 98px);
    }
  }
</style>
