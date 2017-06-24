<template>
  <section>
    <div class="user-info">
      <img src="../../assets/seeBg.png"
           class="info-bg">
      <i class="iconfont icon-fanhui"
         @click="goBack()"></i>
      <div class="content">
        {{currentUser.home_name}}
      </div>
    </div>
    <div class="user-avatar">
      <div class="circle">
        <img src="../../assets/userAvatarBig.png">
      </div>
    </div>
    <div class="logout-btn">
      <a @click="logOut()">
        退出登录
      </a>
    </div>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getStore, removeAllStore } from '../../config/mUtils'
  export default {
    data () {
      return {
        currentUser: getStore('user')
      }
    },
    methods: {
      goBack () {
        this.$router.go(-1)
      },
      logOut () {
        removeAllStore()
        this.$router.push({name: 'Login', params: {}})
      }
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

  .logout-btn {
    @include px2rem(width, 520px);
    @include px2rem(height,70px);
    background-color: #52CAA7;
    color: $white;
    margin: 0 auto;
    @include px2rem(margin-top, 22px);
    text-align: center;
    @include px2rem(line-height, 70px);
    @include font-dpr(15px);
    display: block;
    a:active {
      background-color: rgba(82, 202, 167, .5);
    }
  }
</style>

