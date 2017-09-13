<template>
  <section>
    <common-header
      :title="header"
      @back="goBack()">
    </common-header>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import { getStore, removeStore } from '../../config/mUtils'
  export default {
    data () {
      return {
        header: '订单详情'
      }
    },
    components: {
      CommonHeader
    },
    methods: {
      goBack () {
        if (getStore('OrderDetail_goHome')) {
          removeStore('OrderDetail_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";
</style>
