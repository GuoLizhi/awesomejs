/**
 * 节流函数
 * 节流函数的用途：比如避免用户频繁的触发input事件
 * 以下采用的是时间戳写法，第一次会立即执行
 * 
 * @param {Function} fn 节流的回调函数
 * @param {Number} interval 延迟的时间
 */
function throttle(fn, interval) {
  let prev = 0
  return function () {
    const curr = Date.now();
    if (curr - prev >= interval) {
      prev = curr;
      return fn.apply(this, arguments);
    }
  }
}

/**
 * 节流函数升级版，避免函数一开始就立即执行
 * @param {Function} fn 节流的回调函数
 * @param {Number} delay 延迟的时间
 */
function throttle2(fn, interval) {
  let timer = null
  return function () {
    const context = this
    const args = arguments
    if (!timer) {
      timer = setTimeout(function() {
        fn.apply(context, args)
        timer = null
      }, interval)
    }
  }
}

/**
 * 节流函数继续升级版，让时间控制方面更加精确
 * @param {Function} fn 节流的回调函数
 * @param {Number} delay 延迟的时间
 */
function throttle3(fn, interval) {
  let timer = null
  let startTime = new Date().getTime()
  return function() {
    const context = this
    const args = arguments
    let currentTime = new Date().getTime()
    let remainTime = interval - (currentTime - startTime)
    if (remainTime <= 0) {
      fn.call(context, args)
      startTime = Date.now()
    } else {
      timer = setTimeout(fn, remainTime)
    }
  }
}
