<template>
  <section>
    <div class="list-container">
      <div v-for="(item, index) in store"
           :key="index"
           @click="handleClick(item)"
           class="item">
        <img :src="item.organization.logo">
        <div class="content">
          <p>{{item.organization.name}}</p>
          <div>
            <span class="type">{{item.organization.service.name}}</span>
            <span class="address">{{item.organization.provice_name}}{{item.organization.city_name}}</span>
          </div>
        </div>
        <div class="arrow">
          <i class="iconfont icon-fanhui"></i>
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
      }
    },
    mounted () {

    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .search-container {
    background-color: $white;
    @include pm2rem(padding, 12px, 32px, 12px, 32px);
    box-shadow: 0px 6px 20px rgba(185, 179, 179, 0.5);
    position: fixed;
    @include px2rem(top, 88px);
    left: 0;
    right: 0;
    z-index: 1001;
    input {
      background-color: #EDEDED;
      width: 100%;
      @include px2rem(border-radius, 14px);
      color: #C2C2C2;
      @include font-dpr(14px);
      @include px2rem(line-height, 58px);
      @include px2rem(height, 58px);
      text-align: center;
      vertical-align: middle;
      border: none;
    }
    ::-webkit-input-placeholder{
      color: #C2C2C2;
    }
    i {
      position: absolute;
      @include px2rem(right, 60px);
      @include px2rem(height, 10px);
      @include px2rem(top, 16px);
    }
  }
  .list-container {
    background-color: $white;
    border-top: 1px solid #D1D1D1;
    box-sizing: border-box;
    @include pm2rem(margin, 10px, 0px, 0px, 0px);
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #595959;
      border-bottom: 1px solid #D1D1D1;
      @include pm2rem(padding, 10px, 20px, 10px, 20px);
      .content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        p {
          @include font-dpr(15px);
          line-height: 1;
          @include px2rem(margin-bottom, 22px);
        }
        div {
          line-height: 1;
          @include font-dpr(13px);
          color: #A6A6A6;
          display: flex
        }
        .type {
          flex: 1;
        }
        .address {
          flex: 1;
        }
      }
      .arrow {
        @include font-dpr(36px);
        color: #A6A6A6;
        display: flex;
        justify-content: center;
        align-items: center;
        @include px2rem(margin-right, 30px);
        i {
          transform: rotate(180deg);
        }
      }
    }
    img {
      @include px2rem(width, 118px);
      @include px2rem(height, 118px);
      @include px2rem(margin-right, 30px);
    }
  }
</style>
