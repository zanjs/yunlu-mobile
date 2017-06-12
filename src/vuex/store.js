import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types'
import api from '../api/api'

Vue.use(Vuex)

const state = {
  pageLoading: false
}

const getters = {
  pageLoading: state => state.pageLoading
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
  },

  [types.FETCH_SUCCESS] (state, {params, res}) {
    state.pageLoading = false
    if (res.data.success) {
      params.resolve(state, res)
    } else {
      params.reject(state, res.data.msg)
    }
  },

  [types.FETCH_FAILED] (state, {params, err}) {
    state.pageLoading = false
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
