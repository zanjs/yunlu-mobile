/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) {
    return false
  }
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}

/**
 * 获取localStorage
 */
export const getStore = name => {
  if (!name) {
    return false
  }
  return JSON.parse(window.localStorage.getItem(name))
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (!name) return
  window.localStorage.removeItem(name)
}

/**
 * 删除所有的localStorage
 */
export const removeAllStore = () => {
  window.localStorage.clear()
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

  document.addEventListener('scroll', showBackFun, false)

  document.addEventListener('touchstart', showBackFun, { passive: true, once: true })

  document.addEventListener('touchmove', showBackFun, { passive: true, once: true })

  document.addEventListener('touchend', moveEnd, { passive: true, once: true })
}
