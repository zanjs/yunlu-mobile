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
                 class="button-text">
      </mt-button>
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
