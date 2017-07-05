import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types'
import api from '../api/api'
// import { Indicator } from 'mint-ui'

Vue.use(Vuex)

const state = {
  userDelegate: null,
  pageLoading: false,
  loadSuccess: false,
  user: null,
  teams: null,
  products: [],
  productsThumbnails: [],
  productDetail: {},
  productDetailFiles: [],
  allPriceProperties: [],
  archives: [],
  informationFolderArchives: [], // 资讯二级文件夹
  enterpriseDocuments: [], // 公司档/协会分类概况
  enterpriseInfoFiles: [], // 公司/协会资讯
  enterpriseMembers: [], // 协会下的企业会员
  personMembers: [], // 协会下的个人会员
  productDetailTeam: [], // 产品详情页下方的所属机构(协会产品所属机构为协会下的企业)
  allEnterprises: [], // 企业搜索列表所有的协会和企业
  userCard: {}, // 个人会员名片
  clusters: [], // 个人会员集群(空间)
  comityDetail: {}, // 协会详情
  clientKeyWrods: [], // 云视首页关键字卡片数组(企业数量大于100会在首页显示)
  seeCard: {} // 云视首页发送名片卡片
}

const getters = {
  userDelegate: state => state.userDelegate,
  pageLoading: state => state.pageLoading,
  loadSuccess: state => state.loadSuccess,
  user: state => state.user,
  teams: state => state.teams,
  products: state => state.products,
  productsThumbnails: state => state.productsThumbnails,
  productDetail: state => state.productDetail,
  productDetailFiles: state => state.productDetailFiles,
  allPriceProperties: state => state.allPriceProperties,
  archives: state => state.archives,
  informationFolderArchives: state => state.informationFolderArchives,
  enterpriseDocuments: state => state.enterpriseDocuments,
  enterpriseInfoFiles: state => state.enterpriseInfoFiles,
  enterpriseMembers: state => state.enterpriseMembers,
  personMembers: state => state.personMembers,
  productDetailTeam: state => state.productDetailTeam,
  allEnterprises: state => state.allEnterprises,
  userCard: state => state.userCard,
  clusters: state => state.clusters,
  comityDetail: state => state.comityDetail,
  clientKeyWrods: state => state.clientKeyWrods,
  seeCard: state => state.seeCard
}

const actions = {
  commonAction ({commit}, params) {
    commit(types.FETCH_BEGIN, params)
    api.commonRequest(params, res => commit(types.FETCH_SUCCESS, {params, res}), err => commit(types.FETCH_FAILED, {params, err}))
  },
  setUserDelegate ({commit}, params) {
    commit(types.SET_USER_DELEGATE, {params})
  }
}

const mutations = {
  [types.FETCH_BEGIN] (state) {
    state.pageLoading = true
    state.loadSuccess = false
    // Indicator.open()
  },

  [types.FETCH_SUCCESS] (state, {params, res}) {
    state.pageLoading = false
    // Indicator.close()
    if (res.data) {
      state.loadSuccess = true
      params.resolve(state, res)
    } else {
      state.loadSuccess = false
      params.reject(state, res)
    }
  },

  [types.FETCH_FAILED] (state, {params, err}) {
    // Indicator.close()
    state.pageLoading = false
    state.loadSuccess = false
    params.reject(state, err)
  },

  [types.SET_USER_DELEGATE] (state, {params}) {
    state.userDelegate = params
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
