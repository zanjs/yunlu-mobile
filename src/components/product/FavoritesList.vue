<template>
  <section class="list-container">
    <div class="item-list">
      <a
        class="item"
        v-for="(item, index) in favorites"
        :key="index"
        @click="itemClick(item, selectable)">
        <div
          v-show="selectable"
          class="icon-box">
          <i
            v-if="item.checked"
            class="iconfont icon-xuanzhong checked">
          </i>
          <i
            v-if="!item.checked"
            class="iconfont icon-weixuanzhong">
          </i>
        </div>
        <div
          v-show="selectable"
          class="container">
          <img :src="item.image_url">
          <div class="content">
            <p class="title">{{item.name || '胖胖的云庐君'}}</p>
          </div>
        </div>
        <a
          v-show="!selectable"
          class="container"
          :class="{'no-checkbox': !selectable}"
          @click.stop="handleClick(item)">
          <img :src="item.image_url">
          <div class="content">
            <p class="title">{{item.name || '胖胖的云庐君'}}</p>
          </div>
        </a>
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
    props: ['favorites', 'selectable'],
    name: 'FavoritesList',
    methods: {
      itemClick (item, bool) {
        if (bool) {
          this.$emit('check', item)
        }
      },
      handleClick (item) {
        this.$emit('click', item)
      },
      handleChecked (item) {
        this.$emit('check', item)
      }
    }
  }
</script>

<style lang="scss" scopde>
  @import "../../styles/mixin";

  .list-container {
    a:active {
      background-color: rgba(239, 234, 234, .5);
    }
  }
  .item-list {
    background-color: $white;
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
          @include px2rem(min-width, 118px);
          @include px2rem(margin-right, 30px);
        }
        .content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          height: inherit;
          @include px2rem(padding-right, 20px);
          .title {
            @include font-dpr(14px);
            color: $second-dark;
            text-align: left;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-all;
          }
        }
      }
      .no-checkbox {
        @include px2rem(padding-left, 20px);
      }
    }
  }
</style>
