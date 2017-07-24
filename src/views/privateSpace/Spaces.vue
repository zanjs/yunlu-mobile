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
    <div v-if="thumbnails && thumbnails.length > 0"
         class="rope">
      <img src="../../assets/shengzi@2x.png"
           class="left">
      <img src="../../assets/shengzi@2x.png"
           class="right">
    </div>
    <div v-if="thumbnails && thumbnails.length > 0"
         class="album-comtainer">
      <folders-cover
        :data-source="thumbnails"
        @click="albumClick">
      </folders-cover>
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
  import FoldersCover from '../../components/common/FoldersCover'
  import { mapGetters } from 'vuex'
  import { getStore, removeStore } from '../../config/mUtils'
  import { Toast, MessageBox } from 'mint-ui'
  import PopDialog from '../../components/common/PopDialog'
  export default {
    data () {
      return {
        headerName: '私人空间',
        p: this.$route.query.p || '',
        cluster_id: this.$route.query.cluster_id || '',
        space_id: this.$route.params.space_id || '',
        user_id: this.$route.params.user_id || '',
        token: getStore('user') ? getStore('user').authentication_token : '',
        thumbnails: [],
        showDialog: false,
        message: null
      }
    },
    components: {
      Card,
      FoldersCover,
      PopDialog
    },
    methods: {
      beforeGetData () {
        if (this.p) {
          this.getData('/shares/zone', {
            p: this.p,
            ...(this.cluster_id ? {cluster_id: this.cluster_id} : {})
          })
        } else {
          this.shouldLogin()
        }
      },
      albumClick (item) {
        this.$router.push({path: `/photos/${item.id}`,
          query: {
            name: item.name,
            ...(this.p ? {p: this.p} : {})
          }
        })
      },
      getData (url, params) {
        this.$store.dispatch('commonAction', {
          url: url,
          method: 'get',
          params: params,
          target: this,
          resolve: (state, res) => {
            if (url === '/business_cards') {
              state.userCard = res.data.cards
              state.clusters = res.data.clusters
              this.handleName(this.space_id, res.data.clusters)
            } else {
              this.thumbnails = res.data.gallery
              if (url === '/shares/zone') {
                state.userCard = res.data.cards
              }
            }
          },
          reject: () => {
            this.$router.replace({name: 'ReportExpired'})
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
      showMessageBox (str) {
        MessageBox({
          title: '长按复制到剪切板',
          message: str
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
      closeDialog () {
        this.showDialog = false
      },
      goBack () {
        if (getStore('Spaces_goHome')) {
          removeStore('Spaces_goHome')
          this.$router.push({name: 'See'})
        } else if (getStore('Zone_goHome')) { // 当前页面有两种方式进入，路由名称不一样
          removeStore('Zone_goHome')
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
          this.getData('/business_cards', {token: this.token, user_id: this.user_id})
          this.getData('/galleries', {token: this.token, cluster_id: this.space_id, user_id: this.user_id})
        }
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
  .album-comtainer {
    @include pm2rem(padding, 24px, 22px, 0px, 22px);
  }
</style>
