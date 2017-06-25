<template>
  <section>
    <mt-header title="武当山三日游"
               fixed
               class="header">
      <router-link to="/" slot="left">
        <mt-button>
          <i class="iconfont icon-zhuye"></i>
        </mt-button>
      </router-link>
      <mt-button slot="right"
                 @click="goReport()"
                 class="button-text">
        <i class="iconfont icon-jubao"></i>
        投诉
      </mt-button>
    </mt-header>
    <div class="card-container">
      <card
        :store="userCard"
        @click="cardClick" ></card>
    </div>
    <div class="rope">
      <img src="../../assets/shengzi@2x.png"
           class="left">
      <img src="../../assets/shengzi@2x.png"
           class="right">
    </div>
    <div class="carte-container">
      <a
        v-for="(item, index) in clusters"
        :key="index"
        class="item">
        <span>{{item.name}}</span>
        <i class="iconfont icon-fanhui"></i>
      </a>
    </div>
  </section>
</template>

<script>
  import Card from '../../components/common/Card'
  import { Indicator } from 'mint-ui'
  import { getStore } from '../../config/mUtils'
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        user_id: this.$route.params.id,
        token: getStore('user').authentication_token || 'fbdec44fa55088fd863ce47c778b1ddc'
      }
    },
    components: {
      Card
    },
    methods: {
      goReport () {
        this.$router.push({name: 'Report'})
      },
      getPersonDetail () {
        Indicator.open()
        this.$store.dispatch('commonAction', {
          url: '/business_cards',
          method: 'get',
          params: {
            token: this.token,
            user_id: this.user_id
          },
          target: this,
          resolve: (state, res) => {
            Indicator.close()
            state.userCard = res.data.cards
            state.clusters = res.data.clusters
          },
          reject: () => {
            Indicator.close()
          }
        })
      },
      cardClick (obj) {
        console.log(obj)
      }
    },
    mounted () {
      this.getPersonDetail()
    },
    computed: {
      ...mapGetters([
        'userCard',
        'clusters'
      ])
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
    z-index: 1002 !important;
    position: fixed;
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
  .rope {
    position: absolute;
    @include pm2rem(padding, 0px, 50px, 0px, 60px);
    left: 0;
    right: 0;
    @include px2rem(top, 396px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    img {
      @include px2rem(width, 30px);
    }
  }
  .carte-container {
    background-color: $white;
    @include pm2rem(padding, 0px, 22px, 0px, 22px);
    @include pm2rem(margin, 20px, 0px, 30px, 0px);
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #D1D1D1;
      border-left: 1px solid #D1D1D1;
      border-right: 1px solid #D1D1D1;
      box-sizing: border-box;
      @include px2rem(height, 94px);
      @include pm2rem(padding, 0px, 40px, 0px, 40px);
      i {
        color: #52CAA7;
        @include font-dpr(17px);
        border: none;
        transform: rotate(180deg);
      }
      span {
        border: none;
        @include font-dpr(17px);
        color: #595959;
      }
    }
    a {
      text-decoration: none;
    }
    a:active {
      background-color: #F2F2F2;
    }
    & :last-child{
      border-bottom: 1px solid #D1D1D1;
    }
  }
</style>
