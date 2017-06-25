<template>
  <section class="card">
    <div class="user-info">
      <img
        v-if="store && store.avatar_url"
        :src="store.avatar_url">
      <img
        v-else
        src="http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg">
      <div class="content">
        <p v-if="store && store.name">{{store.name}}</p>
        <p v-else>**</p>
        <div>
          <span>个人简介</span>
        </div>
      </div>
    </div>
    <div class="icons">
      <a v-if="store && store.mobiles && store.mobiles.length > 0"
         :href="'tel:' + store.mobiles[0]"
         class="icon-box"
         @click="handleClick({'action': 'mobile', 'value': store.mobiles})">
        <i class="iconfont icon-dianhua dianhua"></i>
      </a>
      <a v-if="store && store.email"
         class="icon-box"
         @click="handleClick({'action': 'email', 'value': store.email})">
        <i class="iconfont icon-youxiang youxiang"></i>
      </a>
      <a v-if="store && store.address"
         class="icon-box"
         @click="handleClick({'action': 'address', 'value': store.address})">
        <i class="iconfont icon-dingwei dingwei"></i>
      </a>
      <a v-if="store && store.wechat"
         class="icon-box"
         @click="handleClick({'action': 'wechat', 'value': store.wechat})">
        <i class="iconfont icon-weixin weixin"></i>
      </a>
      <a v-if="store && store.weibo"
         class="icon-box"
         @cilck="handleClick({'action': 'qq', 'value': store.weibo})">
        <i class="iconfont icon-weibo weibo"></i>
      </a>
      <a v-if="store && store.qq"
         class="icon-box"
         @click="handleClick({'action': 'qq', 'value': store.qq})">
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
      handleClick (obj) {
        this.$emit('click', obj)
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
    @include px2rem(padding-top, 24px);
    .user-info {
      display: flex;
      @include pm2rem(padding, 0px, 0px, 30px, 26px);
      img {
        @include px2rem(width, 156px);
        @include px2rem(height, 156px);
      }
      .content {
        @include px2rem(margin-left, 26px);
        p {
          @include font-dpr(17px);
        }
      }
    }

    .icons {
      display: flex;
      @include px2rem(height, 100px);
      @include pm2rem(padding, 0px, 50px, 0px, 50px);
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
