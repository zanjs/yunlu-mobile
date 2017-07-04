<template>
  <section>
    <mt-header title="名片"
               fixed
               class="header">
      <mt-button slot="left"
                 @click="goBack()"
                 class="button-text">
        <i class="iconfont icon-fanhui"></i>
      </mt-button>
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
        @click="cardClick"></card>
    </div>
    <div v-if="clusters && clusters.length > 0"
         class="rope">
      <img src="../../assets/shengzi@2x.png"
           class="left">
      <img src="../../assets/shengzi@2x.png"
           class="right">
    </div>
    <div
      v-else
      class="no-carte">
      <img src="../../assets/noPersonCarte.png">
    </div>
    <div class="carte-container">
      <a
        v-for="(item, index) in clusters"
        :key="index"
        @click="goCarte(item)"
        class="item">
        <span>{{item.name}}</span>
        <i class="iconfont icon-fanhui"></i>
      </a>
    </div>
  </section>
</template>

<script>
  import Card from '../../components/common/Card'
  import { getStore, setStore, removeStore } from '../../config/mUtils'
  import { mapGetters } from 'vuex'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        user_id: this.$route.query.id,
        token: getStore('user') ? getStore('user').authentication_token : null
      }
    },
    components: {
      Card
    },
    methods: {
      goReport () {
        this.$router.push({name: 'Report', query: {resourceId: this.$store.state.userCard.id, resourceClass: 'user'}})
      },
      getPersonDetail () {
        this.$store.dispatch('commonAction', {
          url: '/business_cards',
          method: 'get',
          params: {
            token: this.token,
            user_id: this.user_id
          },
          target: this,
          resolve: (state, res) => {
            state.userCard = res.data.cards
            state.clusters = res.data.clusters
            setStore('userCard', res.data.cards)
          },
          reject: () => {
          }
        })
      },
      cardClick (item) {
        switch (item.type) {
          case 'email':
            this.linkToast('会员', '邮箱地址', item.value)
            break
          case 'wechat':
            this.linkToast('会员', '微信号', item.value)
            break
          case 'weibo':
            this.linkToast('会员', '微博账号', item.value)
            break
          case 'qq':
            // window.location.href = 'http://wpa.qq.com/msgrd?v=3&uin=1501718947&site=qq&menu=yes'
            this.linkToast('会员', 'QQ账号', item.value)
            break
          case 'address':
            Toast('暂未开放')
            break
        }
      },
      linkToast (str, key, value) {
        Toast({
          message: `该${str}${key}为：${value}`,
          duration: 5000
        })
      },
      goCarte (item) {
        if (!item.team_id) {
          this.$router.push({name: 'Folders', query: {id: item.id, name: item.name}})
        } else if (item.is_association) {
          this.$router.push({name: 'ComityCarte', query: {teamId: item.team_id}})
        } else {
          this.$router.push({name: 'EnterpriseCarte', query: {teamId: item.team_id}})
        }
      },
      goBack () {
        if (getStore('PersonCarte_goHome')) {
          removeStore('PersonCarte_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
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
  .no-carte {
    @include pm2rem(padding, 100px, 20px, 100px, 0px);
    @include pm2rem(margin, 20px, 22px, 0px, 22px);
    background-color: $white;
    text-align: center;
    border: 1px solid #D1D1D1;
    img {
      @include px2rem(width, 260px);
      height: auto;
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
