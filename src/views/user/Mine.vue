<template>
  <section>
    <div class="user-info">
      <img src="../../assets/seeBg.png"
           class="info-bg">
      <i class="iconfont icon-fanhui"
         @click="goBack()"></i>
      <div class="content">
        胖胖的丸子
      </div>
    </div>
    <div class="user-avatar">
      <div class="circle">
        <img src="../../assets/userAvatarBig.png">
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
    methods: {
      goBack () {
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .user-info {
    position: relative;
    @include px2rem(height, 200px);
    @include pm2rem(padding, 24px, 0px, 0px, 0px);
    i {
      @include px2rem(margin-left, 30px);
      @include font-dpr(25px);
      color: $white;
      position: relative;
    }
    .info-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      @include px2rem(height, 300px);
    }
    .content {
      position: relative;
      @include px2rem(padding-top, 4px);
      @include font-dpr(20px);
      color: #2F705D;
      text-align: center;
    }
  }
  .user-avatar {
    @include pm2rem(margin, -40px, 0px, 0px, 0px);
    position: relative;
    display: flex;
    justify-content: center;
    .circle {
      @include px2rem(width, 208px);
      @include px2rem(height, 208px);
      @include px2rem(border-radius, 108px);
      background-color: #D5D5D5;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        @include px2rem(width, 185px);
        @include px2rem(height, 185px);
        @include px2rem(border-radius, 92.5px);
      }
    }
  }

</style>

