<template>
  <section class="card white-bg">
    <div class="user-info"
         @click.stop="handleClick(store)">
      <div class="img-container flex">
        <img v-if="store && store.logo"
             :src="store.logo"/>
        <img v-else
             src="../../assets/blank.jpg">
      </div>
      <div class="flex-between content">
        <p
          v-if="store && store.company"
          class="font-17 ellipsis">{{store.company}}</p>
        <p
          v-else
          class="font-17 ellipsis">胖胖的云庐君</p>
        <div v-if="true"
          class="icon-container">
          <template v-if="store && store.state && store.state !== 'approved'">
            <svg
              class="icon large"
              aria-hidden="true">
              <use xlink:href="#icon-zhenshi3"></use>
            </svg>
          </template>
          <template v-if="store && store.state && store.state === 'approved'">
            <svg
              class="icon large"
              aria-hidden="true">
              <use xlink:href="#icon-zhenshi4"></use>
            </svg>
          </template>
          <template v-if="false">
            <svg class="icon large" aria-hidden="true">
              <use xlink:href="#icon-zhenshi3"></use>
            </svg>
            <svg class="icon large" aria-hidden="true">
              <use xlink:href="#icon-zhenshi3"></use>
            </svg>
            <svg class="icon large" aria-hidden="true">
              <use xlink:href="#icon-zhenshi3"></use>
            </svg>
          </template>
        </div>
        <div
          v-else
          class="icon-container">
        </div>
        <div class="address-container">
          <!-- 取消显示地址 -->
          <span
            class="address font-13 second"
            v-if="false">
            {{store.provice_name}}&middot;{{store.city_name}}
          </span>
          <span
            v-else
            class="address font-13 second">&nbsp;</span>
          <!-- 取消显示类型 -->
          <span
            v-if="false"
            class="tag white primary-bg font-12">{{store.service.name}}</span>
        </div>
      </div>
    </div>
    <div class="icons">
      <a
        v-if="products && products.length > 0 && store.service.name !== '协会' && store.service.name !== '校友会' && store.service.name !== '班级'"
        @click="handleIconClick({type: 'chat', value: products[0].id})"
        class="icon-box">
        <i class="iconfont icon-huihua1 huihua"></i>
      </a>
      <a
        v-if="isOnPc(store && store.mobile)"
        :href="'tel:' + store.mobile"
        class="icon-box">
        <i class="iconfont icon-dianhua dianhua"></i>
      </a>
      <a
        v-if="store && store.qq"
        @click="handleIconClick({type: 'qq', value: store.qq})"
        class="icon-box">
        <i class="iconfont icon-qq qq"></i>
      </a>
      <a
        v-if="store && store.email"
        @click="handleIconClick({type: 'email', value: store.email})"
        class="icon-box">
        <i class="iconfont icon-youxiang youxiang"></i>
      </a>
      <a
        v-if="store && (store.address || store.longitude && store.latitude)"
        @click="handleIconClick({type:'address', value: {longitude: store.longitude, latitude: store.latitude, address: store.address}})"
        class="icon-box">
        <i class="iconfont icon-dingwei dingwei"></i>
      </a>
      <!-- <a
        v-if="store && store.wechat"
        @click="handleIconClick({type: 'wechat', value: store.wechat})"
        class="icon-box">
        <i class="iconfont icon-weixin weixin"></i>
      </a> -->
      <a
        v-if="store && store.website"
        @click="handleIconClick({type: 'website', value: store.website})"
        class="icon-box">
        <i class="iconfont icon-wangluo wangluo"></i>
      </a>
      <div
        v-if="!hasLink"
        class="tips">暂无联系方式</div>
    </div>
  </section>
</template>

<script>
  import { isPc } from '../../config/mUtils'
  export default {
    data () {
      return {}
    },
    props: ['store', 'products'],
    methods: {
      handleClick (item) {
        this.$emit('click', item.enterprise_id)
      },
      handleIconClick (obj) {
        this.$emit('icon-click', obj)
      },
      isOnPc (bool) {
        return !isPc() && bool
      }
    },
    computed: {
      hasLink () {
        return (this.products && this.products.length > 0 && this.store.service.name !== '协会' && this.store.service.name !== '校友会' && this.store.service.name !== '班级') || (this.store && ((this.store.mobile && !isPc()) || this.store.email || this.store.address || this.store.longitude || this.store.latitude || this.store.wechat || this.store.website || this.store.qq))
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .card {
    border: 1px solid $third-grey;
    @include px2rem(padding-top, 40px);
    .user-info {
      display: flex;
      @include pm2rem(padding, 0px, 26px, 40px, 26px);
      .img-container {
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
        @include px2rem(margin-left, 26px);
        @include px2rem(width, 448px);
        @include px2rem(height, 185px);
        flex-direction: column;
        .icon-container {
          display: flex;
          align-items: center;
          line-height: 1;
          .large {
            @include font-dpr(23px);
          }
        }
        svg {
          @include pm2rem(margin, 20px, 18px, 30px, 0px);
        }
        .address-container {
          .address {
            @include px2rem(margin-right, 40px);
          }
          .tag {
            @include px2rem(height, 40px);
            @include pm2rem(padding, 0px, 10px, 0px, 10px);
            @include px2rem(border-radius, 10px);
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
      border-top: 1px solid $third-grey;
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
      .huihua {
        color: #d52eff;
      }
      .dianhua {
        color: #31C27C;
      }
      .youxiang {
        color: #4C8DE7;
      }
      .dingwei {
        color: $red;
      }
      .weixin {
        color: #2EB6FC;
      }
      .wangluo {
        color: #D52EFF;
      }
      .qq {
        color: #F9B000;
      }
      .tips {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: inherit;
        height: inherit;
        line-height: 1;
        @include font-dpr(13px);
        color: $third-dark;
      }
    }
  }
</style>
