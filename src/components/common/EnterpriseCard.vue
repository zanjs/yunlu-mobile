<template>
  <section class="card">
    <div class="user-info"
         @click.stop="handleClick(store)">
      <div class="img-container">
        <img v-if="store && store.logo"
             :src="store.logo"/>
        <img v-else
             src="../../assets/blank.jpg">
      </div>
      <div class="content">
        <p v-if="store && store.name">{{store.name}}</p>
        <p v-else>胖胖的云庐君</p>
        <div v-if="false"
             class="icon-container">
          <svg class="icon big" aria-hidden="true">
            <use xlink:href="#icon-v4"></use>
          </svg>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-D3"></use>
          </svg>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-J"></use>
          </svg>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-Z4"></use>
          </svg>
        </div>
        <div
          v-else
          class="icon-container">
        </div>
        <div class="address-container">
          <span
            class="address"
            v-if="store && store.provice_name && store.city_name">{{store.provice_name}}&middot;{{store.city_name}}</span>
          <span
            v-else
            class="address">&nbsp;</span>
          <span
            v-if="store && store.service && store.service.name"
            class="tag">{{store.service.name}}</span>
        </div>
      </div>
    </div>
    <div class="icons">
      <a
        v-if="store && store.phone"
        :href="'tel:' + store.phone"
        class="icon-box">
        <i class="iconfont icon-dianhua dianhua"></i>
      </a>
      <a
        v-if="store && store.email"
        @click="handleIconClick((store.email))"
        class="icon-box">
        <i class="iconfont icon-youxiang youxiang"></i>
      </a>
      <a
        v-if="store && store.longitude && store.latitude"
        @click="handleIconClick({longitude: store.longitude, latitude: store.latitude})"
        class="icon-box">
        <i class="iconfont icon-dingwei dingwei"></i>
      </a>
      <a
        v-if="store && store.qq"
        @click="handleIconClick(store.qq)"
        class="icon-box">
        <i class="iconfont icon-weixin weixin"></i>
      </a>
      <a
        v-if="store && store.qq"
        @click="handleIconClick(store.qq)"
        class="icon-box">
        <i class="iconfont icon-weibo weibo"></i>
      </a>
      <a
        v-if="store && store.qq"
        @click="handleIconClick(store.qq)"
        class="icon-box">
        <i class="iconfont icon-qq qq"></i>
      </a>
    </div>
  </section>
</template>

<script>
  export default {
    data () {
      return {}
    },
    props: ['store'],
    methods: {
      handleClick (item) {
        this.$emit('click', item.enterprise_id)
      },
      handleIconClick (obj) {
        this.$emit('', obj)
      }
    },
    mountd: {

    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .card {
    border: 1px solid #D1D1D1;
    background: $white;
    @include px2rem(padding-top, 40px);
    .user-info {
      display: flex;
      @include pm2rem(padding, 0px, 26px, 40px, 26px);
      .img-container {
        display: flex;
        justify-content: center;
        align-items: center;
        @include px2rem(width, 180px);
        @include px2rem(height, 180px);
        img {
          @include px2rem(max-width, 180px);
          @include px2rem(max-height, 180px);
          width: 100%;
          height: 100%;
        }
      }
      .content {
        flex: 1;
        display: flex;
        @include px2rem(margin-left, 26px);
        @include px2rem(width, 448px);
        @include px2rem(height, 185px);
        flex-direction: column;
        justify-content: space-between;
        p {
          @include font-dpr(17px);
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        .icon-container {
          display: flex;
          align-items: center
        }
        .big {
          @include font-dpr(25px);
        }
        svg {
          @include font-dpr(20px);
          @include pm2rem(margin, 20px, 16px, 30px, 0px);
        }
        .address-container {
          .address {
            @include font-dpr(13px);
            color: #F75544;
            @include px2rem(margin-right, 40px);
          }
          .tag {
            @include px2rem(height, 40px);
            @include pm2rem(padding, 0px, 10px, 0px, 10px);
            @include px2rem(border-radius, 10px);
            background-color: #52CAA7;
            color: $white;
            @include font-dpr(12px);
            display: inline-block;
            @include px2rem(line-height, 42px);
            text-align: center;
          }
        }
      }
    }

    .icons {
      display: flex;
      @include px2rem(height, 100px);
      @include pm2rem(padding, 0px, 27px, 0px, 27px);
      justify-content: flex-start;
      align-items: center;
      border-top: 1px solid #d1d1d1;
      a {
        text-decoration: none;
        @include px2rem(width, 108px);
        display: flex;
        align-items: center;
        justify-content: center;
        height: inherit;
      }
      i {
        @include font-dpr(24px);
      }
      .dianhua {
        color: #31C27C;
      }
      .youxiang {
        color: #4C8DE7;
      }
      .dingwei {
        color: #F75544;
      }
      .weixin {
        color: #2EB6FC;
      }
      .weibo {
        color: #D52EFF;
      }
      .qq {
        color: #F9B000;
      }
    }
  }
</style>
