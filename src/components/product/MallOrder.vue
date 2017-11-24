<template>
  <section class="flex order-container">
    <div class="flex left">
      <div class="flex item">
        <a :class="{'icon-active': sortType === 0}" @click="changeSortType(0)">综合</a>
      </div>
      <!-- <div class="flex item">
        <a :class="{'icon-active': sortType === 1}" @click="changeSortType(1)">销量</a>
      </div> -->
      <div class="flex item box">
        <a @click="changeOrder(orderUp)">
          <span :class="{'icon-active': sortType === 2}">价格</span>
          <div class="flex icon-box">
            <i class="iconfont icon-shang" :class="{'icon-active': orderUp && sortType === 2, 'icon-inactive': !orderUp}"></i>
            <i class="iconfont icon-xia" :class="{'icon-active': !orderUp && sortType === 2, 'icon-inactive': orderUp}"></i>
          </div>
        </a>
      </div>
    </div>
    <div class="flex right">
      <a class="flex icon-inactive" :class="{'icon-active': hasFilter}" @click="handleFilter()">
        <i class="iconfont icon-youshangjiaoshaixuan"></i>
      </a>
      <a class="flex" @click="swithList(showList)">
        <i class="iconfont icon-inactive" :class="{'icon-liebiao': !showList, 'icon-liebiao1': showList}"></i>
      </a>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'MallOrder',
    props: ['orderUp', 'showList', 'sortType', 'hasFilter'],
    data () {
      return {

      }
    },
    methods: {
      changeOrder (val) {
        this.$emit('order-change', !val)
      },
      swithList (val) {
        this.$emit('switch', !val)
      },
      changeSortType (num) {
        this.$emit('sort-type-change', num)
      },
      handleFilter () {
        this.$emit('switch-filter', true)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .order-container {
    @include px2rem(height, 80px);
    background-color: $white;
    border-bottom: 1px solid $second-grey;
    border-top: 1px solid $second-grey;
    box-shadow: 0px 4px 4px -4px rgba(199, 194, 194, .4);
    z-index: 2;
    .left {
      flex: 2;
      height: inherit;
      @include px2rem(padding-right, 20px);
      .item {
        flex: 1;
        height: inherit;
        a {
          @include font-dpr(14px);
          color: $third-dark;
          line-height: normal;
          display: flex;
          justify-content: center;
          align-items: center;
          flex: 1;
          height: inherit;
        }
        a:active {
          background-color: rgba(239, 234, 234, .5);
        }
        .icon-box {
          flex-direction: column;
          @include px2rem(margin-left, 10px);
          i {
            @include font-dpr(12px);
            line-height: 1;
          }
          & :first-child {
            @include px2rem(margin-bottom, -2px);
          }
          & :last-child {
            @include px2rem(margin-top, -2px);
          }
        }
        .icon-active {
          color: $second-red;
          transition: color .3s;
        }
        .icon-inactive {
          color: $third-dark;
          transition: color .3s;
        }
      }
    }
    .right {
      flex: 1;
      @include px2rem(height, 40px);
      justify-content: space-around;
      border-left: 1px solid $third-dark;
      @include px2rem(padding-left, 20px);
      a {
        @include px2rem(height, 80px);
        flex: 1;
      }
      a:active {
        background-color: rgba(239, 234, 234, .5);
      }
      i {
        @include font-dpr(16px);
      }
      .icon-inactive {
        color: $third-dark;
      }
      .icon-active {
        color: $second-red;
      }
    }
  }
</style>
