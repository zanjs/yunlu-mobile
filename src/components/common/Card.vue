<template>
  <section class="card white-bg">
    <div class="user-info">
      <img
        v-if="store && store.avatar_url"
        :src="store.avatar_url">
      <div
        v-else
        class="avatar-loading">
      </div>
      <div class="content">
        <p v-if="store && store.name">{{store.name}}</p>
        <p v-else>胖胖的云庐君</p>
        <template v-if="store && store.mobiles && store.mobiles.length > 0">
          <div class="level">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zhenshi"></use>
            </svg>
          </div>
        </template>
        <template v-if="(store && store.mobiles && store.mobiles.length === 0) || (store && !store.mobiles)">
          <div class="level">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zhenshi3"></use>
            </svg>
          </div>
        </template>
      </div>
    </div>
    <div class="icons">
      <a v-if="store && store.id"
         @click="handleClick({'type': 'chat', 'value': store.id, 'inContact': typeof store.id === 'number'})"
         class="icon-box">
        <i class="iconfont icon-huihua1 huihua"></i>
      </a>
      <a
        v-if="isOnPc(store && store.mobiles && store.mobiles.length > 0)"
        :href="'tel:' + store.mobiles[0]"
        class="icon-box">
        <i class="iconfont icon-dianhua dianhua"></i>
      </a>
      <a v-if="store && store.qq"
         class="icon-box"
         @click="handleClick({'type': 'qq', 'value': store.qq})">
        <i class="iconfont icon-qq qq"></i>
      </a>
      <a v-if="store && store.email"
         class="icon-box"
         @click="handleClick({'type': 'email', 'value': store.email})">
        <i class="iconfont icon-youxiang youxiang"></i>
      </a>
      <a v-if="store && store.address"
         class="icon-box"
         @click="handleClick({'type': 'address', 'value': store.address})">
        <i class="iconfont icon-dingwei dingwei"></i>
      </a>
      <!-- <a v-if="store && store.wechat"
         class="icon-box"
         @click="handleClick({'type': 'wechat', 'value': store.wechat})">
        <i class="iconfont icon-weixin weixin"></i>
      </a>
      <a v-if="store && store.weibo"
         class="icon-box"
         @cilck="handleClick({'type': 'qq', 'value': store.weibo})">
        <i class="iconfont icon-weibo weibo"></i>
      </a> -->
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
    props: ['store'],
    methods: {
      handleClick (obj) {
        this.$emit('click', obj)
      },
      isOnPc (bool) {
        return !isPc() && bool
      }
    },
    mountd: {
    },
    computed: {
      hasLink () {
        return this.store && ((this.store.mobiles && this.store.mobiles.length > 0 && !isPc()) || this.store.id || this.store.email || this.store.address || this.store.qq)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .card {
    border: 1px solid $second-grey;
    background: $white;
    @include px2rem(padding-top, 24px);
    box-shadow: 0 1px 5px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12);
    .user-info {
      display: flex;
      @include pm2rem(padding, 0px, 0px, 30px, 26px);
      img {
        @include px2rem(width, 156px);
        @include px2rem(height, 156px);
      }
      .avatar-loading {
        @include px2rem(width, 156px);
        @include px2rem(height, 156px);
        background-color: $sixth-grey;
      }
      .content {
        @include px2rem(margin-left, 26px);
        p {
          @include font-dpr(17px);
        }
        .level {
          @include px2rem(margin-top, 20px);
          @include font-dpr(23px);
          line-height: 1;
        }
      }
    }

    .icons {
      display: flex;
      @include px2rem(height, 100px);
      @include pm2rem(padding, 0px, 27px, 0px, 27px);
      align-items: center;
      border-top: 1px solid $second-grey;
      a {
        text-decoration: none;
        @include px2rem(width, 108px);
        @include px2rem(max-width, 108px);
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
      .weibo {
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
