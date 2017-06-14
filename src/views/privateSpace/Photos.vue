<template>
  <section>
    <mt-header title="武当山三日游"
               fixed
               class="header">
      <router-link to="/" slot="left">
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
    <div class="photos-comtainer">
    </div>
  </section>
</template>

<script>
  export default {
    data () {
      return {}
    },
    components: {
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
</style>
