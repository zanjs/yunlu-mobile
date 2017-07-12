<template>
  <section>
    <div
      v-for="(item, index) in store"
      :key="index"
      class="item">
      <div class="title">

      </div>
      <div
        v-for="(i, index) in item.purchase_items"
        :key="index"
        class="sub-item">
        <div
          class="check-box">
          <i class="iconfont icon-xuanzhong"></i>
        </div>
        <div
          class="">

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

  }
}
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

</style>
