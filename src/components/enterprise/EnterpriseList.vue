<template>
  <section>
    <div v-if="loading && store.length === 0" class="list-container">
      <div v-for="(item, index) in num" :key="index" class="flex-between item-loading primary-text">
        <div class="img-loading"></div>
        <div class="flex flex-1 content-loading">
          <div class="name-loading"></div>
          <div class="service-loading">
            <div class="type-loading"></div>
            <div class="address-loading"></div>
            <div class="address-loading"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="list-container white-bg">
      <a
        v-for="(item, index) in store"
        :key="index"
        @click="handleClick(item)"
        class="flex-between item primary-text">
        <img
          v-lazy="{
            src: item.logo,
            error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
            loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
          }">
        <div class="flex content flex-1 ellipsis">
          <p class="font-14 ellipsis">{{item.name}}</p>
          <div class="font-12 third-text">
            <span
              v-if="item.service_name"
              class="flex-1">{{item.service_name.name}}</span>
            <span
              v-if="item.location"
              class="flex-1">
              {{item.location}}
            </span>
            <span class="flex-1">月销{{item.order_form_count}}笔</span>
          </div>
        </div>
        <div class="flex icon-box">
          <svg v-if="index < 3" class="icon" aria-hidden="true">
            <use v-if="index === 0" xlink:href="#icon-jinpai"></use>
            <use v-if="index === 1" xlink:href="#icon-yinpai"></use>
            <use v-if="index === 2" xlink:href="#icon-tongpai"></use>
          </svg>
        </div>
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
    name: 'EnterpriseList',
    props: ['store', 'loading', 'num'],
    methods: {
      handleClick (item) {
        this.$emit('click', item)
      }
    },
    mounted () {

    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .list-container {
    border-top: 1px solid $third-grey;
    box-sizing: border-box;
    a:active {
      background-color: rgba(239, 234, 234, .5);
    }
    .item {
      align-items: center;
      border-bottom: 1px solid $third-grey;
      @include pm2rem(padding, 0px, 20px, 0px, 20px);
      @include px2rem(height, 140px);
      box-sizing: border-box;
      .content {
        height: inherit;
        line-height: normal;
        flex-direction: column;
        align-items: flex-start;
        p {
          @include px2rem(margin-bottom, 12px);
        }
        div {
          display: inherit;
          width: 100%;
          span {
            @include px2rem(margin-right, 20px);
          }
        }
      }
      .icon-box {
        @include px2rem(width, 80px);
        @include px2rem(height, 80px);
        svg {
          @include font-dpr(34px);
        }
      }
    }
    img {
      @include px2rem(width, 105px);
      @include px2rem(height, 105px);
      @include px2rem(margin-right, 30px);
    }
    img[lazy=loading] {
      @include px2rem(width, 105px);
      @include px2rem(height, 105px);
      @include px2rem(margin-right, 30px);
      background-position: center center!important;
      background: url("../../assets/imgLoading3.jpg");
      background-repeat: no-repeat;
      background-size: cover;
    }
    img[lazy=error] {
      @include px2rem(width, 105px);
      @include px2rem(height, 105px);
      @include px2rem(margin-right, 30px);
      background-position: center center!important;
      background: url("../../assets/imgLoadingError.png");
      background-repeat: no-repeat;
      background-size: cover;
    }
    img[lazy=loaded] {
      @include px2rem(width, 105px);
      @include px2rem(height, 105px);
      @include px2rem(margin-right, 30px);
    }
    .item-loading {
      align-items: center;
      @include pm2rem(padding, 0px, 20px, 0px, 20px);
      @include px2rem(height, 140px);
      box-sizing: border-box;
      background-color: $white;
      border-bottom: 1px solid $third-grey;
      .img-loading {
        @include px2rem(width, 105px);
        @include px2rem(height, 105px);
        @include px2rem(margin-right, 30px);
        background-color: $ninth-grey;
      }
      .content-loading {
        flex-direction: column;
        height: inherit;
        align-items: flex-start;
        .name-loading {
          @include px2rem(width, 460px);
          @include px2rem(height, 36px);
          @include px2rem(margin-bottom, 22px);
          background-color: $ninth-grey;
        }
        .service-loading {
          @include px2rem(width, 400px);
          @include px2rem(height, 24px);
          display: flex;
          justify-content: space-between;
          .type-loading {
            @include px2rem(width, 120px);
            height: inherit;
            background-color: $ninth-grey;
          }
          .address-loading {
            @include px2rem(width, 100px);
            height: inherit;
            background-color: $ninth-grey;
          }
        }
      }
    }
  }
</style>
