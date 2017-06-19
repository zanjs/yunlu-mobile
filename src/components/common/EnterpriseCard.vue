<template>
  <section class="card">
    <div class="user-info">
      <img src="http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg"/>
      <div class="content">
        <p>胖胖的小丸子</p>
        <div>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-v2"></use>
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
        <div class="address-container">
          <span class="address">湖北&middot;武汉</span>
          <span class="tag">石矿主</span>
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
    @include px2rem(padding-top, 40px);
    .user-info {
      display: flex;
      @include pm2rem(padding, 0px, 0px, 40px, 26px);
      img {
        @include px2rem(width, 180px);
        @include px2rem(height, 180px);
      }
      .content {
        @include px2rem(margin-left, 26px);
        p {
          @include font-dpr(17px);
          line-height: 1;
        }
        svg {
          @include font-dpr(20px);
          @include pm2rem(margin, 30px, 16px, 30px, 0px);
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
      @include pm2rem(padding, 0px, 50px, 0px, 50px);
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #d1d1d1;
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
