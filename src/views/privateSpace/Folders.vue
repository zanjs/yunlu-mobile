<template>
  <section>
    <mt-header title="武当山三日游"
               fixed
               class="header">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
      <mt-button icon="more"
                 slot="right"
                 class="button-text">投诉</mt-button>
    </mt-header>
    <div class="card-container">
      <card/>
    </div>
    <div class="album-comtainer">
      <album/>
    </div>
  </section>
</template>

<script>
  import Card from '../../components/common/card'
  import Album from '../../components/common/album'
  export default {
    data () {
      return {}
    },
    components: {
      Card,
      Album
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
  }
  .card-container {
    @include pm2rem(padding, 8px, 22px, 0px, 22px);
    @include px2rem(margin-top, 88px);
  }
  .album-comtainer {
    @include pm2rem(padding, 26px, 22px, 0px, 22px);
  }
</style>
