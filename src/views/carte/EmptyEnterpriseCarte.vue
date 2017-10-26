<template>
  <section>
    <common-header
      :title="header"
      @back="goBack()">
    </common-header>
    <div class="card-container">
      <enterprise-card
        :store="teams"
        @click="goEnterpriseDetail">
      </enterprise-card>
    </div>
    <div class="tips-container white-bg">
      <p class="font-15">{{tips}}</p>
      <div class="btn">
        <a
          @click="claim()"
          class="flex white primary-bg font-14">确认主权</a>
      </div>
    </div>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import EnterpriseCard from '../../components/common/EnterpriseCard'
  import { getStore, removeStore } from '../../config/mUtils'
  export default {
    name: 'EmptyEnterpriseCarte',
    data () {
      return {
        header: '名片',
        teams: {
          id: null,
          company: this.$route.query.name
        },
        tips: '冒领者将被封停账户、冻结资产、追索损失、追究法律责任。'
      }
    },
    components: {
      CommonHeader,
      EnterpriseCard
    },
    methods: {
      goEnterpriseDetail () {
        // 未确权，不能点击
      },
      goBack () {
        if (getStore('EmpryEnterpriseCarte_goHome')) {
          removeStore('EmpryEnterpriseCarte_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      claim () {
        this.$router.push({name: 'Download'})
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .tips-container {
    @include pm2rem(margin, 20px, 22px, 0px, 22px);
    @include pm2rem(padding, 80px, 30px, 200px, 30px);
    p {
      color: #E87171;
    }
    .btn {
      text-align: center;
      margin: 0 auto;
      @include px2rem(margin-top, 200px);
      a {
        margin: 0 auto;
        @include px2rem(width, 400px);
        @include px2rem(height, 70px);
        @include px2rem(border-radius, 10px);
        line-height: 1;
      }
      a:active {
        background-color: rgba(82, 202, 167, .5);
      }
    }
  }
</style>
