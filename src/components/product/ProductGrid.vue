<template>
  <section>
    <div v-if="loading && store.length === 0" class="gallery">
      <div
        v-for="(item, index) in num"
        :key="index"
        class="loading-box animated-background">
        <div class="img-loading"></div>
        <div class="text-area">
          <div class="name-loading"></div>
          <div class="money-loading"></div>
        </div>
      </div>
    </div>
    <div v-else class="gallery">
      <div
        v-for="(item, index) in store"
        :key="index"
        @click.stop="handleClick(item)"
        class="img-box white-bg">
        <img
          v-lazy="{
            src: item.logo_url,
            error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
            loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
          }"
          class="normal">
        <div class="cover">
          <div class="wraper">
            <div class="ellipsis name">{{item.name}}</div>
            <div class="flex info">
              <div class="flex money">
                <span class="font-12">&yen;</span>
                <span class="font-18 ellipsis">
                  {{item.prices.length === 0 ? '定制' : item.prices[0].money}}
                </span>
              </div>
              <div class="flex icon-box" @click.stop="handleFavorite(item)">
                <i v-if="item.favorable" class="iconfont icon-xuanzhong1 active"></i>
                <i v-else class="iconfont icon-shoucang2"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    name: 'ProductGrid',
    props: ['store', 'loading', 'num'],
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

  .gallery {
    @include pm2rem(padding, 16px, 8px, 0px, 22px);
    @include px2rem(min-height, 600px);
    display: flex;
    flex-wrap: wrap;
    .img-box {
      @include px2rem(width, 346px);
      @include px2rem(height, 460px);
      @include pm2rem(margin, 0px, 14px, 20px, 0px);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      box-sizing: border-box;
      border: 1px solid $tenth-grey;
      box-shadow: 0 4px 6px -2px rgba(181, 181, 181, 0.2);
      img[lazy=loading] {
        @include px2rem(height, 346px);
        width: 100%;
        background-position: center center!important;
        background: url("../../assets/imgLoading3.jpg");
        background-repeat: no-repeat;
        background-size: cover;
      }
      img[lazy=error] {
        @include px2rem(height, 346px);
        width: 100%;
        background-position: center center!important;
        background: url("../../assets/imgLoadingError.png");
        background-repeat: no-repeat;
        background-size: cover;
      }
      img[lazy=loaded] {
        @include px2rem(height, 346px);
        width: 100%;
      }
      .normal {
        @include px2rem(height, 346px);
        width: 100%;
      }
      .empty {
        @include px2rem(height, 346px);
        @include px2rem(width, 346px);
      }
      .cover {
        @include px2rem(height, 110px);
        display: block;
        color: $primary-dark;
        @include font-dpr(14px);
        width: inherit;
        .wraper {
          @include pm2rem(padding, 0px, 0px, 0px, 20px);
          width: inherit;
          height: inherit;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          box-sizing: border-box;
          .name {
            @include pm2rem(margin, 10px, 0px, 0px, 0px);
            line-height: normal;
            box-sizing: border-box;
            position: relative;
            width: 100%;
          }
          .info {
            flex: 1;
            box-sizing: border-box;
            color: #FF0000;
            line-height: normal;
            justify-content: space-between;
            width: 100%;
            .money {
              align-items: baseline;
              justify-content: flex-start;
              span {
                @include px2rem(margin-right, 10px);
              }
              & span:last-child {
                @include px2rem(width, 200px);
              }
            }
            .icon-box {
              height: 100%;
              @include px2rem(width, 80px);
              line-height: normal;
              color: $second-grey;
              i {
                @include font-dpr(18px);
              }
              .active {
                color: $second-red;
              }
            }
          }
        }
      }
    }
    .loading-box {
      @include px2rem(width, 346px);
      @include px2rem(height, 460px);
      @include pm2rem(margin, 0px, 14px, 20px, 0px);
      box-sizing: border-box;
      border: 1px solid $tenth-grey;
      background-color: $white;
      box-shadow: 0 4px 6px -2px rgba(181, 181, 181, 0.2);
      .img-loading {
        width: inherit;
        background-color: $ninth-grey;
        @include px2rem(height, 346px);
      }
      .text-area {
        position: relative;
        @include px2rem(height, 114px);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-around;
        @include px2rem(padding-left, 10px);
        width: inherit;
        .name-loading {
          @include px2rem(width, 200px);
          @include px2rem(height, 34px);
          background-color: $ninth-grey;
        }
        .money-loading {
          @include px2rem(width, 120px);
          @include px2rem(height, 32px);
          background-color: $ninth-grey;
        }
      }
    }
  }
</style>
