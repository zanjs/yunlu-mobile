<template>
  <section>
    <mt-header
      :title="headerName"
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
      <card
        :store="userCard"
        @click="cardClick">
      </card>
    </div>
    <div v-if="Thumbnails && Thumbnails.length > 0"
         class="rope">
      <img src="../../assets/shengzi@2x.png"
           class="left">
      <img src="../../assets/shengzi@2x.png"
           class="right">
    </div>
    <div v-if="Thumbnails && Thumbnails.length > 0"
         class="album-comtainer">
      <folders-cover
        :data-source="Thumbnails"
        @click="albumClick">
      </folders-cover>
    </div>
  </section>
</template>

<script>
  import Card from '../../components/common/Card'
  import FoldersCover from '../../components/common/FoldersCover'
  import { mapGetters } from 'vuex'
  import { getStore, setStore, removeStore } from '../../config/mUtils'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        headerName: '私人空间',
        space_id: this.$route.params.space_id,
        user_id: this.$route.params.user_id,
        token: getStore('user') ? getStore('user').authentication_token : '',
        Thumbnails: []
      }
    },
    components: {
      Card,
      FoldersCover
    },
    methods: {
      albumClick (item) {
        this.$router.push({name: 'Photos', params: {id: item.id}, query: {name: item.name}})
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
            this.handleName(this.space_id, res.data.clusters)
          },
          reject: () => {
          }
        })
      },
      getSpace () {
        this.$store.dispatch('commonAction', {
          url: '/galleries',
          method: 'get',
          params: {
            token: this.token,
            user_id: this.user_id,
            cluster_id: this.space_id
          },
          target: this,
          resolve: (state, res) => {
            this.Thumbnails = res.data.gallery
          },
          reject: () => {
          }
        })
      },
      handleName (id, arr) {
        for (let i = 0; i < arr.length; i++) {
          if (id === arr[i].id) {
            this.headerName = arr[i].name
            return true
          }
        }
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
            window.location.href = `http://wpa.qq.com/msgrd?v=3&uin=${item.value}&site=qq&menu=yes`
            // this.linkToast('会员', 'QQ账号', item.value)
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
      goBack () {
        if (getStore('Spaces_goHome')) {
          removeStore('Spaces_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      showGoHome () {
        if (!this.token) {
          // 需要延时跳转，否则本页面不会进入路由历史记录
          setTimeout(() => {
            setStore('beforeLogin', 'true')
            this.$router.push({name: 'Login'})
          }, 300)
        } else {
          this.getPersonDetail()
          this.getSpace()
        }
      }
    },
    mounted () {
      this.showGoHome()
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
  .album-comtainer {
    @include pm2rem(padding, 24px, 22px, 0px, 22px);
  }
</style>
