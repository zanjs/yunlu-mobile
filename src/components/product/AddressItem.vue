<template>
  <section>
    <div class="item">
      <a
        class="content"
        @click="handleClick(store.id)">
        <div class="flex-between top">
          <span>{{store.recipient}}</span>
          <span>{{store.phone}}</span>
        </div>
        <div class="address">
          <p class="text font-14 second-text">
            {{store.zone_name}}{{store.address}}
          </p>
        </div>
      </a>
      <div class="flex-between option-bar">
        <a
          class="icon-box"
          @click.stop="handleChecked(store.id, store.state)">
          <i
            v-if="store.state === 'default'"
            class="iconfont icon-xuanzhong checked"></i>
          <i
            v-if="store.state === 'normal'"
            class="iconfont icon-weixuanzhong">
          </i>
          <span>设为默认地址</span>
        </a>
        <div class="btn-group">
          <a
            class="btn"
            @click.stop="handleEdit(store)">
            <i class="iconfont icon-bianji"></i>
            <span>编辑</span>
          </a>
          <a
            class="btn"
            @click.stop="handleDelete(store.id)">
            <i class="iconfont icon-105"></i>
            <span>删除</span>
          </a>
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
      handleClick (id) {
        this.$emit('click', id)
      },
      handleChecked (id, state) {
        this.$emit('checked', {state: state, id: id})
      },
      handleDelete (id) {
        this.$emit('delete', id)
      },
      handleEdit (item) {
        this.$emit('edit', item)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .item {
    background-color: $white;
    @include px2rem(margin-bottom, 20px);
    a:active {
      background-color: rgba(239, 234, 234, .5);
    }
    .content {
      display: block;
      position: relative;
      height: auto;
      .top {
        @include pm2rem(padding, 22px, 36px, 0px, 30px);
        @include font-dpr(16px);
        color: $primary-dark;
        line-height: 1;
      }
      .address {
        display: flex;
        flex: 1;
        @include pm2rem(padding, 20px, 30px, 20px, 30px);
        .text {
          line-height: 1.5;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          word-break: break-all;
          float: left;
        }
      }
    }
    .option-bar {
      @include px2rem(height, 83px);
      align-items: center;
      line-height: normal;
      border-top: 1px solid $tenth-grey;
      border-bottom: 1px solid $tenth-grey;
      a:active {
        background-color: rgba(239, 234, 234, .5);
      }
      .icon-box {
        height: inherit;
        display: flex;
        align-items: center;
        i {
          @include font-dpr(21px);
          @include pm2rem(margin, 0px, 17px, 0px, 30px);
          color: $third-dark;
        }
        span {
          @include font-dpr(12px);
          @include px2rem(padding-right, 30px);
          color: $second-red;
        }
        .checked {
          color: $green;
          border-color: $green;
        }
      }
      .btn-group {
        display: flex;
        align-items: center;
        height: inherit;
        @include px2rem(padding-right, 13px);
        .btn {
          @include pm2rem(padding, 0px, 27px, 0px, 27px);
          height: inherit;
          display: flex;
          align-items: center;
          color: $third-dark;
          i {
            @include font-dpr(19px);
          }
          span {
            @include px2rem(margin-left, 16px);
            @include font-dpr(12px);
          }
        }
      }
    }
  }
</style>
