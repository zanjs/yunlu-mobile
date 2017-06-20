<template>
  <section>
    <div class="search-container"
         v-bind:class="{'fade-in-top': cssAnimation, 'fade-out-top': !cssAnimation}">
      <input type="text"
             placeholder="搜索企业"/>
      <i class="iconfont icon-sousuo"/>
    </div>
    <div v-show="show"
         class="list-container">
      <div v-for="(item, index) in dataSource"
           :key="index"
           class="item">
        <img :src="item.url"/>
        <div class="content">
          <p>{{item.name}}</p>
          <div>
            <span class="type">{{item.type}}</span>
            <span class="address">{{item.province}}&middot;{{item.city}}</span>
          </div>
        </div>
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
    props: ['show', 'dataSource', 'cssAnimation'],
    methods: {

    },
    mounted () {

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
      @include px2rem(line-height, 98px); // 这里input 的line-height要大于height,input中的文字才能垂直居中
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
    .item {
      display: flex;
      align-items: center;
      color: #595959;
      border-bottom: 1px solid #D1D1D1;
      @include pm2rem(padding, 10px, 20px, 10px, 20px);
      .content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        p {
          @include font-dpr(15px);
          line-height: 1;
          @include px2rem(margin-bottom, 22px);
        }
        div {
          line-height: 1;
          @include font-dpr(13px);
        }
        .address {
          color: #F75544;
          @include px2rem(margin-left, 30px);
        }
      }
    }
    img {
      @include px2rem(width, 118px);
      @include px2rem(height, 118px);
      @include px2rem(margin-right, 30px);
    }
  }
  .fade-in-top {
    -webkit-animation: fade-in-top .5s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
            animation: fade-in-top .5s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
  }

  .fade-out-top {
    -webkit-animation: fade-out-top .5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
            animation: fade-out-top .5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  }
  @-webkit-keyframes fade-in-top {
    0% {
      -webkit-transform: translateY(-50px);
              transform: translateY(-50px);
      opacity: 0;
    }
    100% {
      -webkit-transform: translateY(0);
              transform: translateY(0);
      opacity: 1;
    }
  }
  @keyframes fade-in-top {
    0% {
      -webkit-transform: translateY(-50px);
              transform: translateY(-50px);
      opacity: 0;
    }
    100% {
      -webkit-transform: translateY(0);
              transform: translateY(0);
      opacity: 1;
    }
  }

  @-webkit-keyframes fade-out-top {
    0% {
      -webkit-transform: translateY(0);
              transform: translateY(0);
      opacity: 1;
    }
    100% {
      -webkit-transform: translateY(-50px);
              transform: translateY(-50px);
      opacity: 0;
    }
  }
  @keyframes fade-out-top {
    0% {
      -webkit-transform: translateY(0);
              transform: translateY(0);
      opacity: 1;
    }
    100% {
      -webkit-transform: translateY(-50px);
              transform: translateY(-50px);
      opacity: 0;
    }
  }
</style>
