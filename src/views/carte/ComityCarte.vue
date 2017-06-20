<template>
  <section>
    <mt-header title="武当山三日游"
               fixed
               class="header">
      <router-link to="/" slot="left">
        <mt-button>
          <i class="iconfont icon-zhuye"/>
        </mt-button>
      </router-link>
      <mt-button slot="right"
                 class="button-text">
        <i class="iconfont icon-jubao"/>
        投诉
      </mt-button>
    </mt-header>
    <div class="card-container">
      <enterprise-card @click="goEnterpriseDetail"/>
    </div>
    <div class="nav-tabs">
      <div class="tab-bar">
        <div class="left"
             v-bind:class="{'active': activeIndex === 0}"
             @click.prevent="tabClick(0)">产品</div>
        <div class="middle"
             v-bind:class="{'active': activeIndex === 1}"
             @click.prevent="tabClick(1)">资讯</div>
        <div class="middle"
             v-bind:class="{'active': activeIndex === 2}"
             @click.prevent="tabClick(2)">企业会员</div>
        <div class="right"
             v-bind:class="{'active': activeIndex === 3}"
             @click.prevent="tabClick(3)">个人会员</div>
      </div>
      <div class="tab-container">
        <product-list :show-bar="showBarProduct"
                      :css-animation="activeIndex === 0 && cssAnimationProduct"
                      :show="activeIndex === 0"
                      @click="goProductDetail"/>
        <information-list :show-bar="showBar"
                          :css-animation="activeIndex === 1 && cssAnimation"
                          :show="activeIndex === 1"
                          @click="viewBigImg"/>
        <enterprise-list :data-source="enterpriseList"
                         :show="activeIndex === 2"
                         :css-animation="activeIndex === 2 && cssAnimation"/>
      </div>
    </div>
  </section>
</template>

<script>
  import EnterpriseCard from '../../components/common/EnterpriseCard'
  import ProductList from '../../components/common/ProductList'
  import InformationList from '../../components/common/InformationList'
  import EnterpriseList from '../../components/common/EnterpriseList'
  import { showBack } from '../../config/mUtils'
  import ViewBigImg from '../../components/common/ViewBigImg'
  export default {
    data () {
      return {
        activeIndex: 0,
        showProduct: true,
        showBarProduct: false,
        cssAnimationProduct: false,
        cssAnimation: false,
        cssAnimationViewer: false,
        showBar: false,
        currentIndex: 0,
        showFullScreenPreview: false,
        infoImg: [],
        infoImgList: [
          {
            id: 1,
            name: '黄龙云平板',
            money: '1800',
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 2,
            name: '黄龙云平板',
            money: '1799',
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 2,
            name: '黄龙云平板',
            money: '1500',
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 2,
            name: '黄龙云平板',
            money: '定制',
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 2,
            name: '黄龙云平板',
            money: '2800',
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 1,
            name: '黄龙云平板',
            money: '1800',
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 2,
            name: '黄龙云平板',
            money: '1799',
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 2,
            name: '黄龙云平板',
            money: '1500',
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 2,
            name: '黄龙云平板',
            money: '定制',
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }, {
            id: 2,
            name: '黄龙云平板',
            money: '2800',
            url: 'http://7xjfsp.com2.z0.glb.qiniucdn.com/FqmSonXMMF6fG5qvru6sAp2Y7ICF-banner'
          }
        ],
        enterpriseList: [
          {
            id: 1,
            name: '武汉云庐数据有限公司',
            url: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
            type: '其他',
            province: '湖北',
            city: '武汉'
          }, {
            id: 2,
            name: '武汉云庐数据有限公司',
            url: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
            type: '其他',
            province: '湖北',
            city: '武汉'
          }, {
            id: 3,
            name: '武汉云庐数据有限公司',
            url: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
            type: '其他',
            province: '湖北',
            city: '武汉'
          }, {
            id: 4,
            name: '武汉云庐数据有限公司',
            url: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
            type: '其他',
            province: '湖北',
            city: '武汉'
          }, {
            id: 5,
            name: '武汉云庐数据有限公司',
            url: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
            type: '其他',
            province: '湖北',
            city: '武汉'
          }, {
            id: 6,
            name: '武汉云庐数据有限公司',
            url: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
            type: '其他',
            province: '湖北',
            city: '武汉'
          }, {
            id: 7,
            name: '武汉云庐数据有限公司',
            url: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
            type: '其他',
            province: '湖北',
            city: '武汉'
          }, {
            id: 8,
            name: '武汉云庐数据有限公司',
            url: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
            type: '其他',
            province: '湖北',
            city: '武汉'
          }, {
            id: 9,
            name: '武汉云庐数据有限公司',
            url: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
            type: '其他',
            province: '湖北',
            city: '武汉'
          }, {
            id: 10,
            name: '武汉云庐数据有限公司',
            url: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
            type: '其他',
            province: '湖北',
            city: '武汉'
          }, {
            id: 11,
            name: '武汉云庐数据有限公司',
            url: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
            type: '其他',
            province: '湖北',
            city: '武汉'
          }, {
            id: 12,
            name: '武汉云庐数据有限公司',
            url: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
            type: '其他',
            province: '湖北',
            city: '武汉'
          }, {
            id: 13,
            name: '武汉云庐数据有限公司',
            url: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
            type: '其他',
            province: '湖北',
            city: '武汉'
          }
        ]
      }
    },
    components: {
      EnterpriseCard,
      ProductList,
      InformationList,
      EnterpriseList,
      ViewBigImg
    },
    methods: {
      goReport () {
        document.body.scrollTop = 0
        this.$router.push({path: '/report'})
      },
      tabClick (val) {
        this.activeIndex = val
        this.showSearchBar()
      },
      showSearchBar () {
        // 开始监听scrollTop的值，达到一定程度后显示返回顶部搜索栏
        let height = parseFloat(document.documentElement.style.fontSize.replace('px', '')) * 153 / 36
        let elementId = 'productList'
        if (this.activeIndex !== 0) {
          height = parseFloat(document.documentElement.style.fontSize.replace('px', '')) * 190 / 36
        }
        switch (this.activeIndex) {
          case 1:
            elementId = 'informationList'
            break
          case 2:
            elementId = 'enterpriseList'
            break
          case 3:
            elementId = 'personList'
            break
          default:
            elementId = 'productList'
            break
        }
        showBack((id, status) => {
          if (id === 'productList') {
            this.cssAnimationProduct = status
            if (!status) {
              setTimeout(() => {
                this.showBarProduct = status
              }, 510)
            } else {
              this.showBar = status
            }
          } else {
            this.cssAnimation = status
            if (!status) {
              setTimeout(() => {
                this.showBar = status
              }, 510)
            } else {
              this.showBar = status
            }
          }
        }, elementId, height)
      },
      goProductDetail (id) {
        this.$router.push({path: '/productdetail'})
      },
      goEnterpriseDetail (id) {
        console.log(id)
        this.$router.push({path: '/enterprisedetail'})
      },
      viewBigImg (index) {
        console.log(index)
        this.infoImg.push(index)
        this.showFullScreenPreview = true
      },
      closeImgViewer () {
        this.cssAnimationViewer = true
        setTimeout(() => {
          this.infoImg = []
          this.showFullScreenPreview = false
          this.cssAnimationViewer = false
        }, 500)
      },
      stopTouchMove () {
        let self = this
        document.getElementById('app').addEventListener('touchmove', (e) => { // 监听滚动事件
          if (self.showFullScreenPreview) {
            e.preventDefault() // 最关键的一句，禁止浏览器默认行为
          }
        })
      }
    },
    mounted () {
      this.showSearchBar()
      this.stopTouchMove()
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
    position: fixed;
    z-index: 1002 !important;
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
    @include pm2rem(padding, 8px, 22px, 0px, 22px);
    @include px2rem(margin-top, 88px);
  }
  .nav-tabs {
    @include pm2rem(margin, 20px, 0px, 10px, 0px);
    background-color: $white;
    color: #52CAA7;
    .tab-bar {
      @include px2rem(height, 84px);
      @include pm2rem(padding, 0px, 22px, 0px, 22px);
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      div {
        height: 100%;
        flex: 1;
        box-sizing: border-box;
        @include px2rem(line-height, 84px);
        text-align: center;
        @include font-dpr(17px);
        color: #52CAA7;
        border: 1px solid #52CAA7;
      }
      .left {
        @include px2rem(border-top-left-radius, 14px);
        @include px2rem(border-bottom-left-radius, 14px);
        color: #52CAA7;
      }
      .middle {
        border-left: none;
      }
      .active {
        background-color: #52CAA7;
        color: $white;
      }
      .right {
        @include px2rem(border-top-right-radius, 14px);
        @include px2rem(border-bottom-right-radius, 14px);
      }
    }
  }
</style>
