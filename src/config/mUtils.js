/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}

/**
 * 获取localStorage
 */
export const getStore = name => {
  if (!name) return
  return window.localStorage.getItem(name)
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (!name) return
  window.localStorage.removeItem(name)
}

/**
 * 显示返回顶部按钮，开始、结束、运动 三个过程中调用函数判断是否达到目标点
 */
export const showBack = (callback, height) => {
  let requestFram
  let oldScrollTop
  this.callback = callback
  this.height = height

  document.addEventListener('scroll', () => {
    showBackFun()
  }, false)
  document.addEventListener('touchstart', () => {
    showBackFun()
  }, { passive: true })

  document.addEventListener('touchmove', () => {
    showBackFun()
  }, { passive: true })

  document.addEventListener('touchend', () => {
    oldScrollTop = document.body.scrollTop
    moveEnd()
  }, { passive: true })

  const moveEnd = () => {
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

  // 判断是否达到目标点
  const showBackFun = () => {
    if (document.body.scrollTop > this.height) {
      this.callback(true)
    } else {
      this.callback(false)
    }
  }
}
