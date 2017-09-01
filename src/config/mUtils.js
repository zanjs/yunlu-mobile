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
 * 删除sessionStorage
 */
export const removeStore = name => {
  if (!name) return
  window.sessionStorage.removeItem(name)
}

/**
 * 删除所有的localStorage
 */
export const removeAllStore = () => {
  window.sessionStorage.clear()
}

/**
 * 显示返回顶部按钮，开始、结束、运动 三个过程中调用函数判断是否达到目标点
 */
export const showBack = (callback, height) => {
  let requestFram
  let oldScrollTop
  this.callback = callback

  // 判断是否达到目标点
  const showBackFun = () => {
    let self = this
    if (document.body.scrollTop > height) {
      self.callback(true)
    } else {
      self.callback(false)
    }
  }

  const moveEnd = () => {
    oldScrollTop = document.body.scrollTop
    requestFram = requestAnimationFrame(() => {
      if (document.body.scrollTop !== oldScrollTop) {
        oldScrollTop = document.body.scrollTop
        moveEnd()
      } else {
        cancelAnimationFrame(requestFram)
      }
      showBackFun()
    })
  }

  document.removeEventListener('scroll', showBackFun, false)

  document.removeEventListener('touchstart', showBackFun, { passive: true, once: true })

  document.removeEventListener('touchmove', showBackFun, { passive: true, once: true })

  document.removeEventListener('touchend', moveEnd, { passive: true, once: true })

  document.addEventListener('scroll', showBackFun, false)

  document.addEventListener('touchstart', showBackFun, { passive: true, once: true })

  document.addEventListener('touchmove', showBackFun, { passive: true, once: true })

  document.addEventListener('touchend', moveEnd, { passive: true, once: true })
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
