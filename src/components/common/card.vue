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
        <i class="fa fa-home"></i>
      </div>
      <div>
        <i class="fa fa-home"></i>
      </div>
      <div>
        <i class="fa fa-home"></i>
      </div>
      <div>
        <i class="fa fa-home"></i>
      </div>
      <div>
        <i class="fa fa-home"></i>
      </div>
      <div>
        <i class="fa fa-home"></i>
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
    @include px2rem(padding-top, 12px);
    .user-info {
      display: flex;
      @include px2rem(padding-left, 13px);
      @include px2rem(padding-bottom, 15px);
      img {
        @include px2rem(width, 78px);
        @include px2rem(height, 78px);
      }
      .content {
        @include px2rem(margin-left, 13px);
        p {
          @include font-dpr(17px);
        }
      }
    }

    .icons {
      display: flex;
      @include px2rem(height, 50px);
      @include px2rem(padding-left, 25px);
      @include px2rem(padding-right, 25px);
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #d1d1d1;
      i {
        @include font-dpr(34px);
      }
    }
  }
</style>
