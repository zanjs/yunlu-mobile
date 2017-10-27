<template>
  <section>
    <mt-tabbar
      v-model="selected"
      class="tab-bar full-width">
      <mt-tab-item id="home">
        <div
          class="tab-item"
          @click="selectTab('See')">
          <i class="iconfont icon-yunshi"></i>
          <span>云视</span>
        </div>
      </mt-tab-item>
      <mt-tab-item id="wareroom">
        <div
          class="tab-item"
          @click="selectTab('Download')">
          <i class="iconfont icon-yunku"></i>
          <span>云库</span>
        </div>
      </mt-tab-item>
      <mt-tab-item id="people">
        <div
          class="tab-item"
          @click="selectTab('Download')">
          <i class="iconfont icon-renmai"></i>
          <span>人脉</span>
        </div>
      </mt-tab-item>
      <mt-tab-item id="space">
        <div
          class="tab-item"
          @click="selectTab('Download')">
          <i class="iconfont icon-kongjian"></i>
          <span>空间</span>
        </div>
      </mt-tab-item>
    </mt-tabbar>
    <transition
      name="fade"
      mode="out-in">
      <router-view></router-view>
    </transition>
  </section>
</template>

<script>
  import { Tabbar, TabItem, TabContainer, TabContainerItem } from 'mint-ui'
  export default {
    name: 'Home',
    data () {
      return {
        selected: 'home',
        active: 'home'
      }
    },
    methods: {
      selectTab (name) {
        this.$router.push({name: name})
      }
    },
    created () {
      this.$router.replace({name: 'See'})
    },
    components: {
      Tabbar,
      TabItem,
      TabContainer,
      TabContainerItem
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .tab-bar {
    position: fixed;
    bottom: 0;
    right: auto;
    left: auto;
    z-index: 1004 !important;
    .tab-item {
      @include px2rem(height, 97px);
      display: flex;
      justify-content: space-around;
      flex-direction: column;
      align-items: center;
      i {
        @include font-dpr(25px);
        @include pm2rem(padding, 7px, 0px, 7px, 0px);
      }
      span {
        @include font-dpr(12px);
        @include pm2rem(margin, 0px, 0px, 9px, 0px);
      }
    }
    .mint-tab-item {
      padding: 0 !important;
      color: $seventh-grey !important;
    }
    .is-selected {
      color: $green !important;
    }
  }
</style>

