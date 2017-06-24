<template>
  <section id="productList">
    <div v-if="show && thumbnails"
         class="gallery-container">
      <div v-show="thumbnails"
           class="gallery">
        <div v-for="(item, index) in store"
             :key="index"
             @click.stop="handleClick(item)"
             class="img-box">
          <img :src="item.file_url">
          <div class="cover">
            <span class="name">{{item.name}}</span>
            <span class="money">&yen; ：{{item.prices[0].money}}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="show && !thumbnails"
         class="gallery-list">
      <div v-for="(item, index) in store"
           :key="index"
           @click.stop="handleClick(item)"
           class="item">
        <img :src="item.file_thumb_urls">
        <div class="content">
          <span class="name">{{item.name}}</span>
          <span class="money">&yen; ：{{item.prices[0].money}}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    data () {
      return {
        thumbnails: true,
        orderUp: 1, // 正数按照最低价升序，负数按照最低价降序(默认1为最低价)
        searchParams: ''
      }
    },
    props: ['cssAnimation', 'show', 'store', 'showBar', 'showList'],
    methods: {
      swithList () {
        this.thumbnails = !this.thumbnails
      },
      changeOrder () {
        this.orderUp = 0 - this.orderUp
        this.scrollToBar()
        this.$emit('search', this.searchParams, this.orderUp)
      },
      scrollToBar () {
        document.body.scrollTop = parseFloat(document.documentElement.style.fontSize.replace('px', '')) * 160 / 36
      },
      scrollToTop () {
        document.body.scrollTop = 0
      },
      handleClick (item) {
        this.scrollToTop()
        this.$emit('click', item)
      },
      handleSearch () {
        this.scrollToBar()
        this.$emit('search', this.searchParams, this.orderUp)
      }
    },
    mounted () {
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

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
        @include px2rem(height, 90px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: $white;
        @include pm2rem(padding, 0px, 00px, 0px, 20px);
        @include font-dpr(13px);
        .money {
          font-weight: bold;
        }
      }
    }
  }
  .gallery-list {
    background-color: $white;
    .item {
      // @include px2rem(height, 140px);
      border-bottom: 1px solid #D1D1D1;
      @include pm2rem(padding, 10px, 10px, 10px, 10px);
      display: flex;
      align-items: center;
      img {
        @include px2rem(width, 118px);
        @include px2rem(height, 118px);
        @include px2rem(margin-right, 30px);
      }
      .content {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .name {
          @include font-dpr(15px);
          color: #595959;
          @include px2rem(margin-bottom, 22px);
          line-height: 1;
        }
        .money {
          font-weight: bold;
          line-height: 1;
          color: #F75544;
          @include font-dpr(13px);
        }
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

  .fade-enter {
    // -webkit-transform: translateY(-50px);
    //         transform: translateY(-50px);
              opacity: 0;
  }

  .fade-enter-active {
    // -webkit-transform: translateY(0);
    //         transform: translateY(0);
              opacity: 1;
           transition: .5s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
  }

  .fade-leave-active {
    // -webkit-transform: translateY(-50px);
    //         transform: translateY(-50px);
              opacity: 0;
           transition: .5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
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
