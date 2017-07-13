<template>
  <section>
    <div class="list-container">
      <div v-for="(item, index) in store"
           :key="index"
           @click="handleClick(item.organization.id)"
           class="item">
        <img :src="item.organization.logo">
        <div class="content">
          <p>{{item.organization.name}}</p>
          <div>
            <span class="type">{{item.organization.service_name}}</span>
            <span class="address">{{item.organization.zone_name}}</span>
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
      handleClick (id) {
        this.$emit('click', id)
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
    border-top: 1px solid #E0E0E0;
    @include pm2rem(margin, 10px, 0px, 0px, 0px);
    @include px2rem(min-height, 600px);
    .item {
      display: flex;
      align-items: center;
      color: #595959;
      border-bottom: 1px solid #E0E0E0;
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
          display: flex
        }
        .type {
          flex: 1;
        }
        .address {
          color: #F75544;
          flex: 1;
          // @include px2rem(margin-left, 30px);
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
