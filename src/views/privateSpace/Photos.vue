<template>
  <section>
    <mt-header title="武当山三日游"
               fixed
               class="header">
      <router-link to="/folders" slot="left">
        <mt-button>
          <i class="iconfont icon-fanhui"/>
        </mt-button>
      </router-link>
      <router-link to="/" slot="right">
        <mt-button>
          <i class="iconfont icon-zhuye"/>
        </mt-button>
      </router-link>
    </mt-header>
    <div class="photos-container">
      <gallery :data-source="albumList"/>
    </div>
  </section>
</template>

<script>
  import Gallery from '../../components/common/Gallery'
  export default {
    data () {
      return {
        albumList: [{
          id: 1,
          title: '武当三日游',
          cover: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
          count: 3
        }, {
          id: 2,
          title: '踏青旅游',
          cover: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
          count: 12
        }, {
          id: 3,
          title: '巴黎三日游',
          cover: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
          count: 19
        }, {
          id: 4,
          title: '瑞士三日游',
          cover: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
          count: 36
        }, {
          id: 5,
          title: '武当三日游',
          cover: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
          count: 3
        }, {
          id: 6,
          title: '踏青旅游',
          cover: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
          count: 12
        }, {
          id: 7,
          title: '巴黎三日游',
          cover: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
          count: 19
        }, {
          id: 8,
          title: '瑞士三日游',
          cover: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
          count: 36
        }]
      }
    },
    components: {
      Gallery
    },
    methods: {},
    mountd: {

    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .header {
    background-color: $green;
    @include px2rem(height, 88px);
    @include font-dpr(17px);
    position: fixed;
    h1 {
      @include font-dpr(17px);
    }
    .button-text {
      @include font-dpr(15px);
    }
    i {
      @include font-dpr(20px);
    }
  }
  .photos-container {
    height: 100%;
  }
</style>
