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
        <div>
          <span class="more">更多价格</span>
          <i class="iconfont icon-gengduo more-icon"/>
        </div>
      </div>
      <div class="inventory">
        库存 ：10000
      </div>
    </section>
  </section>
</template>

<script>
  import ProductHeader from '../../components/header/head'
  export default {
    data () {
      return {
        currentIndex: 1,
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
  }
  .page-nav {
    position: absolute;
    @include px2rem(bottom, 16px);
    @include px2rem(right, 16px);
    color: $white;
    @include font-dpr(16px);
    @include pm2rem(padding, 4px, 20px, 4px, 20px);
    background-color: rgba(0, 0, 0, .5);
    display: inline-block;
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
      .more-icon {
        color: #52CAA7;
        @include font-dpr(15px);
      }
    }
    .inventory {
      color: #595959;
      @include font-dpr(13px);
      @include pm2rem(padding, 0px, 0px, 22px, 0px);
    }
  }
</style>
