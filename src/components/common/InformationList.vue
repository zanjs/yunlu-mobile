<template>
  <section id="informationList">
    <div class="search-container"
         v-bind:class="{'fade-in-top': cssAnimation, 'fade-out-top': !cssAnimation}">
      <input type="text"
             placeholder="搜索资讯"/>
      <i class="iconfont icon-sousuo"/>
    </div>
    <div v-show="show"
         class="gallery-container">
      <div v-show="show"
           class="gallery">
        <div v-for="(item, index) in imgList"
             :key="index"
             @click.stop="handleClick(item)"
             class="img-box">
          <img :src="item.url"/>
          <div class="cover">
            {{item.name}}
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
        imgList: [
          {
            id: 1,
            name: '黄龙云平板',
            money: '1800',
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 2,
            name: '黄龙云平板',
            money: '1799',
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 2,
            name: '黄龙云平板',
            money: '1500',
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 2,
            name: '黄龙云平板',
            money: '定制',
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 2,
            name: '黄龙云平板',
            money: '2800',
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 1,
            name: '黄龙云平板',
            money: '1800',
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 2,
            name: '黄龙云平板',
            money: '1799',
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 2,
            name: '黄龙云平板',
            money: '1500',
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 2,
            name: '黄龙云平板',
            money: '定制',
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 2,
            name: '黄龙云平板',
            money: '2800',
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }
        ]
      }
    },
    props: ['cssAnimation', 'show'],
    methods: {
      scrollToTop () {
        document.body.scrollTop = 0
      },
      handleClick (item) {
        this.$emit('click', item)
      }
    },
    mounted () {
      // this.showSearchBar()
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
      @include line-height(28px);
      @include px2rem(height, 58px);
      text-align: center;
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
  .gallery-container {
    display: block;
  }
  .gallery {
    @include pm2rem(padding, 16px, 2px, 0px, 30px);
    display: flex;
    flex-wrap: wrap;
    .img-box {
      @include px2rem(height, 306px);
      @include px2rem(width, 330px);
      @include pm2rem(margin, 0px, 28px, 30px, 0px);
      position: relative;
      img {
        width: 100%;
        height: 100%;
      }
      .cover {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, .5);
        @include px2rem(height, 50px);
        display: flex;
        justify-content: center;
        color: $white;
        @include font-dpr(13px);
        @include line-height(26px);
      }
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
