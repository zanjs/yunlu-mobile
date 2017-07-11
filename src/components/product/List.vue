<template>
  <section>
    <div class="gallery-list">
      <div v-for="(item, index) in store"
           :key="index"
           @click.stop="handleClick(item)"
           class="item">
        <img
          v-if="item.file_thumb_urls"
          :src="item.file_thumb_urls">
        <img
          v-else
          src="../../assets/noImg.png">
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
          color: #262626;
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
</style>
