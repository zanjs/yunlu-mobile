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
        header: '确认订单'
      }
    },
    components: {
      CommonHeader
    },
    methods: {
      goBack () {
        if (getStore('OrderPaying_goHome')) {
          removeStore('OrderPaying_goHome')
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
