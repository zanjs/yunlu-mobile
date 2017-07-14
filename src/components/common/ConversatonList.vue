<template>
  <section>
    <div class="list-container">
      <div
        v-for="(item, index) in store"
        :key="index"
        class="row-item">
        <div
          class="check-box"
          @click="handleChecked(item, item.checked)">
          <i
            v-if="item.checked"
            class="iconfont icon-xuanzhong checked"></i>
          <i
            v-if="!item.checked"
            class="iconfont icon-weixuanzhong"></i>
        </div>
        <div
          class="container"
          @click="handleClick(item)">
          <img :src="item.fromLogo">
          <div
            class="content">
            <div class="top">
              <span class="name">{{item.fromName}}</span>
              <span class="date">{{item.timestamp}}</span>
            </div>
            <div class="msg">
              {{item.lastMessage}}
            </div>
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
    props: ['store'],
    methods: {
      handleClick (item) {
        this.$emit('click', item)
      },
      handleChecked (item, bool) {
        this.$emit('check', {item: item, checked: bool})
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .list-container {
    background-color: $white;
    .row-item {
      display: flex;
      align-items: center;
      @include px2rem(height, 140px);
      border-bottom: 1px solid #E0E0E0;
      .check-box {
        @include px2rem(width, 74);
        @include px2rem(padding-left, 28px);
        height: inherit;
        display: flex;
        align-items: center;
        i {
          @include font-dpr(21px);
          color: #D1D1D1;
        }
        .checked {
          color: #52CAA7;
        }
      }
      .container {
        flex: 1;
        display: flex;
        align-items: center;
        height: inherit;
        img {
          @include px2rem(width, 118px);
          @include px2rem(height, 118px);
          @include px2rem(border-radius, 59px);
          @include px2rem(margin-right, 30px);
        }
      }
      .content {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        line-height: 1;
        flex: 1;
        height: inherit;
        @include px2rem(padding-right, 32px);
        .top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .name {
            @include font-dpr(16px);
            color: #595959;
          }
          .date {
            @include font-dpr(14px);
            color: #A6A6A6;
          }
        }
        .msg {
          @include font-dpr(14px);
          color: #A6A6A6;
        }
      }
    }
  }
</style>
