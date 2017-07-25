<template>
  <section>
    <common-header
      :title="headerName"
      @back="goBack()">
    </common-header>
    <div
      class="map-container"
      id="aMapContainer"
      tabindex="0">
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
        address: this.$route.query.address || ''
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
      initAmap (lng = this.longitude, lat = this.latitude) {
        let map = new window.AMap.Map('aMapContainer', {
          resizeEnable: true,
          zoom: 10,
          center: [lng, lat]
        })
        window.AMapUI.loadUI(['overlay/SimpleMarker'], SimpleMarker => {
          // 创建SimpleMarker实例
          new SimpleMarker({
            // 前景文字
            iconLabel: '',
            // 背景图标样式
            iconStyle: 'red',
            // ...其他Marker选项...，不包括content
            map: map,
            position: map.getCenter()
          })
        })
      },
      geocoder (address) {
        window.AMap.service('AMap.Geocoder', () => { // 回调函数
          // 实例化Geocoder
          let geocoder = new window.AMap.Geocoder()
          // TODO: 使用geocoder 对象完成相关功能
          geocoder.getLocation(address, (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              this.latitude = result.geocodes[0].location.lat
              this.longitude = result.geocodes[0].location.lng
              this.initAmap()
              //比如在获得的经纬度上打上一个Marker
            }else{
              Toast({
                message: '定位失败',
                duration: 1000
              })
              //获取经纬度失败
              this.initAmap(116.30621, 39.976121)
            }
          })
        })
      },
      showGeocoder () {
        if (this.address && (!this.longitude || !this.latitude)) {
          this.geocoder(this.address)
        } else {
          this.initAmap()
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

  .map-container {
    width: 100%;
    max-width: 540px;
    position: absolute;
    @include px2rem(top, 88px);
    bottom: 0;
  }
</style>
