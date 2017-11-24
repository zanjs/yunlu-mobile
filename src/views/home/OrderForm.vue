<template>
  <section
    class="container full-width"
    ref="orderForm"
    :style="{height: scrollHeight}">
    <common-header
      :title="header"
      :icon-class="iconClass"
      @right-click="openDropMenu()"
      @back="goBack()">
    </common-header>
    <section>
      <div class="nav-bars full-width">
        <a
          v-for="(item, index) in orderFormOptions"
          class="tab"
          :key="index"
          :class="{'selected': activeIndex === index}"
          @click="selectTab(index)">
          <div class="label">{{item.title}}</div>
        </a>
      </div>
      <div class='nav-bar-container'>
        <div v-for="(item, index) in orderFormOptions" :key="index">
          <template v-if="activeIndex === index">
            <div v-if="item.forms.length > 0">
              <order-form-list
                :store="item.forms"
                :selectable="item.selectable"
                @checked="checkForm"
                @go-enterprise="goEnterprise"
                @go-detail="goDetail"
                @action="action">
              </order-form-list>
              <mugen-scroll
                :handler="loadBottom"
                :handle-on-mount="false"
                :should-handle="!item.loading"
                scroll-container="orderForm">
                <div
                  v-if="item.loading || item.noMoreData"
                  class="loading">
                  <mt-spinner
                    v-if="item.loading"
                    type="snake"
                    :size="18">
                  </mt-spinner>
                  <p>{{item.text}}</p>
                </div>
              </mugen-scroll>
            </div>
            <div
              v-else
              class="no-form">
              <img src="../../assets/emptyOrder.png">
              <p>您还没有相关订单哦~</p>
            </div>
          </template>
        </div>
      </div>
    </section>
    <section
      v-if="activeIndex === 1 && orderFormOptions[activeIndex].forms.length > 0"
      class="option-bar full-width">
      <a
        class="icon-box"
        @click.stop="handleAllCheck(orderFormOptions[activeIndex].forms, checkAll)">
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
  import { getStore, setStore, removeStore, setScrollTop } from '../../config/mUtils'
  import ConfirmDialog from '../../components/common/ConfirmDialog'
  import MugenScroll from 'vue-mugen-scroll'
  import { Toast } from 'mint-ui'
  export default {
    name: 'OrderForm',
    data () {
      return {
        header: '我的订单',
        iconClass: 'icon-fenlei',
        token: getStore('user') ? getStore('user').authentication_token : '',
        activeIndex: 0,
        orderFormOptions: [
          {
            loading: true,
            selectable: false,
            title: '全部',
            text: '加载中...',
            pageIndex: 1,
            pageSize: 20,
            forms: [],
            noMoreData: false,
            params: {}
          }, {
            loading: true,
            selectable: true,
            title: '待付款',
            text: '加载中...',
            pageIndex: 1,
            pageSize: 20,
            forms: [],
            noMoreData: false,
            params: {state: ['submitted']}
          }, {
            loading: true,
            selectable: false,
            title: '待发货',
            text: '加载中...',
            pageIndex: 1,
            pageSize: 20,
            forms: [],
            noMoreData: false,
            params: {state: ['paid', 'reminded']}
          }, {
            loading: true,
            selectable: false,
            title: '待收货',
            text: '加载中...',
            pageIndex: 1,
            pageSize: 20,
            forms: [],
            noMoreData: false,
            params: {state: ['delivered']}
          }, {
            loading: true,
            selectable: false,
            title: '待评价',
            text: '加载中...',
            pageIndex: 1,
            pageSize: 20,
            forms: [],
            noMoreData: false,
            params: {
              state: ['receipted', 'finished'],
              item_state: ['mounted', 'accepted', 'rejected']
            }
          }
        ],
        showConfirm: false,
        cancelOrderId: '',
        confirmMsg: '确定取消订单？',
        showMenu: false,
        hasChecked: false,
        checkAll: false,
        scrollHeight: '14rem'
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
      // 处理返回的订单
      handleOrderForms (index, orderForms) {
        this.orderFormOptions[index].forms = [...this.orderFormOptions[index].forms, ...this.orderFormsFilter(orderForms)]
        this.orderFormOptions[index].loading = false
        if (index === 4) {
          return false
        }
        this.getOrderForms(index + 1, this.orderFormOptions[index + 1].pageIndex, this.orderFormOptions[index + 1].pageSize)
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
        for (let i = 0; i < this.orderFormOptions[1].forms.length; i++) {
          if (item.id === this.orderFormOptions[1].forms[i].code) {
            this.orderFormOptions[1].forms[i].checked = !item.bool
            this.isAllChecked(this.orderFormOptions[1].forms)
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
      getOrderForms (index, pageIndex, pageSize) {
        this.orderFormOptions[index].loading = true
        this.$store.dispatch('commonAction', {
          url: '/order_forms',
          method: 'get',
          params: {
            token: this.token,
            page: pageIndex,
            per_page: pageSize,
            ...this.orderFormOptions[index].params
          },
          data: {},
          target: this,
          resolve: (state, res) => {
            if (pageIndex === 1) {
              this.orderFormOptions[index].forms = this.orderFormsFilter(res.data.order_forms)
              this.orderFormOptions[index].loading = false
              if (index === 4) {
                return false
              }
              this.getOrderForms(index + 1, this.orderFormOptions[index + 1].pageIndex, this.orderFormOptions[index + 1].pageSize)
            } else {
              if (res.data.order_forms.length === 0) {
                this.orderFormOptions[index].noMoreData = true
                this.orderFormOptions[index].text = '没有更多数据了...'
              }
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
            this.pay(item)
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
                position: 'center',
                duration: 1000
              })
            }
          }
        })
      },
      pay (item) {
        this.$router.push({name: 'Pay', query: {code: item.params.code, amount: item.params.amount}})
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
              this.getOrderForms(0, this.orderFormOptions[0].pageIndex, this.orderFormOptions[0].pageSize)
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
        this.orderFormOptions = this.orderFormOptions.map(i => {
          i.pageIndex = 1
          i.noMoreData = false
          i.text = '加载中...'
          return i
        })
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
      loadBottom () {
        if (!this.orderFormOptions[this.activeIndex].noMoreData) {
          this.orderFormOptions[this.activeIndex].pageIndex += 1
          this.getOrderForms(this.activeIndex, this.orderFormOptions[this.activeIndex].pageIndex, this.orderFormOptions[this.activeIndex].pageSize)
        }
      }
    },
    mounted () {
      let appHeight = document.getElementById('app').offsetHeight
      let rootFontSize = document.documentElement.style.fontSize.split('p')[0]
      let divHeight = (appHeight / parseFloat(rootFontSize + '')).toFixed(2)
      this.scrollHeight = `${Math.round(divHeight * 100) / 100}rem`
    },
    activated () {
      if (!this.$store.state.popState) {
        this.activeIndex = 0
        this.orderFormOptions = this.orderFormOptions.map(i => {
          i.loading = true
          i.pageIndex = 1
          i.noMoreData = false
          i.text = '加载中...'
          return i
        })
        this.token = getStore('user') ? getStore('user').authentication_token : ''
        setScrollTop(0, this.$refs.orderForm)
        this.getOrderForms(0, this.orderFormOptions[0].pageIndex, this.orderFormOptions[0].pageSize)
        this.addTouch()
      } else {
        setScrollTop(this.$store.state.scrollMap.OrderForm || 0, this.$refs.orderForm)
      }
    },
    beforeRouteLeave (to, from, next) {
      this.$store.dispatch('saveScroll', {name: 'OrderForm', value: this.$refs.orderForm.scrollTop})
      next()
    }
  }
</script>

<style lang='scss' scoped>
  @import '../../styles/mixin';

  .container {
    position: absolute;
    top: 0;
    overflow-y: scroll;
    padding-bottom: 1px;
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
      transition: color, border-bottom-color .2s;
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
      @include px2rem(border-radius, 8px);
      box-shadow: 0 1px 5px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12);
      .item {
        @include px2rem(height, 90px);
        @include px2rem(padding-left, 30px);
        display: flex;
        justify-content: flex-start;
        align-items: center;
        line-height: normal;
        color: $white;
        border-bottom: 1px solid rgba(166, 166, 166, .5);
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
