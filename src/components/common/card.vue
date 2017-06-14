<template>
  <section class="card">
    <div class="user-info">
      <img src="http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg"/>
      <div class="content">
        <p>胖胖的小丸子</p>
        <div>
          <span>个人简介</span>
        </div>
      </div>
    </div>
    <div class="icons">
      <div>
        <i class="iconfont icon-dianhua dianhua"></i>
      </div>
      <div>
        <i class="iconfont icon-youxiang youxiang"></i>
      </div>
      <div>
        <i class="iconfont icon-dingwei dingwei"></i>
      </div>
      <div>
        <i class="iconfont icon-weixin weixin"></i>
      </div>
      <div>
        <i class="iconfont icon-weibo weibo"></i>
      </div>
      <div>
        <i class="iconfont icon-qq qq"></i>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    data () {
      return {}
    },
    methods: {},
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
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #d1d1d1;
      i {
        @include font-dpr(26px);
      }
      .dianhua {
        color: #4C8DE7;
      }
      .youxiang {
        color: #4C8DE7;
      }
      .dingwei {
        color: #F66F65;
      }
      .weixin {
        color: #76A9EB;
      }
      .weibo {
        color: #C54FDE;
      }
      .qq {
        color: #F9B000;
      }
    }
  }
</style>
