<template>
  <section>
    <common-header
      :title="header"
      @back="goBack()">
    </common-header>
    <form
      class="search-bar"
      action=""
      target="iframe">
      <input
        type="search"
        v-model="searchParams"
        @input="handleInput"
        @keyup.enter.prevent="handleSearchBtn"
        placeholder="搜一搜">
      <div
        class="search-btn"
        @click.stop="searchFavorites">
        <i class="iconfont icon-sousuo"></i>
      </div>
      <iframe
        name="iframe"
        style="display: none;">
      </iframe>
    </form>
    <template v-if="favorites && favorites.length > 0">
      <section class="list-container">
        <mt-loadmore
          :top-method="loadFavoritesTop"
          :bottom-method="loadFavoritesBottom"
          :bottom-pull-text="bottomPullText"
          :bottom-drop-text="bottomDropText"
          :auto-fill="false"
          ref="loadMoreFavorites">
          <favorites-list
            :favorites="favorites"
            @click="goRoute"
            @check="handleSingleCheck">
          </favorites-list>
        </mt-loadmore>
      </section>
      <div class="option-bar">
        <div
          class="check-btn"
          @click="handleAllCheck(favorites, checkAll)">
          <i
            v-if="!checkAll"
            class="iconfont icon-weixuanzhong"></i>
          <i
            v-if="checkAll"
            class="iconfont icon-xuanzhong checked">
            </i>
          <p>全选</p>
        </div>
        <a
          v-show="hasChecked"
          class="text-btn"
          @click="deleteConfirm()">
          移出收藏夹
        </a>
        <div
          v-show="!hasChecked"
          class="text-btn btn-disabled">
          移出收藏夹
        </div>
      </div>
      <confirm-dialog
        v-if="showConfirm"
        :msg="confirmMsg"
        @click="deleteItem">
      </confirm-dialog>
    </template>
    <template v-if="favorites && favorites.length === 0">
      <div class="empty-container">
        <div class="img-container">
          <img src="../../assets/noFavorites.png">
        </div>
        <p>您还没有收藏任何宝贝呦~</p>
      </div>
    </template>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import { getStore, removeStore } from '../../config/mUtils'
  import FavoritesList from '../../components/product/FavoritesList'
  import ConfirmDialog from '../../components/common/ConfirmDialog'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        header: '收藏夹',
        searchParams: '',
        pageIndex: 1,
        pageSize: 24,
        token: getStore('user') ? getStore('user').authentication_token : null,
        favorites: [],
        checkAll: false,
        bottomPullText: '上拉加载更多',
        bottomDropText: '释放加载',
        hasSearch: false,
        hasChecked: false,
        showConfirm: false,
        confirmMsg: '确定要删除选中的商品吗?'
      }
    },
    components: {
      CommonHeader,
      FavoritesList,
      ConfirmDialog
    },
    methods: {
      goBack () {
        if (getStore('Favorites_goHome')) {
          removeStore('Favorites_goHome')
          this.$router.push({name: 'See'})
        } else {
          this.$router.go(-1)
        }
      },
      resetSearchBar () {
        this.searchParams = ''
        this.hasChecked = false
        this.hasSearch = false
        this.pageIndex = 1
        this.getFavorites()
      },
      handleInput () {
        if (this.searchParams === '') {
          this.resetSearchBar()
        }
      },
      searchFavorites () {
        if (!this.searchParams) {
          Toast({
            message: '搜索关键词不能为空',
            duration: 500
          })
        } else {
          this.getFavorites(this.searchParams)
        }
      },
      handleSearchBtn () {
        this.getFavorites(this.searchParams)
        document.activeElement.blur()
      },
      getFavorites (q = this.searchParams) {
        this.$store.dispatch('commonAction', {
          url: '/favorites',
          method: 'get',
          params: {
            page: this.pageIndex,
            per_page: this.pageSize,
            token: this.token,
            q: q
          },
          target: this,
          resolve: (state, res) => {
            this.hasSearch = q !== ''
            if (this.pageIndex === 1) {
              this.favorites = this.handleFavorites(res.data.favorites)
              this.handleAllCheck(this.favorites, true)
              // favorites为空时，上拉加载、下拉刷新组件未初始化，不能直接调用它的重置位置方法
              if (this.$refs.loadMoreFavorites && this.$refs.loadMoreFavorites.onTopLoaded) {
                this.$refs.loadMoreFavorites.onTopLoaded()
              }
            } else {
              if (res.data.favorites.length === 0) {
                Toast({
                  message: '没有更多数据了',
                  duration: 1000
                })
              }
              this.favorites = [...this.favorites, ...this.handleFavorites(res.data.favorites)]
              if (this.$refs.loadMoreFavorites && this.$refs.loadMoreFavorites.onBottomLoaded) {
                this.$refs.loadMoreFavorites.onBottomLoaded()
              }
            }
          },
          reject: () => {
          }
        })
      },
      handleFavorites (arr) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          tmpArr.push({
            ...arr[i],
            checked: false
          })
        }
        return tmpArr
      },
      deleteConfirm () {
        this.showConfirm = true
      },
      deleteItem (bool) {
        this.showConfirm = false
        if (bool) {
          this.handleDeleteFavorites(this.favorites)
        }
      },
      handleDeleteFavorites (arr) {
        let tmpArr = []
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].checked) {
            tmpArr.push(arr[i].id)
          }
        }
        this.removeFavorites(tmpArr)
      },
      removeFavorites (arr) {
        this.$store.dispatch('commonAction', {
          url: '/favorites/all',
          method: 'delete',
          params: {},
          data: {
            token: this.token,
            ids: arr
          },
          target: this,
          resolve: (state, res) => {
            if (res.data.success) {
              this.favorites = this.deleteFavorites(this.favorites, arr)
              Toast({
                message: '删除成功',
                duration: 500
              })
            }
          },
          reject: () => {
          }
        })
      },
      goRoute (item) {
        if (item.type === 'Product') {
          this.$router.push({name: 'ProductDetail', params: {id: item.id}})
        }
      },
      handleSingleCheck (item) {
        for (let i = 0; i < this.favorites.length; i++) {
          if (item.id === this.favorites[i].id) {
            this.favorites[i].checked = !this.favorites[i].checked
            this.isAllChecked(this.favorites)
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
      deleteFavorites (arr1, arr2) {
        let tmpArr = []
        for (let i = 0; i < arr1.length; i++) {
          let index = 0
          for (let j = 0; j < arr2.length; j++) {
            if (arr1[i].id === arr2[j]) {
              index += 1
            }
          }
          if (index === 0) {
            tmpArr.push(arr1[i])
          }
        }
        return tmpArr
      },
      handleAllCheck (arr, bool) {
        for (let i = 0; i < arr.length; i++) {
          arr[i].checked = !bool
        }
        this.checkAll = this.hasChecked = !bool
      },
      loadFavoritesTop () {
        this.pageIndex = 1
        this.getFavorites(this.searchParams)
      },
      loadFavoritesBottom () {
        this.pageIndex += 1
        this.getFavorites(this.searchParams)
      },
      shouldLogin () {
        if (!this.token) {
          let toast = Toast({
            message: `您未登录，正在转入登录页`
          })
          setTimeout(() => {
            toast.close()
            this.$router.push({name: 'Login'})
          }, 2000)
        } else {
          this.getFavorites(this.searchParams)
        }
      }
    },
    mounted () {
      this.shouldLogin()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";

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
  .search-bar {
    position: fixed;
    @include px2rem(height, 88px);
    @include px2rem(top, 88px);
    width: 100%;
    max-width: 540px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #D1D1D1;
    background-color: $white;
    z-index: 2;
    input {
      width: 100%;
      border: none;
      @include font-dpr(14px);
      @include px2rem(border-radius, 14px);
      @include pm2rem(margin, 0px, 32px, 0px, 32px);
      line-height: 1;
      background-color: #EDEDED;
      color: #595959;
      @include px2rem(height, 66px);
      @include pm2rem(padding, 2px, 100px, 0px, 30px);
      vertical-align: middle;
      text-align: left;
    }
    ::-webkit-input-placeholder{
      color: #C2C2C2;
      @include px2rem(height, 66px);
      vertical-align: middle;
      text-align: left;
      border: none;
      @include font-dpr(14px);
      line-height: 1;
    }
    input[type=search]::-webkit-search-cancel-button {
      -webkit-appearance: none; // 此处只是去掉默认的小×
    }
    .clear-btn {
      position: absolute;
      @include px2rem(right, 140px);
      @include px2rem(height, 66px);
      display: flex;
      justify-content: flex-end;
      i {
        @include font-dpr(21px);
        color: #D1D1D1;
        @include px2rem(margin-top, -2px);
      }
    }
    .search-btn {
      position: absolute;
      @include px2rem(right, 60px);
      @include px2rem(height, 66px);
      top: 50%;
      transform: translateY(-50%);
      color: #B4B4B4;
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        @include px2rem(padding-top, 4px);
      }
    }
  }
  .list-container {
    @include pm2rem(padding, 176px, 0px, 98px, 0px);
  }
  .option-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    width: 100%;
    max-width: 540px;
    @include px2rem(height, 98px);
    background-color: $white;
    border-top: 1px solid #E7E7E7;
    .check-btn {
      display: flex;
      align-items: center;
      height: inherit;
      @include pm2rem(padding, 0px, 30px, 0px, 28px);
      line-height: 1;
      i {
        @include font-dpr(18px);
        color: #A6A6A6;
        @include px2rem(margin-right, 12px);
      }
      p {
        @include font-dpr(16px);
        color: #595959;
      }
      .checked {
        color: #52CAA7;
      }
    }
    .text-btn {
      @include px2rem(width, 206px);
      @include px2rem(height, 70px);
      @include px2rem(border-radius, 40px);
      background-color: #52CAA7;
      color: $white;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      @include font-dpr(15px);
      @include px2rem(margin-right, 28px);
    }
    a:active {
      background-color: rgba(82, 202, 167, .5);
    }
    .btn-disabled {
      background-color: #DEDEDE;
    }
  }
  .empty-container {
    @include pm2rem(padding, 176px, 0px, 0px, 0px);
    .img-container {
      @include pm2rem(padding, 90px, 0px, 40px, 0px);
      text-align: center;
      img {
        @include px2rem(width, 266px);
        @include px2rem(height, 342px);
      }
    }
    p {
      @include font-dpr(16px);
      color: #A6A6A6;
      text-align: center;
    }
  }
</style>
