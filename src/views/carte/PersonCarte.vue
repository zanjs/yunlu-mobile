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
      <mt-button
        slot="right"
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
    <template v-if="showDialog">
      <pop-dialog
        :store="message"
        @close="closeDialog">
      </pop-dialog>
    </template>
  </section>
</template>

<script>
  import Card from '../../components/common/Card'
  import { getStore, setStore, removeStore } from '../../config/mUtils'
  import { mapGetters } from 'vuex'
  import { Toast, MessageBox } from 'mint-ui'
  import PopDialog from '../../components/common/PopDialog'
  export default {
    data () {
      return {
        user_id: this.$route.params.user_id || '',
        p: this.$route.query.p || '',
        token: getStore('user') ? getStore('user').authentication_token : null,
        showDialog: false,
        message: null
      }
    },
    components: {
      Card,
      PopDialog
    },
    methods: {
      beforeGetData () {
        if (this.p) {
          this.getPersonDetail('/shares/card', {p: this.p})
        } else {
          this.shouldLogin()
        }
      },
      goReport () {
        this.$router.push({name: 'Report', query: {resourceId: this.$store.state.userCard.id, resourceClass: 'user'}})
      },
      getPersonDetail (url, params) {
        this.$store.dispatch('commonAction', {
          url: url,
          method: 'get',
          params: params,
          target: this,
          resolve: (state, res) => {
            state.userCard = res.data.cards
            state.clusters = res.data.clusters
            setStore('userCard', res.data.cards)
          },
          reject: () => {
            this.$router.replace({name: 'ReportExpired'})
          }
        })
      },
      cardClick (item) {
        switch (item.type) {
          case 'email':
            this.showPopDialog(2, '邮箱地址', item.value)
            break
          case 'wechat':
            this.showPopDialog(1, '微信号', item.value)
            break
          case 'weibo':
            this.showMessageBox(item.value)
            break
          case 'qq':
            this.showPopDialog(0, 'QQ号', item.value)
            break
          case 'address':
            if (item.value.latitude && item.value.longitude) {
              this.$router.push({name: 'Maps', query: {lat: item.value.latitude, lng: item.value.longitude, title: this.$store.state.teams.company}})
            } else {
              this.$router.push({name: 'Maps', query: {lat: '', lng: '', title: this.$store.state.userCard.name, address: item.value}})
            }
            break
        }
      },
      linkToast (str, key, value) {
        Toast({
          message: `该${str}${key}为：${value}`,
          duration: 5000
        })
      },
      showPopDialog (type, name, value) {
        this.message = {
          type: type,
          name: name,
          value: value
        }
        this.showDialog = true
      },
      showMessageBox (str) {
        MessageBox({
          title: '长按复制到剪切板',
          message: str
        })
      },
      goCarte (item) {
        if (!item.team_id) {
          if (this.$route.query.p) {
            this.$router.push({path: '/zone', query: {p: this.$route.query.p, cluster_id: item.id}})
          } else {
            this.$router.push({path: `/users/${this.user_id}/spaces/${item.id}`})
          }
        } else if (item.is_association) {
          this.$router.push({name: 'ComityCarte', params: {id: item.team_id}})
        } else {
          this.$router.push({name: 'EnterpriseCarte', params: {id: item.team_id}})
        }
      },
      goBack () {
        if (getStore('PersonCarte_goHome')) {
          removeStore('PersonCarte_goHome')
          this.$router.push({name: 'See'})
        } else if (getStore('Card_goHome')) { // 当前页面有两种方式进入，路由名称不一样
          removeStore('Card_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      shouldLogin () {
        if (!this.token) {
          let toast = Toast({
            message: `您未登录，正在转入登录页`
          })
          setTimeout(() => {
            toast.close()
            this.$router.push({name: 'Login'})
          }, 2000)
        } else {
          this.getPersonDetail('/business_cards', {token: this.token, user_id: this.user_id})
        }
      },
      closeDialog () {
        this.showDialog = false
      }
    },
    mounted () {
      this.beforeGetData()
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
    @include pm2rem(padding, 0px, 22px, 30px, 22px);
    @include pm2rem(margin, 20px, 0px, 0px, 0px);
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
