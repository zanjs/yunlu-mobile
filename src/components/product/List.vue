<template>
  <section>
    <div class="gallery-list">
      <div v-for="(item, index) in store"
           :key="index"
           @click.stop="handleClick(item)"
           class="item">
        <div class="img-box">
          <img
            v-if="item.file_thumb_urls"
            v-lazy="item.file_thumb_urls">
          <img
            v-else
            src="../../assets/imgLoading3.jpg">
        </div>
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

      }
    },
    name: 'ProductListMode',
    props: ['store'],
    methods: {
      handleClick (item) {
        this.$emit('click', item)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .gallery-list {
    background-color: $white;
    .item {
      border-bottom: 1px solid #E0E0E0;
      @include pm2rem(padding, 10px, 10px, 10px, 10px);
      display: flex;
      align-items: center;
      .img-box {
        @include px2rem(width, 118px);
        @include px2rem(height, 118px);
        @include px2rem(margin-right, 30px);
        display: block;
        img {
          width: 100%;
          height: 100%;
        }
        img[lazy=loading] {
          width: 100%;
          height: 100%;
          background-position: center center!important;
          background: url("../../assets/imgLoading3.jpg");
          background-repeat: no-repeat;
          background-size: cover;
        }
        img[lazy=error] {
          width: 100%;
          height: 100%;
          background-position: center center!important;
          background: url("../../assets/imgLoading3.jpg");
          background-repeat: no-repeat;
          background-size: cover;
        }
        img[lazy=loaded] {
          width: 100%;
          height: 100%;
        }
      }
      .content {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        flex: 1;
        .name {
          @include font-dpr(15px);
          color: #262626;
          @include px2rem(margin-bottom, 22px);
          line-height: 1;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: normal;
          -webkit-box-orient: vertical;
          display: -webkit-box;
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
</style>
