<template>
  <section>
    <div class="item-list">
      <div
        class="item"
        v-for="(item, index) in favorites"
        :key="index">
        <div
          v-show="selectable"
          class="icon-box"
          @click="handleChecked(item)">
          <i
            v-if="item.checked"
            class="iconfont icon-xuanzhong checked"></i>
          <i
            v-if="!item.checked"
            class="iconfont icon-weixuanzhong"></i>
        </div>
        <a
          class="container"
          :class="{'no-checkbox': !selectable}"
          @click.stop="handleClick(item)">
          <img :src="item.image_url">
          <div class="content">
            <p class="title">{{item.name || '胖胖的云庐君'}}</p>
            <p class="type">{{item.type | typeFilter}}</p>
          </div>
        </a>
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
    props: ['favorites', 'selectable'],
    name: 'FavoritesList',
    methods: {
      handleClick (item) {
        this.$emit('click', item)
      },
      handleChecked (item) {
        this.$emit('check', item)
      }
    },
    filters: {
      typeFilter (val) {
        switch (val) {
          case 'Product':
            return '商品'
          case 'Organization':
            return '机构'
          case 'User':
            return '用户'
          default:
            return '商品'
        }
      }
    }
  }
</script>

<style lang="scss" scopde>
  @import "../../styles/mixin";

  .item-list {
    background-color: $white;
    border-top: 1px solid $third-grey;
    box-sizing: border-box;
    .item {
      @include px2rem(height, 140px);
      display: flex;
      align-items: center;
      border-bottom: 1px solid $third-grey;
      .icon-box {
        @include px2rem(width, 88px);
        height: inherit;
        display: flex;
        align-items: center;
        justify-content: center;
        i {
          @include font-dpr(20px);
          color: $third-dark;
        }
        .checked {
          color: $green;
        }
      }
      a:active {
        background-color: rgba(239, 234, 234, .5);
      }
      .container {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        height: inherit;
        img {
          @include px2rem(width, 118px);
          @include px2rem(height, 118px);
          @include px2rem(margin-right, 30px);
        }
        .content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-around;
          .title {
            @include font-dpr(16px);
            color: $second-dark;
          }
          .type {
            @include font-dpr(14px);
            color: $third-dark;
          }
        }
      }
      .no-checkbox {
        @include px2rem(padding-left, 20px);
      }
    }
  }
</style>
