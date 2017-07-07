<template>
  <section class="container">
    <mt-button type="primary"
               size="large"
               class="btn-block"
               @click="goRoute('Folders')">
               私人空间
    </mt-button>
    <mt-button type="primary"
               size="large"
               class="btn-block"
               @click="goRoute('Space')">
               私人空间文件夹
    </mt-button>
    <mt-button type="primary"
               size="large"
               class="btn-block"
               @click="goRoute('PersonCarte')">
               个人名片
    </mt-button>
    <mt-button type="primary"
               size="large"
               class="btn-block"
               @click="goRoute('ComityCarte')">
               协会名片
    </mt-button>
    <mt-button type="primary"
               size="large"
               class="btn-block"
               @click="goRoute('EnterpriseCarte')">
               企业名片
    </mt-button>
    <mt-button type="primary"
               size="large"
               class="btn-block"
               @click="goRoute('Login')">
      登录注册
    </mt-button>
    <mt-button type="primary"
               size="large"
               class="btn-block"
               @click="goRoute('Download')">
      下载
    </mt-button>
    <mt-button type="primary"
               size="large"
               class="btn-block"
               @click="goRoute('See')">
      首页
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
      this.$router.push({name: str})
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
