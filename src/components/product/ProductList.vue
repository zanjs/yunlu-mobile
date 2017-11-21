<template>
  <section>
    <div class="gallery-list">
      <a
        v-for="(item, index) in store"
        :key="index"
        @click.stop="handleClick(item)"
        class="item">
        <div class="img-box">
          <img
            v-if="item.logo_url"
            v-lazy="{
              src: item.logo_url,
              error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
              loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
            }">
          <img
            v-else
            src="../../assets/imgLoadingError.png">
        </div>
        <div class="content">
          <span class="name">{{item.name}}</span>
          <div class="money">
            <span class="font-12">&yen;</span>
            <span class="font-16">{{item.prices.length === 0 ? '定制' : item.prices[0].money}}</span>
          </div>
        </div>
        <a class="flex icon-box" @click.stop="handleFavorite(item)">
          <i v-if="item.favorable" class="iconfont icon-xuanzhong1 active"></i>
          <i v-else class="iconfont icon-shoucang2"></i>
        </a>
      </a>
    </div>
  </section>
</template>

<script>
  export default {
    data () {
      return {

      }
    },
    name: 'ProductList',
    props: ['store'],
    methods: {
      handleClick (item) {
        this.$emit('click', item)
      },
      handleFavorite (item) {
        this.$emit('favorite', item)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .gallery-list {
    background-color: $white;
    a:active {
      background-color: rgba(239, 234, 234, .5);
    }
    .item {
      border-bottom: 1px solid $third-grey;
      @include pm2rem(padding, 10px, 10px, 10px, 10px);
      display: flex;
      align-items: center;
      a:active {
        background-color: rgba(239, 234, 234, .5);
      }
      .img-box {
        @include px2rem(width, 118px);
        @include px2rem(height, 118px);
        @include px2rem(margin-right, 30px);
        display: block;
        img {
          width: 100%;
          height: 100%;
        }
        img[lazy=loading] {
          width: 100%;
          height: 100%;
          background-position: center center!important;
          background: url("../../assets/imgLoading3.jpg");
          background-repeat: no-repeat;
          background-size: cover;
        }
        img[lazy=error] {
          width: 100%;
          height: 100%;
          background-position: center center!important;
          background: url("../../assets/imgLoadingError.png");
          background-repeat: no-repeat;
          background-size: cover;
        }
        img[lazy=loaded] {
          width: 100%;
          height: 100%;
        }
      }
      .content {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        flex: 1;
        .name {
          @include font-dpr(15px);
          color: $primary-dark;
          @include px2rem(margin-bottom, 22px);
          line-height: 1;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: normal;
          -webkit-box-orient: vertical;
          display: -webkit-box;
        }
        .money {
          line-height: 1;
          color: $red;
        }
      }
      .icon-box {
        @include px2rem(width, 100px);
        @include px2rem(height, 100px);
        line-height: normal;
        color: $second-grey;
        i {
          @include font-dpr(20px);
        }
      }
      .active {
        color: $second-red;
      }
    }
  }
</style>
