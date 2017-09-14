<template>
  <section>
    <common-header
      :title='header'
      :icon-class='iconClass'
      @right-click='goBack()'
      @back='goBack()'>
    </common-header>
    <section>
      <mt-navbar
        v-model="selected"
        class="nav-bars full-width">
        <mt-tab-item id='1'>全部</mt-tab-item>
        <mt-tab-item id='2'>待付款</mt-tab-item>
        <mt-tab-item id='3'>待发货</mt-tab-item>
        <mt-tab-item id='4'>待收货</mt-tab-item>
        <mt-tab-item id='5'>待评价</mt-tab-item>
      </mt-navbar>
      <mt-tab-container
        v-model='selected'
        class='nav-bar-container'>
        <mt-tab-container-item id='1'>
          <template v-if="allForms.length > 0">
            <order-form-list
              :store="allForms"
              :selectable="false"
              @go-enterprise="goEnterprise"
              @go-detail="goDetail">
            </order-form-list>
          </template>
          <div
            v-else
            key="1"
            class="no-form">
            <img src="../../assets/emptyOrder.png">
            <p>您还没有相关订单哦~</p>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id='2'>
          <template v-if="submittedForms.length > 0">
            <order-form-list
              :store="submittedForms"
              :selectable="true"
              @go-enterprise="goEnterprise"
              @go-detail="goDetail">
            </order-form-list>
          </template>
          <div
            v-else
            key="2"
            class="no-form">
            <img src="../../assets/emptyOrder.png">
            <p>您还没有相关订单哦~</p>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id='3'>
          <template v-if="paidForms.length > 0">
            <order-form-list
              :store="paidForms"
              :selectable="false"
              @go-enterprise="goEnterprise"
              @go-detail="goDetail">
            </order-form-list>
          </template>
          <div
            v-else
            key="3"
            class="no-form">
            <img src="../../assets/emptyOrder.png">
            <p>您还没有相关订单哦~</p>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id='4'>
          <template v-if="deliveredForms.length > 0">
            <order-form-list
              :store="deliveredForms"
              :selectable="false"
              @go-enterprise="goEnterprise"
              @go-detail="goDetail">
            </order-form-list>
          </template>
          <div
            v-else
            key="4"
            class="no-form">
            <img src="../../assets/emptyOrder.png">
            <p>您还没有相关订单哦~</p>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id='5'>
          <template v-if="receiptedForms.length > 0">
            <order-form-list
              :store="receiptedForms"
              :selectable="false"
              @go-enterprise="goEnterprise"
              @go-detail="goDetail">
            </order-form-list>
          </template>
          <div
            v-else
            key="5"
            class="no-form">
            <img src="../../assets/emptyOrder.png">
            <p>您还没有相关订单哦~</p>
          </div>
        </mt-tab-container-item>
      </mt-tab-container>
    </section>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import OrderFormList from '../../components/orderForm/OrderFormList'
  import { getStore, setStore, removeStore } from '../../config/mUtils'
  export default {
    data () {
      return {
        header: '我的订单',
        iconClass: 'icon-fenlei',
        token: getStore('user') ? getStore('user').authentication_token : '',
        selected: '1',
        allPageIndex: 1,
        allPageSize: 20,
        allForms: [],
        submittedPageIndex: 1,
        submittedPageSize: 20,
        submittedForms: [], // 待付款
        paidPageIndex: 1,
        paidPageSize: 20,
        paidForms: [], // 待发货
        deliveredPageIndex: 1,
        deliveredPageSize: 20,
        deliveredForms: [], // 待收货
        receiptedPageIndex: 1,
        receiptedPageSize: 20,
        receiptedForms: [] // 待评价
      }
    },
    components: {
      CommonHeader,
      OrderFormList
    },
    methods: {
      goBack () {
        if (getStore('OrderForm_goHome')) {
          removeStore('OrderForm_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      // 处理五种不同状态订单的参数
      handleStateParams (index) {
        switch (index) {
          case 0:
            return {}
          case 1:
            return {state: ['submitted']}
          case 2:
            return {state: ['paid', 'reminded']}
          case 3:
            return {state: ['delivered']}
          case 4:
            return {
              state: ['receipted', 'finished'],
              item_state: ['mounted', 'accepted', 'rejected']
            }
        }
      },
      // 处理返回的订单
      handleOrderForms (index, orderForms) {
        if (index === 0) {
          this.allForms = orderForms
          this.getOrderForms(1, this.submittedPageIndex, this.submittedPageSize)
        } else if (index === 1) {
          this.submittedForms = orderForms
          this.getOrderForms(2, this.paidPageIndex, this.paidPageSize)
        } else if (index === 2) {
          this.paidForms = orderForms
          this.getOrderForms(3, this.deliveredPageIndex, this.deliveredPageSize)
        } else if (index === 3) {
          this.deliveredForms = orderForms
          this.getOrderForms(4, this.receiptedPageIndex, this.receiptedPageSize)
        } else if (index === 4) {
          this.receiptedForms = orderForms
        } else {
          console.error('获取订单信息失败')
        }
      },
      getOrderForms (index, pageIndex, pageSize) {
        this.$store.dispatch('commonAction', {
          url: '/order_forms',
          method: 'get',
          params: {
            token: this.token,
            page: pageIndex,
            per_page: pageSize,
            ...(this.handleStateParams(index))
          },
          data: {},
          target: this,
          resolve: (state, res) => {
            this.handleOrderForms(index, res.data.order_forms)
          },
          reject: () => {
          }
        })
      },
      goEnterprise (id) {
        this.$router.push({path: `/enterprises/${id}`})
      },
      goDetail (item) {
        setStore('orderDetailParams', item)
        this.$router.push({path: `/orderdetail/${item.code}?type=${item.state}`})
      }
    },
    mounted () {
      this.getOrderForms(0, this.allPageIndex, this.allPageSize)
    }
  }
</script>

<style lang='scss' scoped>
  @import '../../styles/mixin';

  .nav-bars {
    position: fixed;
    @include px2rem(top, 88px);
    @include px2rem(height, 90px);
    width: 100%;
    z-index: 1;
    .mint-tab-item {
      @include font-dpr-important(15px);
      border-bottom: 1px solid $tenth-grey !important;
      display: block;
      padding: 0 !important;
      @include px2remimportant(line-height, 90px);
      div {
        @include font-dpr-important(15px);
      }
    }
    .is-selected {
      color: #FF5001 !important;
      margin-bottom: 0 !important;
      @include px2remimportant(border-bottom-width, 4px);
      border-bottom-color: #FF5001 !important;
      text-decoration: none !important;
      .mint-tab-item {
        color: #FF5001 !important;
      }
    }
  }
  .nav-bar-container {
    @include px2rem(padding-top, 178px);
    .no-form {
      img {
        @include px2rem(width, 319px);
        @include px2rem(height, 319px);
        @include pm2rem(margin, 122px, 0px, 46px, 0px);
      }
      text-align: center;
      p {
        @include font-dpr(15px);
        color: $second-dark;
      }
    }
  }
</style>

<style lang='scss'>
  @import '../../styles/mixin';

  .nav-bars {
    .mint-tab-item-label {
      @include font-dpr-important(15px);
      color: $second-dark;
      line-height: inherit !important;
    }
    .is-selected {
      .mint-tab-item-label {
        color: #FF5001 !important;
      }
    }
  }
</style>

