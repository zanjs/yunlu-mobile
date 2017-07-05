<template>
  <section>
    <mt-header :title="headerName"
               fixed
               class="header">
      <mt-button slot="left"
                 @click="goBack()"
                 class="button-text">
        <i class="iconfont icon-fanhui"></i>
      </mt-button>
    </mt-header>
    <div class="card-container">
      <card
        :store="userCard"
        @click="cardClick"></card>
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
      <album :data-source="Thumbnails"
             @click="albumClick"></album>
    </div>
  </section>
</template>

<script>
  import Card from '../../components/common/Card'
  import Album from '../../components/common/Album'
  import { getStore, removeStore } from '../../config/mUtils'
  export default {
    data () {
      return {
        headerName: this.$route.query.name || '空间',
        id: this.$route.query.id || null,
        token: getStore('user') ? getStore('user').authentication_token : '',
        userId: getStore('userCard') ? getStore('userCard').user_id : '',
        userCard: getStore('userCard') || null,
        Thumbnails: []
      }
    },
    components: {
      Card,
      Album
    },
    methods: {
      albumClick (item) {
        this.$router.push({name: 'Photos', query: {id: item.id, name: item.name}})
      },
      getSpace () {
        this.$store.dispatch('commonAction', {
          url: '/galleries',
          method: 'get',
          params: {
            token: this.token,
            user_id: this.userId,
            cluster_id: this.id
          },
          target: this,
          resolve: (state, res) => {
            this.Thumbnails = res.data.gallery
          },
          reject: () => {
          }
        })
      },
      cardClick (obj) {
        console.log(obj)
      },
      goBack () {
        if (getStore('Folders_goHome')) {
          removeStore('Folders_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      }
    },
    mounted () {
      this.getSpace()
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
