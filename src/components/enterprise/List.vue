<template>
  <section>
    <div class="list-container white-bg">
      <a
        v-for="(item, index) in store"
        :key="index"
        @click="handleClick(item)"
        class="flex-between item primary-text">
        <img
          v-if="item.organization && item.organization.logo"
          v-lazy="{
            src: item.organization.logo,
            error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
            loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
          }">
        <img
          v-else
          src="../../assets/blank.jpg">
        <div class="flex-between content flex-1 ellipsis">
          <p class="font-15 ellipsis">{{item.name}}</p>
          <div class="font-13 third-text">
            <span
              v-if="item.organization && item.organization.service && item.organization.service.name"
              class="flex-1">{{item.organization.service.name}}</span>
            <span v-else>&nbsp;</span>
            <span
              v-if="item.organization && item.organization.provice_name && item.organization.city_name"
              class="flex-1">
              {{item.organization.provice_name}}{{item.organization.city_name}}
            </span>
            <span v-else>&nbsp;</span>
          </div>
        </div>
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

  .list-container {
    border-top: 1px solid $third-grey;
    box-sizing: border-box;
    a:active {
      background-color: rgba(239, 234, 234, .5);
    }
    .item {
      align-items: center;
      border-bottom: 1px solid $third-grey;
      @include pm2rem(padding, 10px, 20px, 10px, 20px);
      .content {
        line-height: 1;
        flex-direction: column;
        p {
          @include px2rem(margin-bottom, 22px);
        }
        div {
          display: inherit
        }
      }
    }
    img {
      @include px2rem(width, 118px);
      @include px2rem(height, 118px);
      @include px2rem(margin-right, 30px);
    }
    img[lazy=loading] {
      @include px2rem(width, 118px);
      @include px2rem(height, 118px);
      @include px2rem(margin-right, 30px);
      background-position: center center!important;
      background: url("../../assets/imgLoading3.jpg");
      background-repeat: no-repeat;
      background-size: cover;
    }
    img[lazy=error] {
      @include px2rem(width, 118px);
      @include px2rem(height, 118px);
      @include px2rem(margin-right, 30px);
      background-position: center center!important;
      background: url("../../assets/imgLoadingError.png");
      background-repeat: no-repeat;
      background-size: cover;
    }
    img[lazy=loaded] {
      @include px2rem(width, 118px);
      @include px2rem(height, 118px);
      @include px2rem(margin-right, 30px);
    }
  }
</style>
