<template>
  <section>
    <mt-header title="武当山三日游"
               fixed
               class="header">
      <router-link to="/" slot="left">
        <mt-button>
          <i class="iconfont icon-zhuye"/>
        </mt-button>
      </router-link>
      <mt-button slot="right"
                 class="button-text">
        <i class="iconfont icon-jubao"/>
        投诉
      </mt-button>
    </mt-header>
    <div class="card-container">
      <card/>
    </div>
    <div class="rope">
      <img src="../../assets/shengzi@2x.png"
           class="left"/>
      <img src="../../assets/shengzi@2x.png"
           class="right"/>
    </div>
    <div class="album-comtainer">
      <album :data-source="albumList"
             @click="albumClick"/>
    </div>
  </section>
</template>

<script>
  import Card from '../../components/common/card'
  import Album from '../../components/common/album'
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
      Card,
      Album
    },
    methods: {
      albumClick (id) {
        console.log(id)
        this.$router.push({path: '/photos'})
      }
    },
    mountd: {

    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .header {
    background-color: $green;
    @include px2rem(height, 88px);
    @include pm2rem(padding, 0px, 30px, 0px, 30px);
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
  .card-container {
    @include pm2rem(padding, 8px, 22px, 0px, 22px);
    @include px2rem(margin-top, 88px);
  }
  .rope {
    position: absolute;
    @include pm2rem(padding, 0px, 50px, 0px, 60px);
    left: 0;
    right: 0;
    @include px2rem(top, 396px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    img {
      @include px2rem(width, 30px);
    }
  }
  .album-comtainer {
    @include pm2rem(padding, 24px, 22px, 0px, 22px);
  }
</style>
