<template>
  <section>
    <div class="list-container white-bg">
      <div
        v-for="(item, index) in store"
        :key="index"
        @click="handleClick(item.organization.id)"
        class="flex-between item primary-text">
        <img v-lazy="{
              src: item.organization.logo,
              error: 'http://oatl31bw3.bkt.clouddn.com/imgLoadingError.png',
              loading: 'http://oatl31bw3.bkt.clouddn.com/imgLoading3.jpg'
            }">
        <div class="flex-between content flex-1 ellipsis">
          <p class="font-15 ellipsis">{{item.organization.name}}</p>
          <div class="font-13">
            <span class="flex-1 third-text">{{item.organization.service_name || item.organization.service.name}}</span>
            <span class="flex-1 second">{{item.organization.zone_name || item.organization.display_zone}}</span>
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

  .list-container {
    border-top: 1px solid $third-grey;
    @include pm2rem(margin, 10px, 0px, 0px, 0px);
    @include px2rem(min-height, 600px);
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
