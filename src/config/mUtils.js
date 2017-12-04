/**
 * 存储sessionStorage
 */
export const setStore = (name, content) => {
  if (!name) {
    return false
  }
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.sessionStorage.setItem(name, content)
}

/**
 * 存储localStorage
 */
export const setLocalStore = (name, content) => {
  if (!name) {
    return false
  }
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}

/**
 * 获取sessionStorage
 */
export const getStore = name => {
  if (!name) {
    return false
  }
  try {
    return JSON.parse(window.sessionStorage.getItem(name))
  } catch (error) {
    return window.sessionStorage.getItem(name)
  }
}

/**
 * 获取localStorage
 */
export const getLocalStore = name => {
  if (!name) {
    return false
  }
  try {
    return JSON.parse(window.localStorage.getItem(name))
  } catch (error) {
    return window.localStorage.getItem(name)
  }
}

/**
 * 删除sessionStorage
 */
export const removeStore = name => {
  if (!name) {
    return false
  }
  window.sessionStorage.removeItem(name)
}

/**
 * 删除localStorage
 */
export const removeLocalStore = name => {
  if (!name) {
    return false
  }
  window.localStorage.removeItem(name)
}

/**
 * 删除所有的sessionStorage
 */
export const removeAllStore = () => {
  window.sessionStorage.clear()
}

/**
 * 删除所有的localStorage
 */
export const removeAllLocalStore = () => {
  window.localStorage.clear()
}

/**
 * 获取scrollTop的值，兼容所有浏览器
 */
export const getScrollTop = (dom) => {
  if (dom) {
    return dom.scrollTop
  } else {
    let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
    return scrollTop
  }
}

/**
 * 设置scrollTop的值，兼容所有浏览器
 * @param {Number} scrollTop 距离窗口顶部的高度
 */
export const setScrollTop = (scrollTop = 0, dom) => {
  if (dom) {
    dom.scrollTop = scrollTop
    // 滚动容器有padding，滚动视图时，会导致document.body一同滚动一定的距离(padding或margin的值)
    document.documentElement.scrollTop = scrollTop
    document.body.scrollTop = scrollTop
  } else {
    if (document.body.scrollTop === 0) {
      document.documentElement.scrollTop = scrollTop
    } else {
      document.body.scrollTop = scrollTop
    }
  }
}

/**
 * 显示返回顶部按钮，开始、结束、运动 三个过程中调用函数判断是否达到目标点
 */
export const showBack = (callbackFn, height, dom, delay = 200, duration = 200) => {
  let requestFram
  let oldScrollTop
  // 判断是否达到目标点
  const showBackFun = () => {
    if (getScrollTop(dom) > height) {
      callbackFn(true)
    } else {
      callbackFn(false)
    }
  }

  const moveEnd = () => {
    oldScrollTop = getScrollTop(dom)
    requestFram = requestAnimationFrame(() => {
      if (getScrollTop(dom) !== oldScrollTop) {
        oldScrollTop = getScrollTop(dom)
        moveEnd()
      } else {
        cancelAnimationFrame(requestFram)
      }
      showBackFun()
    })
  }

  if (dom) {
    dom.addEventListener('scroll', throttle(showBackFun, delay, duration))
    dom.addEventListener('touchmove', throttle(showBackFun, delay, duration))
    dom.addEventListener('touchend', throttle(showBackFun, delay, duration))
  }
}

export const isPc = () => {
  let userAgentInfo = navigator.userAgent
  let agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
  let flag = true
  for (let v = 0; v < agents.length; v++) {
    if (userAgentInfo.indexOf(agents[v]) > 0) {
      flag = false
      break
    }
  }
  return flag
}

export const mobileClient = () => {
  let ua = navigator.userAgent.toLowerCase()
  if (ua.indexOf('micromessenger') > -1) {
    return 'weixin'
  } else if (ua.indexOf('weibo') > -1) {
    return 'weibo'
  } else if (ua.indexOf('mqqbrowser') > -1) {
    return 'qq'
  } else {
    return 'login' // 如果不能判断当前浏览器环境，则跳转登录页，由用户自行选择授权方式
  }
}

export const throttle = (method, delay, time) => {
  let timeOut = null
  let startTime = new Date()
  return () => {
    let curTime = new Date()
    clearTimeout(timeOut)
    // 如果达到了规定的触发时间间隔，触发 handler
    if (curTime - startTime >= time) {
      method.apply(this, arguments)
      startTime = curTime
    // 没达到触发间隔，重新设定定时器
    } else {
      timeOut = setTimeout(method, delay)
    }
  }
}
