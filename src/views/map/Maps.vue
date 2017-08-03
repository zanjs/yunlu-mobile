<template>
  <section>
    <common-header
      :title="headerName"
      @back="goBack()">
    </common-header>
    <div class="i-frame-container full-width">
      <iframe
        v-if="url"
        :src="url"></iframe>
    </div>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import { getStore, removeStore } from '../../config/mUtils'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        headerName: this.$route.query.title || '',
        latitude: this.$route.query.lat || '',
        longitude: this.$route.query.lng || '',
        address: this.$route.query.address || '',
        url: '',
        localLng: 116.30621,
        localLat: 39.976121
      }
    },
    components: {
      CommonHeader
    },
    methods: {
      goBack () {
        if (getStore('Map_goHome')) {
          removeStore('Map_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      geocoder (address) {
        window.AMap.service('AMap.Geocoder', () => { // 回调函数
          // 实例化Geocoder
          let geocoder = new window.AMap.Geocoder()
          // 使用geocoder 对象完成相关功能
          geocoder.getLocation(address, (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              this.latitude = result.geocodes[0].location.lat
              this.longitude = result.geocodes[0].location.lng
              this.url = `https://uri.amap.com/marker?position=${this.longitude},${this.latitude}&name=${this.headerName}&src=mypage&coordinate=gaode&callnative=0`
            }else{
              Toast({
                message: '定位失败',
                duration: 1000
              })
              this.url = `https://uri.amap.com/marker?position=${this.localLng},${this.localLat}&name=${this.headerName}&src=mypage&coordinate=gaode&callnative=0`
            }
          })
        })
      },
      showGeocoder () {
        if (this.address && (!this.longitude || !this.latitude)) {
          this.geocoder(this.address)
        } else {
          this.url = `https://uri.amap.com/marker?position=${this.longitude},${this.latitude}&name=${this.headerName}&src=mypage&coordinate=gaode&callnative=0`
        }
      }
    },
    mounted () {
      this.showGeocoder()
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../styles/mixin';

  .i-frame-container {
    position: fixed;
    @include px2rem(top, 88px);
    bottom: 0;
    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  }
</style>
