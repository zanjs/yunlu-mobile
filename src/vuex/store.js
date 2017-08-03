import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types'
import api from '../api/api'
import moment from 'moment'
import { getStore, setStore } from '../config/mUtils'

Vue.use(Vuex)

const state = {
  uuid: getStore('user') ? getStore('user').id : '',
  userDelegate: null,
  deviceDelegate: null,
  leanCloudConversations: [],
  yunLuConversations: [],
  conversationList: [],
  unReadeMsgs: [], // 未读消息
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
  deviceDelegate: state => state.deviceDelegate,
  leanCloudConversations: state => state.leanCloudConversations,
  yunLuConversations: state => state.yunLuConversations,
  conversationList: state => state.conversationList,
  unReadeMsgs: state => state.unReadeMsgs,
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
  action ({commit}, params) {
    commit(types.REQUEST_BEGIN, params)
    api.commonRequest(params, res => commit(types.REQUEST_SUCCESS, {params, res}), err => commit(types.REQUEST_FAILED, {params, err}))
  },
  commonAction ({commit}, params) {
    commit(types.FETCH_BEGIN, params)
    api.commonRequest(params, res => commit(types.FETCH_SUCCESS, {params, res}), err => commit(types.FETCH_FAILED, {params, err}))
  },
  setDeviceDelegate ({commit}, params) {
    commit(types.SET_DEVICE_DELEGATE, {params})
  },
  setUserDelegate ({commit}, params) {
    commit(types.SET_USER_DELEGATE, {params})
  },
  updateLeanCouldConversations ({commit}, params) {
    commit(types.UPDATE_LEAN_CLOUD_CONVERSATIONS, {params})
  },
  updateUnReadMsgCount ({commit}, params) {
    commit(types.UPDATE_UN_READ_MSG_COUNT, {params})
  },
  searchConversation ({commit}, params) {
    commit(types.SEARCH_CONVERSATION, {params})
  },
  checkConversation ({commit}, params) {
    commit(types.CHECK_CONVERSATION, {params})
  },
  receiveNewMessage ({commit}, params) {
    commit(types.RECEIVE_NEW_MESSAGE, {params})
  },
  validCodeAction ({commit}, params) {
    commit(types.FETCH_BEGIN, params)
    api.validCodeRequest(params, res => commit(types.FETCH_SUCCESS, {params, res}), err => commit(types.FETCH_FAILED, {params, err}))
  },
  resetState ({commit}) {
    commit(types.RESET_STATE)
  }
}

const mutations = {
  [types.REQUEST_BEGIN] (state) {
    state.pageLoading = true
    state.loadSuccess = false
  },

  [types.REQUEST_SUCCESS] (state, {params, res}) {
    state.pageLoading = false
    if (res.data) {
      state.loadSuccess = true
      params.resolveFn(state, res)
    } else {
      state.loadSuccess = false
      params.rejectFn(state, res)
    }
  },

  [types.REQUEST_FAILED] (state, {params, err}) {
    state.pageLoading = false
    state.loadSuccess = false
    params.rejectFn(state, err)
  },

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
  },

  [types.SET_USER_DELEGATE] (state, {params}) {
    state.userDelegate = params
  },

  [types.SET_DEVICE_DELEGATE] (state, {params}) {
    state.deviceDelegate = params
  },

  [types.UPDATE_LEAN_CLOUD_CONVERSATIONS] (state, {params}) {
    let tmpArr = []
    for (let i = 0; i < params.length; i++) {
      tmpArr.push({
        conversationId: params[i].id,
        from: params[i].lastMessage && params[i].lastMessage.from ? params[i].lastMessage.from : '',
        id: params[i].lastMessage && params[i].lastMessage.id ? params[i].lastMessage.id : '',
        fromLogo: params[i].lastMessage && params[i].lastMessage._lcattrs && params[i].lastMessage._lcattrs.fromLogo ? params[i].lastMessage._lcattrs.fromLogo : '',
        fromName: params[i].lastMessage && params[i].lastMessage._lcattrs && params[i].lastMessage._lcattrs.fromName ? params[i].lastMessage._lcattrs.fromName : '',
        timestamp: moment(params[i]._updatedAt).format('YYYY-MM-DD HH:mm:ss'),
        clazz: params[i].lastMessage && params[i].lastMessage._lcattrs && params[i].lastMessage._lcattrs.clazz ? params[i].lastMessage._lcattrs.clazz : 'user',
        lastMessage: params[i].lastMessage && params[i].lastMessage._lctext ? params[i].lastMessage._lctext : '点击查看聊天记录',
        isSelf: params[i].lastMessage && params[i].lastMessage._lcattrs && params[i].lastMessage._lcattrs.from ? params[i].lastMessage._lcattrs.from === state.uuid : false,
        hasRead: true
      })
    }
    state.leanCloudConversations = tmpArr
    setStore('leanCloudConversations', tmpArr)
  },

  [types.UPDATE_UN_READ_MSG_COUNT] (state, {params}) {
    state.unReadeMsgs = params
  },

  [types.SEARCH_CONVERSATION] (state, {params}) {
    state.conversationList = state.conversationList.filter(i => i.remark.indexOf(params) > -1)
  },

  [types.CHECK_CONVERSATION] (state, {params}) {
    // TODO: 将会话列表的状态管理移至vuex
  },

  [types.RECEIVE_NEW_MESSAGE] (state, {params}) {
    let count = 0
    for (let i = 0; i < state.conversationList.length; i++) {
      if (state.conversationList[i].conversationId === params.conversationId) {
        state.conversationList[i].id = params.id
        state.conversationList[i].timestamp = params.timestamp
        state.conversationList[i].lastMessage = params.lastMessage
        state.conversationList[i].hasRead = false
        count += 1
        break
      }
    }
    if (count === 0) {
      state.conversationList.push(params)
    }
  },

  [types.RESET_STATE] (state) {
    state.products = []
    state.productsThumbnails = []
    state.productDetailFiles = []
    state.allPriceProperties = []
    state.archives = []
    state.informationFolderArchives = []
    state.enterpriseDocuments = []
    state.enterpriseInfoFiles = []
    state.enterpriseMembers = []
    state.personMembers = []
    state.productDetailTeam = []
    state.clusters = []
    state.clientKeyWrods = []
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
