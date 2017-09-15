<template>
  <section>
    <common-header
      :title='header'
      :icon-class='iconClass'
      @right-click='goBack()'
      @back='goBack()'>
    </common-header>
    <section>
      <div class="nav-bars full-width">
        <a
          class="tab"
          :class="{'selected': activeIndex === 1}"
          @click="selectTab(1)">
          <div class="label">全部</div>
        </a>
        <a
          class="tab"
          :class="{'selected': activeIndex === 2}"
          @click="selectTab(2)">
          <div class="label">待付款</div>
        </a>
        <a
          class="tab"
          :class="{'selected': activeIndex === 3}"
          @click="selectTab(3)">
          <div class="label">待发货</div>
        </a>
        <a
          class="tab"
          :class="{'selected': activeIndex === 4}"
          @click="selectTab(4)">
          <div class="label">待收货</div>
        </a>
        <a
          class="tab"
          :class="{'selected': activeIndex === 5}"
          @click="selectTab(5)">
          <div class="label">待评价</div>
        </a>
      </div>
      <div class='nav-bar-container'>
        <transition
          name="fade"
          :appear="true"
          mode="out-in">
          <template v-if="activeIndex === 1">
            <template v-if="allForms.length > 0">
              <order-form-list
                key="1"
                :store="allForms"
                :selectable="false"
                @go-enterprise="goEnterprise"
                @go-detail="goDetail"
                @action="action">
              </order-form-list>
            </template>
            <div
              v-else
              key="1"
              class="no-form">
              <img src="../../assets/emptyOrder.png">
              <p>您还没有相关订单哦~</p>
            </div>
          </template>
          <template v-if="activeIndex === 2">
            <template v-if="submittedForms.length > 0">
              <order-form-list
                key="2"
                :store="submittedForms"
                :selectable="true"
                @go-enterprise="goEnterprise"
                @go-detail="goDetail"
                @action="action">
              </order-form-list>
            </template>
            <div
              v-else
              key="2"
              class="no-form">
              <img src="../../assets/emptyOrder.png">
              <p>您还没有相关订单哦~</p>
            </div>
          </template>
          <template v-if="activeIndex === 3">
            <template v-if="paidForms.length > 0">
              <order-form-list
                key="3"
                :store="paidForms"
                :selectable="false"
                @go-enterprise="goEnterprise"
                @go-detail="goDetail"
                @action="action">
              </order-form-list>
            </template>
            <div
              v-else
              key="3"
              class="no-form">
              <img src="../../assets/emptyOrder.png">
              <p>您还没有相关订单哦~</p>
            </div>
          </template>
          <template v-if="activeIndex === 4">
            <template v-if="deliveredForms.length > 0">
              <order-form-list
                key="4"
                :store="deliveredForms"
                :selectable="false"
                @go-enterprise="goEnterprise"
                @go-detail="goDetail"
                @action="action">
              </order-form-list>
            </template>
            <div
              v-else
              key="4"
              class="no-form">
              <img src="../../assets/emptyOrder.png">
              <p>您还没有相关订单哦~</p>
            </div>
          </template>
          <template v-if="activeIndex === 5">
            <template v-if="receiptedForms.length > 0">
              <order-form-list
                key="5"
                :store="receiptedForms"
                :selectable="false"
                @go-enterprise="goEnterprise"
                @go-detail="goDetail"
                @action="action">
              </order-form-list>
            </template>
            <div
              v-else
              key="5"
              class="no-form">
              <img src="../../assets/emptyOrder.png">
              <p>您还没有相关订单哦~</p>
            </div>
          </template>
        </transition>
      </div>
    </section>
    <confirm-dialog
      v-if="showConfirm"
      :msg="confirmMsg"
      @click="handleConfirm">
    </confirm-dialog>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import OrderFormList from '../../components/orderForm/OrderFormList'
  import { getStore, setStore, removeStore } from '../../config/mUtils'
  import ConfirmDialog from '../../components/common/ConfirmDialog'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        header: '我的订单',
        iconClass: 'icon-fenlei',
        token: getStore('user') ? getStore('user').authentication_token : '',
        activeIndex: 1,
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
        receiptedForms: [], // 待评价
        showConfirm: false,
        cancelOrderId: '',
        confirmMsg: '确定取消订单？'
      }
    },
    components: {
      CommonHeader,
      OrderFormList,
      ConfirmDialog
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
      selectTab (index) {
        this.activeIndex = index
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
          this.allForms = this.orderFormsFilter(orderForms)
          this.getOrderForms(1, this.submittedPageIndex, this.submittedPageSize)
        } else if (index === 1) {
          this.submittedForms = this.orderFormsFilter(orderForms)
          this.getOrderForms(2, this.paidPageIndex, this.paidPageSize)
        } else if (index === 2) {
          this.paidForms = this.orderFormsFilter(orderForms)
          this.getOrderForms(3, this.deliveredPageIndex, this.deliveredPageSize)
        } else if (index === 3) {
          this.deliveredForms = this.orderFormsFilter(orderForms)
          this.getOrderForms(4, this.receiptedPageIndex, this.receiptedPageSize)
        } else if (index === 4) {
          this.receiptedForms = this.orderFormsFilter(orderForms)
        } else {
          console.error('获取订单信息失败')
        }
      },
      // 过滤掉返回订单中的空订单
      orderFormsFilter (arr) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          let count = 0
          for (let j = 0; j < arr[i].items.length; j++) {
            if (arr[i].items[j].name && arr[i].items[j].price && arr[i].items[j].quantity && arr[i].items[j].product_id && arr[i].items[j].state) {
              count += 1
            }
          }
          if (count === arr[i].items.length) {
            tmpArr.push(arr[i])
          }
        }
        return tmpArr
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
      },
      action (item) {
        switch (item.type) {
          case 'trace': // 查看物流
            this.notOpen()
            break
          case 'contact': // 联系卖家客服
            this.goChat(item.params)
            break
          case 'cancel': // 取消订单
            this.showConfirm = true
            this.cancelOrderId = item.params
            break
          case 'pay': // 付款
            this.notOpen()
            break
          case 'remind': // 提醒发货
            this.remindRequest(item.params)
            break
          case 'delete': // 删除订单(删除被取消的订单，暂未开放)
            this.notOpen()
            break
          default:
            Toast({
              message: '未知错误',
              duration: 500
            })
            break
        }
      },
      remindRequest (id) {
        this.$store.dispatch('commonAction', {
          url: `/order_forms/${id}/remind`,
          method: 'put',
          params: {},
          data: {
            token: this.token,
            number: id
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.code) {
              Toast({
                mesasge: res.data.detail || '提醒失败',
                duration: 500
              })
            }
          },
          reject: (state, err) => {
            if (err.status && err.status === 204) {
              Toast({
                message: '您已成功提醒发货~',
                className: 'toast-content',
                iconClass: 'iconfont icon-caozuochenggong toast-icon-big',
                position: 'bottom',
                duration: 1000
              })
            }
          }
        })
      },
      notOpen () {
        Toast({
          message: '暂未开放',
          duration: 500
        })
      },
      goChat (id) {
        this.$router.push({name: 'Chat', query: {type: 'Product', productId: id}})
      },
      // 取消订单
      cancelOrderRequest (id) {
        this.$store.dispatch('commonAction', {
          url: `/order_forms/${id}/cancel`,
          method: 'put',
          params: {},
          data: {
            token: this.token,
            number: id
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.code) {
              Toast({
                mesasge: res.data.detail || '取消订单失败',
                duration: 500
              })
            } else {
              Toast({
                message: '您已成功取消订单',
                duration: 500
              })
            }
          },
          reject: (state, res) => {
            if (res.status && res.status === 204) {
              Toast({
                message: '您已成功取消订单',
                duration: 500
              })
              this.resetPageIndex()
              this.getOrderForms(0, this.allPageIndex, this.allPageSize)
            }
          }
        })
      },
      handleConfirm (bool) {
        this.showConfirm = false
        if (bool) {
          this.cancelOrderRequest(this.cancelOrderId)
        }
      },
      // 重置所以的分页索引
      resetPageIndex () {
        this.allPageIndex = 1
        this.submittedPageIndex = 1
        this.paidPageIndex = 1
        this.deliveredPageIndex = 1
        this.receiptedPageIndex = 1
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
    display: flex;
    background-color: $white;
    .tab {
      display: block;
      flex: 1;
      text-align: center;
      border-bottom: 1px solid $tenth-grey;
      .label {
        height: inherit;
        @include px2rem(line-height, 90px);
        @include font-dpr(15px);
      }
    }
    .selected {
      @include px2rem(border-bottom-width, 8px);
      border-bottom-color: #FF5001;
      color: #FF5001;
      border-bottom-style: solid;
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
