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
  closedConversationList: [], // 被关闭的消息列表，用于再次打开
  conversationList: [], // 消息列表，用于页面显示(显示搜索结果)
  originConversationList: [], // 原始消息列表
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
  seeCard: {}, // 云视首页发送名片卡片
  deliveries: [], // 收货地址
  popState: false,
  fromLogin: false,
  scrollMap: {}, // 页面滚动高度集合
  registModal: false, // 提示注册的对话框
  hasCloseRegistModal: false, // 是否手动关闭了下载条
  registSuccessModal: false, // 注册成功奖励积分的对话框
  leanCloudActive: false, // leancloud服务激活状态，注销后变为false，登录成功后变为true
  makeCardModal: false, // 制作名片提示模态窗
  showDownloadBar: true, // 默认显示下载条
  hasCloseDownloadBar: false // 是否手动关闭了下载条
}

const getters = {
  userDelegate: state => state.userDelegate,
  deviceDelegate: state => state.deviceDelegate,
  leanCloudConversations: state => state.leanCloudConversations,
  yunLuConversations: state => state.yunLuConversations,
  closedConversationList: state => state.closedConversationList,
  conversationList: state => state.conversationList,
  originConversationList: state => state.originConversationList,
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
  seeCard: state => state.seeCard,
  deliveries: state => state.deliveries,
  popState: state => state.popState,
  fromLogin: state => state.fromLogin,
  scrollMap: state => state.scrollMap,
  registModal: state => state.registModal,
  hasCloseRegistModal: state => state.hasCloseRegistModal,
  registSuccessModal: state => state.registSuccessModal,
  leanCloudActive: state => state.leanCloudActive,
  makeCardModal: state => state.makeCardModal,
  showDownloadBar: state => state.showDownloadBar,
  hasCloseDownloadBar: state => state.hasCloseDownloadBar
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
  clearUnReadMsgCount ({commit}, params) {
    commit(types.CLEAR_UN_READ_MSG_COUNT, {params})
  },
  searchConversation ({commit}, params) {
    commit(types.SEARCH_CONVERSATION, {params})
  },
  markAsRead ({commit}, params) {
    commit(types.MARK_AS_READ, {params})
  },
  checkConversation ({commit}, params) {
    commit(types.CHECK_CONVERSATION, {params})
  },
  checkAllConversation ({commit}, params) {
    commit(types.CHECK_ALL_CONVERSATION, {params})
  },
  handleDeleteConversations ({commit}, params) {
    commit(types.HANDLE_DELETE_CONVERSATIONS, {params})
  },
  receiveNewMessage ({commit}, params) {
    commit(types.RECEIVE_NEW_MESSAGE, {params})
  },
  validCodeAction ({commit}, params) {
    commit(types.FETCH_BEGIN, params)
    api.validCodeRequest(params, res => commit(types.FETCH_SUCCESS, {params, res}), err => commit(types.FETCH_FAILED, {params, err}))
  },
  routeChange ({commit}, params) {
    commit(types.ROUTE_CHANGE, {params})
  },
  saveScroll ({commit}, params) {
    commit(types.SAVE_SCROLL, {params})
  },
  switchIntegralDialog ({commit}, params) {
    commit(types.SWITCH_INTEGRAL_DIALOG, {params})
  },
  switchRegistDialog ({commit}, params) {
    commit(types.SWITCH_REGIST_DIALOG, {params})
  },
  switchLeanCloudStatus ({commit}, params) {
    commit(types.SWITCH_LEANCLOUD_STATUS, {params})
  },
  switchMakeCardDialog ({commit}, params) {
    commit(types.SWITCH_MAKE_CARD_DIALOG, {params})
  },
  switchDownloadBar ({commit}, params) {
    commit(types.SWITCH_DOWNLOAD_BAR_STATUS, {params})
  },
  closeDownloadBar ({commit}, params) {
    commit(types.CLOSE_DOWNLOAD_BAR, {params})
  },
  closeIntegralDialog ({commit}, params) {
    commit(types.CLOSE_INTEGRAL_DIALOG, {params})
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
        timestamp: moment(params[i]._updatedAt).format('YYYY-MM-DD HH:mm:ss'), // leancloud 返回的消息时间里的_lastmessageAt 部分数据为null，故这里用_updatedAt 代替，有误差
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
    let tmpArr = []
    for (let i = 0; i < params.length; i++) {
      // 需要把系统消息过滤掉(流程消息)，只保留用户聊天(单聊、群聊、客服)消息
      if (params[i].lastMessage.from !== 'system' && !params[i].system) {
        tmpArr.push({id: params[i].id})
        state.unReadeMsgs = params
      }
    }
    setStore('unReadMsgs', tmpArr)
  },

  [types.CLEAR_UN_READ_MSG_COUNT] (state, {params}) {
    state.unReadeMsgs = []
    setStore('unReadMsgs', [])
  },

  [types.SEARCH_CONVERSATION] (state, {params}) {
    state.conversationList = state.originConversationList.filter(i => i.remark.indexOf(params) > -1)
  },

  [types.CHECK_CONVERSATION] (state, {params}) {
    let originalIndex = 0
    let index = 0
    for (let i = 0; i < state.originConversationList.length; i++) {
      if (params.item.conversationId === state.originConversationList[i].conversationId) {
        originalIndex = i
        break
      }
    }
    state.originConversationList[originalIndex].checked = !params.item.checked
    for (let i = 0; i < state.conversationList.length; i++) {
      if (params.item.conversationId === state.conversationList[i].conversationId) {
        index = i
        break
      }
    }
    state.conversationList[index].checked = !params.item.checked
    Vue.set(state.conversationList, index, state.conversationList[index])
    params.resolve(state.conversationList)
  },

  [types.CHECK_ALL_CONVERSATION] (state, {params}) {
    /**
     * 这里的params.item实际上就是页面上显示的会话列表(即state.conversationList)
     * 全选时，需要同时改变原始会话列表和过滤后的会话列表的选中状态
     */
    for (let i = 0; i < state.originConversationList.length; i++) {
      for (let j = 0; j < params.items.length; j++) {
        if (state.originConversationList[i].conversationId === params.items[j].conversationId) {
          state.originConversationList[i].checked = !params.checked
        }
      }
    }
    for (let i = 0; i < state.conversationList.length; i++) {
      state.conversationList[i].checked = !params.checked
    }
  },

  [types.HANDLE_DELETE_CONVERSATIONS] (state, {params}) {
    let ids = []
    for (let i = 0; i < state.conversationList.length; i++) {
      if (state.conversationList[i].checked) {
        ids.push(state.conversationList[i].conversationId)
      }
    }
    params.resolve(ids)
  },

  [types.MARK_AS_READ] (state, {params}) {
    let index = 0
    let tmpArr = []
    for (let i = 0; i < state.originConversationList.length; i++) {
      if (params.data.id === state.originConversationList[i].id) {
        state.originConversationList[i].hasRead = true
        if (params.type === 'chat') {
          state.originConversationList[i].timestamp = moment(params.data._lastMessageAt).format('YYYY-MM-DD HH:mm:ss')
        }
      }
    }
    state.conversationList = [...state.originConversationList]
    for (let i = 0; i < state.originConversationList.length; i++) {
      for (let j = 0; j < state.unReadeMsgs.length; j++) {
        if (state.originConversationList[i].conversationId === state.unReadeMsgs[j].id) {
          index = j
          break
        }
      }
    }
    for (let i = 0; i < state.leanCloudConversations.length; i++) {
      for (let j = 0; j < state.originConversationList.length; j++) {
        if (state.leanCloudConversations[i].conversationId === state.originConversationList[j].conversationId) {
          state.leanCloudConversations[i].hasRead = true
        }
      }
    }
    state.unReadeMsgs.splice(index, 1)
    for (let i = 0; i < state.unReadeMsgs.length; i++) {
      tmpArr.push({id: state.unReadeMsgs[i].id})
    }
    setStore('unReadMsgs', tmpArr)
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
    state.conversationList.sort((a, b) => {
      return moment(b.timestamp).isAfter(a.timestamp) ? 1 : -1
    })
    state.originConversationList = [...state.conversationList]
  },

  [types.ROUTE_CHANGE] (state, {params}) {
    state.popState = !!params.savedPosition
    state.fromLogin = params.from.name === 'Login' || params.from.name === 'RegisterNext'
  },

  [types.SAVE_SCROLL] (state, {params}) {
    state.scrollMap[params.name] = params.value
  },

  [types.SWITCH_INTEGRAL_DIALOG] (state, {params}) {
    state.registModal = params.status
  },

  [types.SWITCH_REGIST_DIALOG] (state, {params}) {
    state.registSuccessModal = params.status
  },

  [types.SWITCH_LEANCLOUD_STATUS] (state, {params}) {
    state.leanCloudActive = params.active
  },

  [types.SWITCH_MAKE_CARD_DIALOG] (state, {params}) {
    state.makeCardModal = params.status
  },

  [types.SWITCH_DOWNLOAD_BAR_STATUS] (state, {params}) {
    state.showDownloadBar = params.status
  },

  [types.CLOSE_DOWNLOAD_BAR] (state, {params}) {
    state.hasCloseDownloadBar = params.status
    state.showDownloadBar = !params.status
  },

  [types.CLOSE_INTEGRAL_DIALOG] (state, {params}) {
    state.registModal = !params.status
    state.hasCloseRegistModal = params.status
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
