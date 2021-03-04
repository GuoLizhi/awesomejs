/**
 * 防抖函数
 * 防抖用途：比如避免频繁触发页面的scroll, resize事件
 * 
 * @param {Function} fn 防抖的回调函数
 * @param {Number} wait 时间间隔
 */
function debounce(fn, wait) {
  let timer = null;
  return function() {
    const context = this;
    // 如果此时存在定时器，则清掉定时器，重新计时
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(context, arguments);
    }, wait);
  }
}