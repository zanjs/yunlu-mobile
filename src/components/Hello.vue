<template>
  <section class="container">
    <mt-button type="primary"
               size="large"
               class="btn-block"
               @click="goRoute('/space')">
               私人空间
    </mt-button>
    <mt-button type="primary"
               size="large"
               class="btn-block"
               @click="goRoute('/folders')">
               私人空间文件夹
    </mt-button>
    <mt-button type="primary"
               size="large"
               class="btn-block"
               @click="goRoute('/productdetail')">
               商品详情
    </mt-button>
    <mt-button type="primary"
               size="large"
               class="btn-block"
               @click="goRoute('/personcarte')">
               个人名片
    </mt-button>
    <mt-button type="primary"
               size="large"
               class="btn-block"
               @click="goRoute('/comitycarte')">
               协会名片
    </mt-button>
    <mt-button type="primary"
               size="large"
               class="btn-block"
               @click="goRoute('/enterprisecarte')">
               企业名片
    </mt-button>
    <mt-button type="primary"
               size="large"
               class="btn-block"
               @click="goRoute('/login')">
      登录注册
    </mt-button>
    <mt-button type="primary"
               size="large"
               class="btn-block"
               @click="goRoute('/regist')">
      注册
    </mt-button>
  </section>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'hello',
  data () {
    return {}
  },
  methods: {
    goRoute (str) {
      this.$router.push({path: str})
    }
  },
  computed: {
    ...mapGetters([
      'pageLoading'
    ])
  }
}
</script>

<style lang="scss" scoped>
  @import '../styles/mixin';

  .container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    .btn-block {
      @include pm2rem(margin, 10px, 0px, 5px, 0px);
    }
  }
</style>
