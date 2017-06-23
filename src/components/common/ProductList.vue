<template>
  <section id="productList">
    <div class="search-container"
         v-bind:class="{'fade-in-top': cssAnimation, 'fade-out-top': !cssAnimation}">
      <input type="text"
             v-model="searchParams"
             placeholder="搜索产品">
      <i class="iconfont icon-sousuo"
         @click.stop="handleSearch"></i>
    </div>
    <div class="option-bar"
         v-bind:class="{'fade-in-top': cssAnimation, 'fade-out-top': !cssAnimation}">
      <div class="item">
        <div class="text"
             @click="changeOrder()">价格</div>
        <div class="order-icon">
          <div class="icon-box">
            <i class="iconfont icon-shang"
               v-bind:class="{'icon-actinve': orderUp > 0, 'icon-inactive': orderUp < 0}"></i>
          </div>
          <div class="icon-box">
            <i class="iconfont icon-xia"
               v-bind:class="{'icon-actinve': orderUp < 0, 'icon-inactive': orderUp > 0}"></i>
          </div>
        </div>
      </div>
      <div class="item">
        <i class="iconfont"
           v-bind:class="{'icon-liebiao': thumbnails, 'icon-liebiao1': !thumbnails}"
           @click="swithList()"></i>
      </div>
    </div>
    <div v-show="show && thumbnails"
         class="gallery-container">
      <div v-show="thumbnails"
           class="gallery">
        <div v-for="(item, index) in store"
             :key="index"
             @click.stop="handleClick(item)"
             class="img-box">
          <img :src="item.file_url">
          <div class="cover">
            <span class="name">{{item.name}}</span>
            <span class="money">&yen; ：{{item.prices[0].money}}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-show="show && !thumbnails"
         class="gallery-list">
      <div v-for="(item, index) in store"
           :key="index"
           @click.stop="handleClick(item)"
           class="item">
        <img :src="item.file_thumb_urls">
        <div class="content">
          <span class="name">{{item.name}}</span>
          <span class="money">&yen; ：{{item.prices[0].money}}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    data () {
      return {
        thumbnails: true,
        orderUp: 1, // 正数按照最低价升序，负数按照最低价降序(默认1为最低价)
        searchParams: ''
      }
    },
    props: ['cssAnimation', 'show', 'store'],
    methods: {
      swithList () {
        this.thumbnails = !this.thumbnails
      },
      changeOrder () {
        this.orderUp = 0 - this.orderUp
        this.scrollToBar()
        this.$emit('search', this.searchParams, this.orderUp)
      },
      scrollToBar () {
        document.body.scrollTop = parseFloat(document.documentElement.style.fontSize.replace('px', '')) * 160 / 36
      },
      scrollToTop () {
        document.body.scrollTop = 0
      },
      handleClick (item) {
        this.scrollToTop()
        this.$emit('click', item)
      },
      handleSearch () {
        this.scrollToBar()
        this.$emit('search', this.searchParams, this.orderUp)
      }
    },
    mounted () {
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .search-container {
    background-color: $white;
    @include pm2rem(padding, 12px, 32px, 12px, 32px);
    position: fixed;
    @include px2rem(top, 88px);
    left: 0;
    right: 0;
    z-index: 1001;
    border: none;
    box-sizing: border-box;
    input {
      background-color: #EDEDED;
      width: 100%;
      @include px2rem(border-radius, 14px);
      color: #C2C2C2;
      @include font-dpr(14px);
      @include px2rem(line-height, 58px);
      @include px2rem(height, 58px);
      vertical-align: middle;
      text-align: center;
      border: none;
    }
    ::-webkit-input-placeholder{
      color: #C2C2C2;
    }
    i {
      position: absolute;
      @include px2rem(right, 60px);
      @include px2rem(height, 10px);
      @include px2rem(top, 16px);
    }
  }
  .option-bar {
    @include px2rem(height, 74px);
    box-shadow: 0px 6px 20px rgba(185, 179, 179, 0.5);
    border-top: 1px solid #D1D1D1;
    border-bottom: 1px solid #D1D1D1;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    @include px2rem(top, 169px);
    left: 0;
    right: 0;
    background-color: $white;
    z-index: 1001;
    .item {
      height: inherit;
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
      .order-icon {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        i {
          @include font-dpr(12px);
          line-height: 1;
        }
      }
      .text {
        @include font-dpr(16px);
        line-height: 1;
        @include px2rem(padding-right, 50px);
        @include px2rem(margin-right, -40px);
      }
    }
    .icon-box {
      @include px2rem(width, 24px);
      @include px2rem(height, 24px);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .icon-actinve {
      color: #52CAA7;
    }
    .icon-inactive {
      color: #A6A6A6;
    }
  }
  .gallery-container {
    display: block;
  }
  .gallery {
    @include pm2rem(padding, 16px, 2px, 0px, 30px);
    display: flex;
    flex-wrap: wrap;
    .img-box {
      @include px2rem(height, 306px);
      @include px2rem(width, 330px);
      @include pm2rem(margin, 0px, 28px, 30px, 0px);
      position: relative;
      img {
        width: 100%;
        height: 100%;
      }
      .cover {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, .5);
        @include px2rem(height, 90px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: $white;
        @include pm2rem(padding, 0px, 00px, 0px, 20px);
        @include font-dpr(13px);
        .money {
          font-weight: bold;
        }
      }
    }
  }
  .gallery-list {
    background-color: $white;
    .item {
      // @include px2rem(height, 140px);
      border-bottom: 1px solid #D1D1D1;
      @include pm2rem(padding, 10px, 10px, 10px, 10px);
      display: flex;
      align-items: center;
      img {
        @include px2rem(width, 118px);
        @include px2rem(height, 118px);
        @include px2rem(margin-right, 30px);
      }
      .content {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .name {
          @include font-dpr(15px);
          color: #595959;
          @include px2rem(margin-bottom, 22px);
          line-height: 1;
        }
        .money {
          font-weight: bold;
          line-height: 1;
          color: #F75544;
          @include font-dpr(13px);
        }
      }
    }
  }

  .fade-in-top {
    -webkit-animation: fade-in-top .5s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
            animation: fade-in-top .5s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
  }

  .fade-out-top {
    -webkit-animation: fade-out-top .5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
            animation: fade-out-top .5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  }

  @-webkit-keyframes fade-in-top {
    0% {
      -webkit-transform: translateY(-50px);
              transform: translateY(-50px);
      opacity: 0;
    }
    100% {
      -webkit-transform: translateY(0);
              transform: translateY(0);
      opacity: 1;
    }
  }
  @keyframes fade-in-top {
    0% {
      -webkit-transform: translateY(-50px);
              transform: translateY(-50px);
      opacity: 0;
    }
    100% {
      -webkit-transform: translateY(0);
              transform: translateY(0);
      opacity: 1;
    }
  }

  @-webkit-keyframes fade-out-top {
    0% {
      -webkit-transform: translateY(0);
              transform: translateY(0);
      opacity: 1;
    }
    100% {
      -webkit-transform: translateY(-50px);
              transform: translateY(-50px);
      opacity: 0;
    }
  }
  @keyframes fade-out-top {
    0% {
      -webkit-transform: translateY(0);
              transform: translateY(0);
      opacity: 1;
    }
    100% {
      -webkit-transform: translateY(-50px);
              transform: translateY(-50px);
      opacity: 0;
    }
  }
</style>
