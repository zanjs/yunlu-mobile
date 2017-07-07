<template>
  <section>
    <div class="list-container">
      <a v-for="(item, index) in store"
         :key="index"
         @click="handleClick(item.user.id)"
         class="item">
        <img :src="item.user.avatar_url">
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
    box-shadow: 0px 6px 20px rgba(185, 179, 179, 0.5);
    position: fixed;
    @include px2rem(top, 88px);
    left: 0;
    right: 0;
    z-index: 1001;
    input {
      background-color: #EDEDED;
      width: 100%;
      @include px2rem(border-radius, 14px);
      color: #C2C2C2;
      @include font-dpr(14px);
      @include px2rem(line-height, 58px);
      @include px2rem(height, 58px);
      text-align: center;
      vertical-align: middle;
      border: none;
    }
    ::-webkit-input-placeholder{
      color: #C2C2C2;
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
    border-top: 1px solid #D1D1D1;
    @include pm2rem(margin, 10px, 0px, 0px, 0px);
    @include px2rem(min-height, 600px);
    .item {
      display: flex;
      align-items: center;
      color: #595959;
      border-bottom: 1px solid #D1D1D1;
      @include pm2rem(padding, 10px, 20px, 10px, 20px);
      p {
        @include font-dpr(17px);
      }
    }
    a {
      text-decoration: none;
    }
    a:active {
      background-color: #F2F2F2;
    }
    img {
      @include px2rem(width, 118px);
      @include px2rem(height, 118px);
      @include px2rem(margin-right, 30px);
    }
  }
</style>
