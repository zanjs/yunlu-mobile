<template>
  <section class="container full-width">
    <common-header
      :title="header"
      :icon-class="iconClass"
      @right-click="openDropMenu()"
      @back="goBack()">
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
        <template v-if="activeIndex === 1">
          <div
            v-if="allForms.length > 0"
            key="1">
            <order-form-list
              key="1"
              :store="allForms"
              :selectable="false"
              @go-enterprise="goEnterprise"
              @go-detail="goDetail"
              @action="action">
            </order-form-list>
            <mugen-scroll
              key="allForms"
              :handler="loadAllFormsBottom"
              :handle-on-mount="false"
              :should-handle="!allLoading">
              <div
                v-show="allLoading"
                class="loading">
                <mt-spinner
                  type="snake"
                  :size="18">
                </mt-spinner>
                <p>加载中...</p>
              </div>
            </mugen-scroll>
          </div>
          <div
            v-else
            key="1"
            class="no-form">
            <img src="../../assets/emptyOrder.png">
            <p>您还没有相关订单哦~</p>
          </div>
        </template>
        <template v-if="activeIndex === 2">
          <div
            v-if="submittedForms.length > 0"
            key="2">
            <order-form-list
              key="2"
              class="has-option"
              :store="submittedForms"
              :selectable="true"
              @checked="checkForm"
              @go-enterprise="goEnterprise"
              @go-detail="goDetail"
              @action="action">
            </order-form-list>
            <mugen-scroll
              key="submittedForms"
              :handler="loadSubmittedFormsBottom"
              :handle-on-mount="false"
              :should-handle="!submittedLoading">
              <div
                v-show="submittedLoading"
                class="loading">
                <mt-spinner
                  type="snake"
                  :size="18">
                </mt-spinner>
                <p>加载中...</p>
              </div>
            </mugen-scroll>
          </div>
          <div
            v-else
            key="2"
            class="no-form">
            <img src="../../assets/emptyOrder.png">
            <p>您还没有相关订单哦~</p>
          </div>
        </template>
        <template v-if="activeIndex === 3">
          <div
            v-if="paidForms.length > 0"
            key="3">
            <order-form-list
              key="3"
              :store="paidForms"
              :selectable="false"
              @go-enterprise="goEnterprise"
              @go-detail="goDetail"
              @action="action">
            </order-form-list>
            <mugen-scroll
              key="paidForms"
              :handler="loadPaidFormsBottom"
              :handle-on-mount="false"
              :should-handle="!paidLoading">
              <div
                v-show="paidLoading"
                class="loading">
                <mt-spinner
                  type="snake"
                  :size="18">
                </mt-spinner>
                <p>加载中...</p>
              </div>
            </mugen-scroll>
          </div>
          <div
            v-else
            key="3"
            class="no-form">
            <img src="../../assets/emptyOrder.png">
            <p>您还没有相关订单哦~</p>
          </div>
        </template>
        <template v-if="activeIndex === 4">
          <div
            v-if="deliveredForms.length > 0"
            key="4">
            <order-form-list
              key="4"
              :store="deliveredForms"
              :selectable="false"
              @go-enterprise="goEnterprise"
              @go-detail="goDetail"
              @action="action">
            </order-form-list>
            <mugen-scroll
              key="deliveredForms"
              :handler="loadDeliveredFormsBottom"
              :handle-on-mount="false"
              :should-handle="!deliveredLoading">
              <div
                v-show="deliveredLoading"
                class="loading">
                <mt-spinner
                  type="snake"
                  :size="18">
                </mt-spinner>
                <p>加载中...</p>
              </div>
            </mugen-scroll>
          </div>
          <div
            v-else
            key="4"
            class="no-form">
            <img src="../../assets/emptyOrder.png">
            <p>您还没有相关订单哦~</p>
          </div>
        </template>
        <template v-if="activeIndex === 5">
          <div
            v-if="receiptedForms.length > 0"
            key="5">
            <order-form-list
              key="5"
              :store="receiptedForms"
              :selectable="false"
              @go-enterprise="goEnterprise"
              @go-detail="goDetail"
              @action="action">
            </order-form-list>
            <mugen-scroll
              key="receiptedForms"
              :handler="loadReceiptedFormsBottom"
              :handle-on-mount="false"
              :should-handle="!receiptedLoading">
              <div
                v-show="receiptedLoading"
                class="loading">
                <mt-spinner
                  type="snake"
                  :size="18">
                </mt-spinner>
                <p>加载中...</p>
              </div>
            </mugen-scroll>
          </div>
          <div
            v-else
            key="5"
            class="no-form">
            <img src="../../assets/emptyOrder.png">
            <p>您还没有相关订单哦~</p>
          </div>
        </template>
      </div>
    </section>
    <section
      v-if="activeIndex === 2 && submittedForms.length > 0"
      class="option-bar full-width">
      <a
        class="icon-box"
        @click.stop="handleAllCheck(submittedForms, checkAll)">
        <i
          v-if="checkAll"
          class="iconfont icon-xuanzhong checked"></i>
        <i
          v-if="!checkAll"
          class="iconfont icon-weixuanzhong"></i>
      </a>
      <a
        v-if="checkAll"
        class="btn danger"
        @click.stop="payAll()">合并付款</a>
      <div
        v-if="!checkAll"
        class="btn disabled">
        合并付款
      </div>
    </section>
    <confirm-dialog
      v-if="showConfirm"
      :msg="confirmMsg"
      @click="handleConfirm">
    </confirm-dialog>
    <section
      v-show="showMenu"
      id="drop-menu-bg"
      class="drop-menu-bg full-width">
      <div class="menu">
        <a
          class="item"
          @click.stop="goFavorites()">
          <i class="iconfont icon-shoucang"></i>
          <span>收藏夹</span>
        </a>
        <a
          class="item"
          @click.stop="goShoppingCart()">
          <i class="iconfont icon-gouwuche"></i>
          <span>购物车</span>
        </a>
      </div>
    </section>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import OrderFormList from '../../components/orderForm/OrderFormList'
  import { getStore, setStore, removeStore, getScrollTop, setScrollTop } from '../../config/mUtils'
  import ConfirmDialog from '../../components/common/ConfirmDialog'
  import MugenScroll from 'vue-mugen-scroll'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        header: '我的订单',
        iconClass: 'icon-fenlei',
        token: getStore('user') ? getStore('user').authentication_token : '',
        activeIndex: 1,
        allLoading: false,
        allPageIndex: 1,
        allPageSize: 20,
        allForms: [],
        submittedLoading: false,
        submittedPageIndex: 1,
        submittedPageSize: 20,
        submittedForms: [], // 待付款
        paidLoading: false,
        paidPageIndex: 1,
        paidPageSize: 20,
        paidForms: [], // 待发货
        deliveredLoading: false,
        deliveredPageIndex: 1,
        deliveredPageSize: 20,
        deliveredForms: [], // 待收货
        receiptedLoading: false,
        receiptedPageIndex: 1,
        receiptedPageSize: 20,
        receiptedForms: [], // 待评价
        showConfirm: false,
        cancelOrderId: '',
        confirmMsg: '确定取消订单？',
        showMenu: false,
        hasChecked: false,
        checkAll: false
      }
    },
    components: {
      CommonHeader,
      OrderFormList,
      ConfirmDialog,
      MugenScroll
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
          this.allForms = [...this.allForms, ...this.orderFormsFilter(orderForms)]
          this.allLoading = false
          this.getOrderForms(1, this.submittedPageIndex, this.submittedPageSize)
        } else if (index === 1) {
          this.submittedForms = [...this.submittedForms, ...this.orderFormsFilter(orderForms)]
          this.submittedLoading = false
          this.getOrderForms(2, this.paidPageIndex, this.paidPageSize)
        } else if (index === 2) {
          this.paidForms = [...this.paidForms, ...this.orderFormsFilter(orderForms)]
          this.paidLoading = false
          this.getOrderForms(3, this.deliveredPageIndex, this.deliveredPageSize)
        } else if (index === 3) {
          this.deliveredForms = [...this.deliveredForms, ...this.orderFormsFilter(orderForms)]
          this.deliveredLoading = false
          this.getOrderForms(4, this.receiptedPageIndex, this.receiptedPageSize)
        } else if (index === 4) {
          this.receiptedForms = [...this.receiptedForms, ...this.orderFormsFilter(orderForms)]
          this.receiptedLoading = false
        } else {
          console.error('获取订单信息失败')
        }
      },
      // 过滤掉返回订单中的空订单,并且添加checked字段
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
            tmpArr.push({...arr[i], checked: false})
          }
        }
        return tmpArr
      },
      // 勾选订单
      checkForm (item) {
        for (let i = 0; i < this.submittedForms.length; i++) {
          if (item.id === this.submittedForms[i].code) {
            this.submittedForms[i].checked = !item.bool
            this.isAllChecked(this.submittedForms)
          }
        }
      },
      isAllChecked (arr) {
        let count = 0
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].checked) {
            count += 1
          }
        }
        this.hasChecked = count > 0
        this.checkAll = count === arr.length
      },
      handleAllCheck (arr, bool) {
        for (let i = 0; i < arr.length; i++) {
          arr[i].checked = !bool
        }
        this.checkAll = this.hasChecked = !bool
      },
      handleLoading (index, bool) {
        switch (index) {
          case 0:
            this.allLoading = bool
            break
          case 1:
            this.submittedLoading = bool
            break
          case 2:
            this.paidLoading = bool
            break
          case 3:
            this.deliveredLoading = bool
            break
          case 4:
            this.receiptedLoading = bool
            break
          default:
            this.allLoading = bool
            break
        }
      },
      getOrderForms (index, pageIndex, pageSize) {
        this.handleLoading(index, true)
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
            if (res.data.order_forms.length === 0) {
              if (pageIndex !== 1) {
                Toast({
                  message: '没有更多数据了',
                  duration: 1000
                })
              }
              this.$nextTick(() => {
                setScrollTop(getScrollTop() - 50)
              })
              this.handleLoading(index, false)
            } else {
              this.handleOrderForms(index, res.data.order_forms)
            }
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
            // 116250642270135
            setStore('traceLogo', item.params.items[0].logo)
            this.$router.push({path: `/trace/${item.params.code}`})
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
      },
      openDropMenu () {
        this.showMenu = true
      },
      addTouch () {
        let self = this
        document.getElementById('drop-menu-bg').addEventListener('touchstart', (e) => {
          // e.preventDefault()
          setTimeout(() => {
            self.showMenu = false
          }, 500)
        })
        document.getElementById('drop-menu-bg').addEventListener('click', (e) => {
          // e.preventDefault()
          setTimeout(() => {
            self.showMenu = false
          }, 500)
        })
        document.getElementById('drop-menu-bg').addEventListener('touchstart', (e) => {
          // e.preventDefault()
          setTimeout(() => {
            self.showMenu = false
          }, 500)
        })
        document.getElementById('drop-menu-bg').addEventListener('click', (e) => {
          // e.preventDefault()
          setTimeout(() => {
            self.showMenu = false
          }, 500)
        })
      },
      goFavorites () {
        this.$router.push({name: 'Favorites'})
      },
      goShoppingCart () {
        this.$router.push({name: 'ShoppingCart'})
      },
      payAll () {
        this.notOpen()
      },
      loadAllFormsBottom () {
        this.allPageIndex += 1
        this.getOrderForms(0, this.allPageIndex, this.allPageSize)
      },
      loadSubmittedFormsBottom () {
        this.submittedPageIndex += 1
        this.getOrderForms(1, this.submittedPageIndex, this.submittedPageSize)
      },
      loadPaidFormsBottom () {
        this.paidPageIndex += 1
        this.getOrderForms(2, this.paidPageIndex, this.paidPageSize)
      },
      loadDeliveredFormsBottom () {
        this.deliveredPageIndex += 1
        this.getOrderForms(3, this.deliveredPageIndex, this.deliveredPageSize)
      },
      loadReceiptedFormsBottom () {
        this.receiptedPageIndex += 1
        this.getOrderForms(4, this.receiptedPageIndex, this.receiptedPageSize)
      }
    },
    mounted () {
      this.getOrderForms(0, this.allPageIndex, this.allPageSize)
      this.addTouch()
    }
  }
</script>

<style lang='scss' scoped>
  @import '../../styles/mixin';

  .container {
    position: absolute;
    top: 0;
    bottom: 0;
    background-color: $tenth-grey;
  }
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
      border-bottom-color: $second-red;
      color: $second-red;
      border-bottom-style: solid;
    }
  }
  .nav-bar-container {
    @include px2rem(padding-top, 178px);
    @include px2rem(margin-bottom, 10px);
    .loading {
      height: 40px;
      @include font-dpr(15px);
      color: $second-dark;
      line-height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      p {
        @include px2rem(margin-left, 20px);
      }
    }
    .has-option {
      @include px2rem(margin-bottom, 120px);
    }
    .no-form {
      img {
        @include px2rem(width, 319px);
        @include px2rem(height, 319px);
        @include pm2rem(margin, 122px, 0px, 46px, 0px);
      }
      text-align: center;
      p {
        @include font-dpr(15px);
        color: $third-dark;
      }
    }
  }
  .option-bar {
    position: fixed;
    bottom: 0;
    width: 100%;
    @include px2rem(height, 100px);
    background-color: $white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: normal;
    a:active {
      background-color: rgba(239, 234, 234, .5);
    }
    .icon-box {
      display: flex;
      align-items: center;
      height: inherit;
      i {
        @include font-dpr(20px);
        color: $third-dark;
        border-color: $third-dark;
        @include pm2rem(margin, 0px, 30px, 0px, 30px);
      }
      .checked {
        color: $green;
        border-color: $green;
      }
    }
    .btn {
      @include px2rem(height, 60px);
      @include px2rem(width, 152px);
      @include px2rem(margin-right, 30px);
      @include font-dpr(13px);
      display: flex;
      justify-content: center;
      align-items: center;
      color: $primary-dark;
      border: 1px solid $fifth-grey;
      @include px2rem(margin-left, 20px);
      @include px2rem(border-radius, 8px);
    }
    .danger {
      border-color: $second-red;
      color: $second-red;
    }
    .disabled {
      color: $eighth-grey;
    }
  }
  .drop-menu-bg {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: 1002;
    .menu {
      position: fixed;
      @include px2rem(top, 88px);
      @include px2rem(right, 20px);
      background-color: rgba(57, 55, 66, .9);
      @include px2rem(width, 270px);
      z-index: 9999 !important;
      .item {
        @include px2rem(height, 90px);
        @include px2rem(padding-left, 30px);
        display: flex;
        justify-content: flex-start;
        align-items: center;
        line-height: normal;
        color: $white;
        border-bottom: 1px solid $third-dark;
        i {
          @include px2rem(margin-right, 40px);
          @include font-dpr(20px);
        }
        span {
          @include font-dpr(15px);
        }
      }
    }
    .menu:after {
      content: '';
      position: absolute;
      background-color: transparent;
      @include px2rem(top, -26px);
      @include px2rem(right, 17px);
      width: 0;
      height: 0;
      @include px2rem(border-left-width, 14px);
      @include px2rem(border-right-width, 14px);
      @include px2rem(border-bottom-width, 26px);
      border-left-color: transparent;
      border-right-color: transparent;
      border-bottom-color: rgba(57, 55, 66, .8);
      border-style: solid;
      border-top: none;
    }
  }
</style>
