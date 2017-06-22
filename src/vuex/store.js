import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types'
import api from '../api/api'

Vue.use(Vuex)

const state = {
  pageLoading: false,
  loadSuccess: false,
  teams: null,
  products: [],
  productsThumbnails: [],
  productDetail: {},
  productDetailFiles: [],
  allPriceProperties: [],
  archives: [],
  enterpriseDocuments: [], // 公司档/协会分类概况
  enterpriseInfoFiles: [], // 公司/协会资讯
  enterpriseMembers: [], // 协会下的企业会员
  personMembers: [], // 协会下的个人会员
  productDetailTeam: [] // 产品详情页下方的所属机构(协会产品所属机构为协会下的企业)
}

const getters = {
  pageLoading: state => state.pageLoading,
  loadSuccess: state => state.loadSuccess,
  teams: state => state.teams,
  products: state => state.products,
  productsThumbnails: state => state.productsThumbnails,
  productDetail: state => state.productDetail,
  productDetailFiles: state => state.productDetailFiles,
  allPriceProperties: state => state.allPriceProperties,
  archives: state => state.archives,
  enterpriseDocuments: state => state.enterpriseDocuments,
  enterpriseInfoFiles: state => state.enterpriseInfoFiles,
  enterpriseMembers: state => state.enterpriseMembers,
  personMembers: state => state.personMembers,
  productDetailTeam: state => state.productDetailTeam
}

const actions = {
  commonAction ({commit}, params) {
    commit(types.FETCH_BEGIN, params)
    api.commonRequest(params, res => commit(types.FETCH_SUCCESS, {params, res}), err => commit(types.FETCH_FAILED, {params, err}))
  }
}

const mutations = {
  [types.FETCH_BEGIN] (state) {
    state.pageLoading = true
    state.loadSuccess = false
  },

  [types.FETCH_SUCCESS] (state, {params, res}) {
    state.pageLoading = false
    if (res.data) {
      state.loadSuccess = true
      params.resolve(state, res)
    } else {
      state.loadSuccess = false
      params.reject(state, res)
    }
  },

  [types.FETCH_FAILED] (state, {params, err}) {
    state.pageLoading = false
    state.loadSuccess = false
    params.reject(state, err)
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
