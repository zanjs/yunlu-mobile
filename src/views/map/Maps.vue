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
    <div
    class="map-container"
    id="aMapContainer"
    tabindex="0">
    </div>
  </section>
</template>

<script>
  import { getStore, removeStore } from '../../config/mUtils'
  export default {
    data () {
      return {
        headerName: this.$route.query.title,
        latitude: this.$route.query.lat,
        longitude: this.$route.query.lng
      }
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
      initAmap () {
        let map = new window.AMap.Map('aMapContainer', {
          resizeEnable: true,
          zoom: 10,
          center: [this.longitude, this.latitude]
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
        // console.log(map)
      }
    },
    mounted () {
      this.initAmap()
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
  .map-container {
    width: 100%;
    position: absolute;
    @include px2rem(top, 88px);
    bottom: 0;
  }
</style>
