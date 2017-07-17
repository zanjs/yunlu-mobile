<template>
  <sction>
    <div class="toast-container">
      <div class="icon-box">
        <i class="iconfont icon-caozuochenggong"></i>
      </div>
      <div>
        {{store.msg}}
      </div>
    </div>
  </sction>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  name: 'CustomToast',
  props: ['store'],
  methods: {

  }
}
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

  .toast-container {
    background-color: rgba(0, 0, 0, .45);
  }
</style>
