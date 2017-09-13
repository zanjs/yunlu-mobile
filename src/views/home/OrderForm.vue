<template>
  <section>
    <common-header
      :title="header"
      :icon-class="iconClass"
      @right-click="goBack()"
      @back="goBack()">
    </common-header>
    <section>
      <mt-navbar
        v-model="selected"
        class="nav-bars">
        <mt-tab-item id="1">全部</mt-tab-item>
        <mt-tab-item id="2">待付款</mt-tab-item>
        <mt-tab-item id="3">待发货</mt-tab-item>
        <mt-tab-item id="4">待收货</mt-tab-item>
        <mt-tab-item id="5">待评价</mt-tab-item>
      </mt-navbar>
      <mt-tab-container
        v-model="selected"
        class="nav-bar-container">
        <mt-tab-container-item
          id="1">
        </mt-tab-container-item>
      </mt-tab-container>
    </section>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import { getStore, removeStore } from '../../config/mUtils'
  export default {
    data () {
      return {
        header: '我的订单',
        iconClass: 'icon-fenlei',
        selected: '1'
      }
    },
    components: {
      CommonHeader
    },
    methods: {
      goBack () {
        if (getStore('OrderForm_goHome')) {
          removeStore('OrderForm_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .nav-bars {
    @include px2rem(padding-top, 88px);
    @include px2rem(height, 80px);
    .mint-tab-item {
      @include font-dpr-important(17px);
      border-bottom: 1px solid $fifth-grey !important;
      display: block;
      padding: 0 !important;
      @include px2remimportant(line-height, 80px);
      div {
        @include font-dpr-important(17px);
      }
    }
    .is-selected {
      color: $red !important;
      margin-bottom: 0 !important;
      @include px2remimportant(border-bottom-width, 10px);
      border-bottom-color: $red !important;
      text-decoration: none !important;
      .mint-tab-item {
        color: $red !important;
      }
    }
  }
</style>

<style lang="scss">
  @import "../../styles/mixin";

  .nav-bars {
    .mint-tab-item-label {
      @include font-dpr-important(15px);
      font-weight: 500;
      color: $red;
      line-height: inherit !important;
    }
    .is-selected {
      .mint-tab-item-label {
        color: $red !important;
      }
    }
  }
</style>

