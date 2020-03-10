class Utils {
  /**
   * 判断对象的数据类型
   * @param type String
   * @returns {function(*=): boolean}
   */
  static isType (type) {
    return function (target) {
      return `[object ${type}]` === Object.prototype.toString.call(target)
    }
  }

  /**
   * 隐藏页面上所有的隐藏元素
   * @param  {String} selector 元素选择器
   * @return {void}
   */
  static hideElement (selector) {
    const el = document.querySelectorAll(selector)
    Array.from(el).forEach(e => e.style.display = 'none')
  }

  /**
   * 检测一个元素上是否包含某个className
   * @param  {HTMLElement} el DOM元素
   * @param  {String} className
   * @return {Boolean}
   */
  static hasClass (el, className) {
    return el.classList.contains(className)
  }

  /**
   * 切换一个元素上的className，如果有则移除；没有就添加
   * @param  {HTMLElement} el DOM元素
   * @param  {String} className
   * @return {void}
   */
  static toggleClass (el, className) {
    el.classList.toggle(className)
  }

  /**
   * 获取当前页面的滚动位置
   * @param  {HTMLElement} el DOM元素
   * @return {Object} 返回页面的滚动位置
   */
  static getScrollPosition (el = window) {
    return {
      x: el.pageXOffset !== undefined ? el.pageXOffset : el.scrollLeft,
      y: el.pageYOffset !== undefined ? el.pageYOffset : el.scrollTop
    }
  }

  /**
   * 平滑的滚动到页面的顶部
   * @return {void}
   */
  static scrollToTop () {
    const c = document.documentElement.scrollTop || document.body.scrollTop
    if (c > 0) {
      window.requestAnimationFrame(Utils.scrollToTop)
      window.scroll(0, c - c /8);
    }
  }

  /**
   * 判断父元素是否包含子元素
   * @param parent {HTMLElement} 父元素
   * @param child {HTMLElement} 子元素
   * @return {boolean}
   */
  static elementContains (parent, child) {
    return parent !== child && parent.contains(child)
  }

  /**
   * 检查指定的元素在视口中是否可见
   * @param el {HTMLElement} 指定的元素
   * @param partiallyVisible {boolean} 是否部分可见
   */
  static elementIsVisibleInViewport (el, partiallyVisible = false) {
    const { top, left, bottom, right } = el.getBoundingClientRect()
    const { innerHeight, innerWidth } = window
    return partiallyVisible
      ? ((top > 0 && top < innerHeight) || (bottom > 0 && bottom < innerHeight)) &&
        ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
      : top >= 0 && left >=0 && bottom <= innerHeight && right <= innerWidth
  }

  /**
   * 获取页面上所有的图片
   * @param el {HTMLElement} 包裹的元素
   * @param includeDuplicates 是否包含重复元素
   * @return {string[]} 返回所有图片url
   */
  static getImages (el, includeDuplicates = false) {
    const images = [...el.getElementsByTagName('img')].map(img => img.getAttribute('src'))
    return includeDuplicates ? images : [...new Set(images)]
  }

  /**
   * 判断当前处于移动端还是桌面端
   * @return {string}
   */
  static detectDeviceType () {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      ? 'Mobile'
      : 'Desktop'
  }

  /**
   * 创建一个包含当前URL参数的对象
   * @param url {String}
   * @return {Object}
   */
  static getURLParameters (url) {
    return (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
      (a, v) => ((a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a),
      {}
    )
  }

  /**
   * 将一组表单元素转化为对象
   * @param form {HTMLFormElement} 表单对象
   * @return {Object}
   */
  static formToObject (form) {
    return Array.from(new FormData(form)).reduce((acc, [key, value]) => {
      return {
        ...acc,
        [key]: value
      }
    }, {})
  }

  /**
   * 在给定元素上触发特定事件且能选择地传递自定义数据
   * @param el {HTMLElement}
   * @param eventType {String}
   * @param detail {*}
   * @return {void}
   */
  static triggerEvent (el, eventType, detail) {
    el.dispatchEvent(new CustomEvent(eventType, { detail }))
  }

  /**
   * 创建一个文件夹
   * @param dir {String} 文件夹的名称
   */
  static createDirIfNotExists (dir) {
    const fs = require('fs')
    !fs.existsSync(dir) ? fs.mkdirSync(dir) : undefined
  }

  /**
   * 判断浏览器选项卡是否聚焦
   * @return {boolean}
   */
  static isBrowserTabFocused () {
    return !document.hidden
  }

  /**
   * 将字符串复制到剪切板
   * @param str {String} 需要复制的字符串
   */
  static copyToClipboard (str) {
    const el = document.createElement('textarea')
    el.value = str
    el.setAttribute('readonly', '')
    el.style.position = 'absolute'
    el.style.left = '-9999px'
    document.body.appendChild(el)
    const selected = document.getSelection().rangeCount > 0 ?
      document.getSelection().getRangeAt(0) : false
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    if (selected) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected)
    }
  }

  /**
   * 发送http post请求
   * @param url
   * @param data {Object} 向后台传递的数据
   * @param callback 成功的回调函数
   * @param err 失败的回调函数
   */
  static httpPost (url, data, callback, err = console.error) {
    const request = new XMLHttpRequest()
    request.open('POST', url, true)
    request.setRequestHeader('Content-Type', 'application/json;charset=utf-8')
    request.onload = () => callback(request.responseText)
    request.onerror = () => err(request)
    request.send(data)
  }

  /**
   * 发送http post请求
   * @param url
   * @param callback 成功回调函数
   * @param err 失败回调函数
   */
  static httpGet (url, callback, err = console.error) {
    const request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.onload = () => callback(request.responseText)
    request.onerror = () => err(request)
    request.send()
  }
}
