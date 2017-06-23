<template>
  <section>
    <div class="search-bar">
      <img src="../../assets/homePageTopBg.png">
      <div class="search-input">
        <input type="text"
             placeholder="任你搜 任意搜">
        <i class="iconfont icon-sousuo"></i>
      </div>
      <i class="iconfont icon-geren icon-btn"
         @click="goMine()"></i>
    </div>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
      }
    },
    methods: {
      goBack () {
        this.$router.go(-1)
      },
      goMine () {
        console.log('1')
      }
    },
    mounted () {
    },
    computed: {
      ...mapGetters([
        'user'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .search-bar {
    display: flex;
    align-items: center;
    img {
      position: fixed;
      top: 0;
      @include px2rem(height, 114px);
      width: 100%;
    }
    .search-input {
      position: relative;
      flex: 1;
      display: flex;
      justify-content: center;
      align-content: center;
      @include pm2rem(padding, 22px, 0px, 22px, 0px);
      @include pm2rem(margin, 0px, 44px, 0px, 55px);
      input {
        color: #B4B4B4;
        border: none;
        width: 100%;
        @include px2rem(line-height, 70px);
        @include px2rem(height, 70px);
        @include px2rem(border-radius, 40px);
        @include pm2rem(padding, 0px, 20px, 0px, 102px);
      }
      ::-webkit-input-placeholder{
        color: #C2C2C2;
      }
      i {
        position: absolute;
        color: #B4B4B4;
        @include font-dpr(21px);
        @include px2rem(padding-top, 8px);
        @include px2rem(left, 40px);
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .icon-btn {
      @include font-dpr(26px);
      color: $white;
      z-index: 1000;
      @include pm2rem(margin, 0px, 30px, 0px, 0px);
    }
  }
</style>
