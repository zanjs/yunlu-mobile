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
  </section>
</template>

<script>
  import Card from '../../components/common/card'
  export default {
    data () {
      return {}
    },
    components: {
      Card
    },
    methods: {

    }
  }
</script>

<style lang="scss">
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
</style>
