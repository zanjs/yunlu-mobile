<template>
  <section>
    <div class="list-container">
      <a
        v-for="(item, index) in store"
        :key="index"
        @click="handleClick(item.user.id)"
        class="item">
        <img v-lazy="{
              src: item.user.avatar_url,
              error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
              loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
            }">
        <p>{{item.user.name}}</p>
      </a>
    </div>
  </section>
</template>

<script>
  export default {
    data () {
      return {

      }
    },
    props: ['store'],
    methods: {
      handleClick (id) {
        this.$emit('click', id)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .search-container {
    background-color: $white;
    @include pm2rem(padding, 12px, 32px, 12px, 32px);
    position: fixed;
    @include px2rem(top, 88px);
    left: 0;
    right: 0;
    z-index: 1001;
    input {
      background-color: $ninth-grey;
      width: 100%;
      @include px2rem(border-radius, 14px);
      color: $eighth-grey;
      @include font-dpr(14px);
      @include px2rem(line-height, 58px);
      @include px2rem(height, 58px);
      text-align: center;
      vertical-align: middle;
      border: none;
    }
    ::-webkit-input-placeholder{
      color: $eighth-grey;
    }
    i {
      position: absolute;
      @include px2rem(right, 60px);
      @include px2rem(height, 10px);
      @include px2rem(top, 16px);
    }
  }

  .list-container {
    background-color: $white;
    border-top: 1px solid $third-grey;
    @include pm2rem(margin, 10px, 0px, 0px, 0px);
    @include px2rem(min-height, 600px);
    .item {
      display: flex;
      align-items: center;
      color: $second-dark;
      border-bottom: 1px solid $third-grey;
      @include pm2rem(padding, 10px, 20px, 10px, 20px);
      p {
        @include font-dpr(17px);
      }
    }
    a {
      text-decoration: none;
    }
    a:active {
      background-color: $tenth-grey;
    }
    img {
      @include px2rem(width, 118px);
      @include px2rem(height, 118px);
      @include px2rem(margin-right, 30px);
    }
    img[lazy=loading] {
      @include px2rem(width, 118px);
      @include px2rem(height, 118px);
      @include px2rem(margin-right, 30px);
      background-position: center center!important;
      background: url("../../assets/imgLoading3.jpg");
      background-repeat: no-repeat;
      background-size: cover;
    }
    img[lazy=error] {
      @include px2rem(width, 118px);
      @include px2rem(height, 118px);
      @include px2rem(margin-right, 30px);
      background-position: center center!important;
      background: url("../../assets/imgLoadingError.png");
      background-repeat: no-repeat;
      background-size: cover;
    }
    img[lazy=loaded] {
      @include px2rem(width, 118px);
      @include px2rem(height, 118px);
      @include px2rem(margin-right, 30px);
    }
  }
</style>
