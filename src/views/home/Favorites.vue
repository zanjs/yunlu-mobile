<template>
  <section>
    <common-header
      :title="header"
      :right-text="rightBtnText"
      @right-click="selectableSwitch(inOperation)"
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
        class="absolute-vertical flex search-btn"
        @click.stop="searchFavorites">
        <i class="iconfont icon-sousuo"></i>
      </div>
      <iframe
        name="iframe"
        style="display: none;">
      </iframe>
    </form>
    <section>
      <div class="nav-bars full-width">
        <a
          class="tab"
          :class="{'selected': activeIndex === 1}"
          @click="selectTab(1)">
          <div class="label">商品</div>
        </a>
        <a
          class="tab"
          :class="{'selected': activeIndex === 2}"
          @click="selectTab(2)">
          <div class="label">机构名片</div>
        </a>
        <a
          class="tab"
          :class="{'selected': activeIndex === 3}"
          @click="selectTab(3)">
          <div class="label">个人名片</div>
        </a>
      </div>
      <div
        class='nav-bar-container full-width'
        :class="{'nav-bar-bottom': inOperation}">
        <template v-if="activeIndex === 1">
          <div v-if="favoriteProducts.length > 0">
            <favorites-list
              :favorites="favoriteProducts"
              :selectable="inOperation"
              @click="goRoute"
              @check="handleSingleCheck">
            </favorites-list>
            <mugen-scroll
              key="favoriteProducts"
              :handler="loadAProductsBottom"
              :handle-on-mount="false"
              :should-handle="!productLoading && !inOperation">
              <div
                v-if="productLoading || noMoreProducts"
                class="loading">
                <mt-spinner
                  v-if="productLoading"
                  type="snake"
                  :size="18">
                </mt-spinner>
                <p>{{productLoadingText}}</p>
              </div>
            </mugen-scroll>
          </div>
          <div
            v-else
            key="1"
            class="empty-container">
            <div class="img-container">
              <img src="../../assets/noFavorites.png">
            </div>
            <p>您还没有收藏任何宝贝呦~</p>
          </div>
        </template>
        <template v-if="activeIndex === 2">
          <div v-if="favoriteOrganizations.length > 0">
            <favorites-list
              :favorites="favoriteOrganizations"
              :selectable="inOperation"
              @click="goRoute"
              @check="handleSingleCheck">
            </favorites-list>
            <mugen-scroll
              key="favoriteOrganizations"
              :handler="loadAOrganizationsBottom"
              :handle-on-mount="false"
              :should-handle="!organizationLoading && !inOperation">
              <div
                v-if="organizationLoading || noMoreOrganizations"
                class="loading">
                <mt-spinner
                  v-if="organizationLoading"
                  type="snake"
                  :size="18">
                </mt-spinner>
                <p>{{organizationLoadingText}}</p>
              </div>
            </mugen-scroll>
          </div>
          <div
            v-else
            key="1"
            class="empty-container">
            <div class="img-container">
              <img src="../../assets/noFavorites.png">
            </div>
            <p>您还没有收藏任何宝贝呦~</p>
          </div>
        </template>
        <template v-if="activeIndex === 3">
          <div v-if="favoritePerson.length > 0">
            <favorites-list
              :favorites="favoritePerson"
              :selectable="inOperation"
              @click="goRoute"
              @check="handleSingleCheck">
            </favorites-list>
            <mugen-scroll
              key="favoritePerson"
              :handler="loadAPersonBottom"
              :handle-on-mount="false"
              :should-handle="!personLoading && !inOperation">
              <div
                v-show="personLoading"
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
            class="empty-container">
            <div class="img-container">
              <img src="../../assets/noFavorites.png">
            </div>
            <p>您还没有收藏任何宝贝呦~</p>
          </div>
        </template>
      </div>
    </section>
    <template v-if="shouldShowOptionBar()">
      <div
        v-show="inOperation"
        class="option-bar full-width">
        <div
          class="check-btn"
          @click="handleAllCheck(activeIndex, checkAll)">
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
          class="flex text-btn"
          @click="deleteConfirm()">
          移出收藏夹
        </a>
        <div
          v-show="!hasChecked"
          class="flex text-btn btn-disabled">
          移出收藏夹
        </div>
      </div>
      <confirm-dialog
        v-if="showConfirm"
        :msg="confirmMsg"
        @click="deleteItem">
      </confirm-dialog>
    </template>
  </section>
</template>

<script>
  import CommonHeader from '../../components/header/CommonHeader'
  import { getStore, removeStore } from '../../config/mUtils'
  import FavoritesList from '../../components/product/FavoritesList'
  import ConfirmDialog from '../../components/common/ConfirmDialog'
  import MugenScroll from 'vue-mugen-scroll'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        header: '收藏夹',
        rightBtnText: '管理',
        searchParams: '',
        activeIndex: 1,
        selectedType: 'Product',
        token: getStore('user') ? getStore('user').authentication_token : null,
        favoriteProducts: [],
        favoriteOrganizations: [],
        favoritePerson: [],
        productPageIndex: 1,
        productPageSize: 20,
        productLoading: true,
        organizationPageIndex: 1,
        organizationPageSize: 20,
        organizationLoading: true,
        personPageIndex: 1,
        personPageSize: 20,
        personLoading: true,
        checkAll: false,
        hasSearch: false,
        hasChecked: false,
        showConfirm: false,
        confirmMsg: '确定要删除选中的商品吗?',
        inOperation: false,
        productLoadingText: '加载中...',
        organizationLoadingText: '加载中...',
        personLoadingText: '加载中...',
        noMoreProducts: false,
        noMoreOrganizations: false,
        noMorePeople: false
      }
    },
    components: {
      CommonHeader,
      FavoritesList,
      ConfirmDialog,
      MugenScroll
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
        this.productPageIndex = 1
        this.organizationPageIndex = 1
        this.personPageIndex = 1
        this.getFavorites(this.searchParams, this.activeIndex, 1, 20, this.selectedType)
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
          this.getFavorites(this.searchParams, this.activeIndex, 1, 20, this.selectedType)
        }
      },
      handleSearchBtn () {
        this.getFavorites(this.searchParams, this.activeIndex, 1, 20, this.selectedType)
        document.activeElement.blur()
      },
      getFavorites (q = this.searchParams, activeIndex = 1, pageIndex = 1, pageSize = 20, type = 'Product') {
        this.handleLoading(activeIndex, true)
        this.$store.dispatch('commonAction', {
          url: '/favorites',
          method: 'get',
          params: {
            page: pageIndex,
            per_page: pageSize,
            token: this.token,
            type: type,
            q: q
          },
          target: this,
          resolve: (state, res) => {
            this.hasSearch = q !== ''
            if (res.data.favorites.length === 0) {
              if (pageIndex !== 1) {
                this.handleNoMoreDataTips(activeIndex)
              } else {
                this.setFavoritesData(activeIndex, [], 1)
              }
              this.handleLoading(activeIndex, false)
            } else {
              this.setFavoritesData(activeIndex, res.data.favorites, pageIndex)
            }
          },
          reject: () => {
          }
        })
      },
      handleNoMoreDataTips (activeIndex) {
        switch (activeIndex) {
          case 1:
            this.noMoreProducts = true
            this.productLoadingText = '没有更多数据了...'
            break
          case 2:
            this.noMoreOrganizations = true
            this.organizationLoadingText = '没有更多数据了...'
            break
          case 3:
            this.noMorePeople = true
            this.personLoadingText = '没有更多数据了...'
            break
          default:
            this.noMoreProducts = true
            this.productLoadingText = '没有更多数据了...'
            break
        }
      },
      setFavoritesData (activeIndex, arr, pageIndex) {
        if (activeIndex === 1) {
          this.favoriteProducts = [...(pageIndex === 1 ? [] : this.favoriteProducts), ...this.handleChecked(arr)]
          this.productLoading = false
          this.getFavorites(this.searchParams, 2, this.organizationPageIndex, this.organizationPageSize, 'Organization')
          this.handleAllCheck(this.favoriteProducts, true)
        } else if (activeIndex === 2) {
          this.favoriteOrganizations = [...(pageIndex === 1 ? [] : this.favoriteOrganizations), ...this.handleChecked(arr)]
          this.organizationLoading = false
          this.getFavorites(this.searchParams, 3, this.personPageIndex, this.personPageSize, 'User')
          this.handleAllCheck(this.favoriteOrganizations, true)
        } else {
          this.favoritePerson = [...(pageIndex === 1 ? [] : this.favoritePerson), ...this.handleChecked(arr)]
          this.personLoading = false
          this.handleAllCheck(this.favoritePerson, true)
        }
      },
      handleLoading (index, bool) {
        switch (index) {
          case 1:
            this.productLoading = bool
            break
          case 2:
            this.organizationLoading = bool
            break
          case 3:
            this.personLoading = bool
            break
          default:
            this.productLoading = bool
            break
        }
      },
      handleChecked (arr) {
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
          if (this.activeIndex === 1) {
            this.handleDeleteFavorites(this.favoriteProducts)
          } else if (this.activeIndex === 2) {
            this.handleDeleteFavorites(this.favoriteOrganizations)
          } else {
            this.handleDeleteFavorites(this.favoritePerson)
          }
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
              if (this.activeIndex === 1) {
                this.favoriteProducts = this.deleteFavorites(this.favoriteProducts, arr)
              } else if (this.activeIndex === 2) {
                this.favoriteOrganizations = this.deleteFavorites(this.favoriteOrganizations, arr)
              } else {
                this.favoritePerson = this.deleteFavorites(this.favoritePerson, arr)
              }
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
        } else if (item.type === 'Organization') {
          switch (item.other_fields.service_aliaz) {
            case 'class':
              this.$router.push({name: 'Class', params: {id: item.id}})
              break
            case 'mall':
              this.$router.push({name: 'Mall', params: {id: item.id}})
              break
            case 'association':
              this.$router.push({name: 'ComityCarte', params: {id: item.id}})
              break
            case 'school':
              this.$router.push({name: 'Alumni', params: {id: item.id}})
              break
            default:
              this.$router.push({name: 'EnterpriseCarte', params: {id: item.id}})
              break
          }
        } else if (item.type === 'User') {
          this.$router.push({name: 'PersonCarte', params: {user_id: item.id}})
        }
      },
      handleSingleCheck (item) {
        if (this.activeIndex === 1) {
          this.singleCheck(item, this.favoriteProducts)
        } else if (this.activeIndex === 2) {
          this.singleCheck(item, this.favoriteOrganizations)
        } else {
          this.singleCheck(item, this.favoritePerson)
        }
      },
      singleCheck (item, arr) {
        for (let i = 0; i < arr.length; i++) {
          if (item.id === arr[i].id) {
            arr[i].checked = !arr[i].checked
            this.isAllChecked(arr)
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
      handleAllCheck (index, bool) {
        if (index === 1) {
          this.allCheck(this.favoriteProducts, bool)
        } else if (index === 2) {
          this.allCheck(this.favoriteOrganizations, bool)
        } else {
          this.allCheck(this.favoritePerson, bool)
        }
      },
      allCheck (arr, bool) {
        for (let i = 0; i < arr.length; i++) {
          arr[i].checked = !bool
        }
        this.checkAll = this.hasChecked = !bool
      },
      loadAProductsBottom () {
        if (!this.noMoreProducts) {
          this.productPageIndex += 1
          this.getFavorites(this.searchParams, 1, this.productPageIndex, this.productPageSize, 'Product')
        }
      },
      loadAOrganizationsBottom () {
        if (!this.noMoreOrganizations) {
          this.organizationPageIndex += 1
          this.getFavorites(this.searchParams, 2, this.organizationPageIndex, this.organizationPageSize, 'Organization')
        }
      },
      loadAPersonBottom () {
        if (!this.noMorePeople) {
          this.personPageIndex += 1
          this.getFavorites(this.searchParams, 3, this.personPageIndex, this.personPageSize, 'User')
        }
      },
      selectableSwitch (bool) {
        this.inOperation = !bool
        this.rightBtnText = bool ? '管理' : '完成'
        this.handleAllCheck(this.activeIndex, true)
      },
      selectTab (index) {
        this.activeIndex = index
        this.handleAllCheck(this.activeIndex, true)
        switch (index) {
          case 1:
            this.selectedType = 'Product'
            break
          case 2:
            this.selectedType = 'Organization'
            break
          case 3:
            this.selectedType = 'User'
            break
          default:
            this.selectedType = 'Product'
            break
        }
      },
      shouldShowOptionBar () {
        if (this.activeIndex === 1) {
          return this.favoriteProducts.length > 0
        } else if (this.activeIndex === 2) {
          return this.favoriteOrganizations.length > 0
        } else {
          return this.favoritePerson.length > 0
        }
      }
    },
    mounted () {
      this.getFavorites(this.searchParams, 1, this.productPageIndex, this.productPageSize, 'Product')
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
    border-bottom: 1px solid $fifth-grey;
    background-color: $white;
    z-index: 2;
    input {
      width: 100%;
      border: none;
      @include font-dpr(14px);
      @include px2rem(border-radius, 14px);
      @include pm2rem(margin, 0px, 32px, 0px, 32px);
      line-height: 1;
      background-color: $ninth-grey;
      color: $second-dark;
      @include px2rem(height, 66px);
      @include pm2rem(padding, 2px, 100px, 0px, 30px);
      vertical-align: middle;
      text-align: left;
    }
    ::-webkit-input-placeholder{
      color: $eighth-grey;
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
        color: $fifth-grey;
        @include px2rem(margin-top, -2px);
      }
    }
    .search-btn {
      @include px2rem(right, 60px);
      @include px2rem(height, 66px);
      color: $eleventh-grey;
      i {
        @include px2rem(padding-top, 4px);
      }
    }
  }
  .nav-bars {
    position: fixed;
    @include px2rem(top, 176px);
    @include px2rem(height, 88px);
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
        @include px2rem(line-height, 88px);
        @include font-dpr(15px);
        font-weight: 500;
        color: $second-dark;
      }
    }
    .selected {
      @include px2rem(border-bottom-width, 6px);
      border-bottom-color: $green;
      color: $green;
      border-bottom-style: solid;
      .label {
        color: $green;
      }
    }
  }
  .nav-bar-container {
    @include px2rem(padding-top, 266px);
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
  .nav-bar-bottom {
    @include px2rem(margin-bottom, 98px);
  }
  .option-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    @include px2rem(height, 98px);
    background-color: $white;
    border-top: 1px solid $third-grey;
    .check-btn {
      display: flex;
      align-items: center;
      height: inherit;
      @include pm2rem(padding, 0px, 30px, 0px, 28px);
      line-height: 1;
      i {
        @include font-dpr(18px);
        color: $third-dark;
        @include px2rem(margin-right, 12px);
      }
      p {
        @include font-dpr(16px);
        color: $second-dark;
      }
      .checked {
        color: $green;
      }
    }
    .text-btn {
      @include px2rem(width, 206px);
      @include px2rem(height, 70px);
      @include px2rem(border-radius, 40px);
      background-color: $green;
      color: $white;
      line-height: 1;
      @include font-dpr(15px);
      @include px2rem(margin-right, 28px);
    }
    a:active {
      background-color: rgba(82, 202, 167, .5);
    }
    .btn-disabled {
      background-color: $fourth-grey;
    }
  }
  .empty-container {
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
      color: $third-dark;
      text-align: center;
    }
  }
</style>
