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
export const UPDATE_LEAN_CLOUD_CONVERSATIONS = 'UPDATE_LEAN_CLOUD_CONVERSATIONS'
// 收到新消息(在非聊天页面)
export const RECEIVE_NEW_MESSAGE = 'RECEIVE_NEW_MESSAGE'
// 更新未读消息
export const UPDATE_UN_READ_MSG_COUNT = 'UPDATE_UN_READ_MSG_COUNT'
// 将某一条会话标为已读
export const MARK_AS_READ = 'MARK_AS_READ'
// 搜索会话(暂时只支持本地搜索)
export const SEARCH_CONVERSATION = 'SEARCH_CONVERSATION'
// 选中/取消选中会话
export const CHECK_CONVERSATION = 'CHECK_CONVERSATION'
// 全选/取消全选会话
export const CHECK_ALL_CONVERSATION = 'CHECK_ALL_CONVERSATION'
// 过滤出需要删除的会话
export const HANDLE_DELETE_CONVERSATIONS = 'HANDLE_DELETE_CONVERSATIONS'
// 路由前进时，请求新数据，路由后退时，不请求新数据
export const ROUTE_CHANGE = 'ROUTE_CHANGE'
// 从列表页前进时，需保存列表滚动高度(每个列表页的滚动容器是自定义的，因此不能用window的滚动高度代替)
export const SAVE_SCROLL = 'SAVE_SCROLL'
// 第三方分享进行交互操作，弹出需要注册或登录的对话框
export const SWITCH_INTEGRAL_DIALOG = 'SWITCH_INTEGRAL_DIALOG'
// 注册成功，领取积分弹窗
export const SWITCH_REGIST_DIALOG = 'SWITCH_REGIST_DIALOG'
// 登录成功或者注销成功，切换leancloud服务状态
export const SWITCH_LEANCLOUD_STATUS = 'SWITCH_LEANCLOUD_STATUS'
