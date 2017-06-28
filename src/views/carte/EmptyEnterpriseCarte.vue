<template>
  <section>
    <mt-header
      title="名片"
      fixed
      class="header">
      <mt-button
        slot="left"
        @click="goBack()"
        class="button-text">
        <i class="iconfont icon-fanhui"></i>
      </mt-button>
    </mt-header>
    <div class="card-container">
      <enterprise-card
        :store="teams"
        @click="goEnterpriseDetail">
      </enterprise-card>
    </div>
    <div class="tips-container">
      <p>{{tips}}</p>
      <div class="btn">
        <a @click="claim()">确认主权</a>
      </div>
    </div>
  </section>
</template>

<script>
  import EnterpriseCard from '../../components/common/EnterpriseCard'
  import { getStore } from '../../config/mUtils'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        teams: {
          id: null,
          name: getStore('emptyenterpriseCarteParams') ? getStore('emptyenterpriseCarteParams').name : this.$route.params.name
        },
        tips: '冒领者将被封停账户、冻结资产、追索损失、追究法律责任。'
      }
    },
    components: {
      EnterpriseCard
    },
    methods: {
      goEnterpriseDetail () {
        // 未确权，不能点击
      },
      goBack () {
        if (this.$route.params && this.$route.params.backUrl) {
          this.$router.push({name: this.$route.params.backUrl})
        } else {
          this.$router.push({name: 'Home'})
        }
      },
      claim () {
        Toast('暂未开放')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .header {
    background-color: $green;
    @include px2rem(height, 88px);
    @include pm2rem(padding, 0px, 30px, 0px, 30px);
    @include font-dpr(17px);
    position: fixed;
    z-index: 1002 !important;
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
    @include pm2rem(padding, 96px, 22px, 0px, 22px);
  }
  .tips-container {
    background-color: $white;
    @include pm2rem(margin, 20px, 22px, 0px, 22px);
    @include pm2rem(padding, 80px, 30px, 200px, 30px);
    p {
      color: #E87171;
      @include font-dpr(15px);
    }
    .btn {
      text-align: center;
      margin: 0 auto;
      @include px2rem(margin-top, 200px);
      a {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
        @include px2rem(width, 400px);
        @include px2rem(height, 70px);
        @include font-dpr(14px);
        color: $white;
        background-color: #52CAA7;
        @include px2rem(border-radius, 10px);
        line-height: 1;
      }
      a:active {
        background-color: rgba(82, 202, 167, .5);
      }
    }
  }
</style>
