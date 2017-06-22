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
  allPriceProperties: []
}

const getters = {
  pageLoading: state => state.pageLoading,
  loadSuccess: state => state.loadSuccess,
  teams: state => state.teams,
  products: state => state.products,
  productsThumbnails: state => state.productsThumbnails,
  productDetail: state => state.productDetail,
  productDetailFiles: state => state.productDetailFiles,
  allPriceProperties: state => state.allPriceProperties
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
