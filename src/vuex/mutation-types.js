// 全局通用(仅用于async await)
export const REQUEST_BEGIN = 'REQUEST_BEGIN'
export const REQUEST_SUCCESS = 'REQUEST_SUCCESS'
export const REQUEST_FAILED = 'REQUEST_FAILED'
// 全局通用
export const FETCH_BEGIN = 'FETCH_BEGIN'
export const FETCH_SUCCESS = 'FETCH_SUCCESS'
export const FETCH_FAILED = 'FETCH_FAILED'
// 设置用户全局代理
export const SET_USER_DELEGATE = 'SET_USER_DELEGATE'
// 设置设备全局代理
export const SET_DEVICE_DELEGATE = 'SET_DEVICE_DELEGATE'
// 更新会话记录(来自leancloud)
export const UPDATE_LEAN_CLOUD_CONVERSATIONS = 'UPDATE_CONVERSATIONS'
// 收到新消息(在非聊天页面)
export const RECEIVE_NEW_MESSAGE = 'RECEIVE_NEW_MESSAGE'
// 更新未读消息
export const UPDATE_UN_READ_MSG_COUNT = 'UPDATE_UN_READ_MSG_COUNT'
// 搜索会话(暂时只支持本地搜索)
export const SEARCH_CONVERSATION = 'SEARCH_CONVERSATION'
// 选中/取消选中会话
export const CHECK_CONVERSATION = 'CHECK_CONVERSATION'
// 切换路由时，重置某些state中的数组，避免数据未加载时，显示上一次获取的数据
export const RESET_STATE = 'RESET_STATE'
