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
    <div class="photos-container">
      <gallery :data-source="photos"></gallery>
    </div>
  </section>
</template>

<script>
  import Gallery from '../../components/common/Gallery'
  import { getStore } from '../../config/mUtils'
  export default {
    data () {
      return {
        headerName: this.$route.query.name,
        id: this.$route.query.id,
        pageIndex: 1,
        pageSize: 24,
        token: getStore('user') ? getStore('user').authentication_token : '',
        photos: []
      }
    },
    components: {
      Gallery
    },
    methods: {
      getPhotos () {
        this.$store.dispatch('commonAction', {
          url: `/galleries/${this.id}/photos`,
          method: 'get',
          params: {
            token: this.token,
            page: this.pageIndex,
            per_page: this.pageSize
          },
          target: this,
          resolve: (state, res) => {
            this.photos = res.data.photos
          },
          reject: () => {
          }
        })
      },
      goBack () {
        if (getStore('showGoHome')) {
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      }
    },
    mounted () {
      this.getPhotos()
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .header {
    background-color: $green;
    @include px2rem(height, 88px);
    @include font-dpr(17px);
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
  .photos-container {
    height: 100%;
  }
</style>
