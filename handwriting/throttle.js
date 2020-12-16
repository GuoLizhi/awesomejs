/**
 * 节流函数
 * @param {Object} fn 节流的回调函数
 * @param {Number} delay 延迟的时间
 */
function throttle(fn, delay) {
  let prev = Date.now();
  return function () {
    const context = this;
    const curr = Date.now();
    if (curr - prev >= delay) {
      prev = curr;
      return fn.apply(context, arguments);
    }
  };
}
