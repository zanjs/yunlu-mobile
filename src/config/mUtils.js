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
  return JSON.parse(window.sessionStorage.getItem(name))
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
