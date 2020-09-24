/**
 * 获取当前页面的滚动位置
 * @param  {HTMLElement} el DOM元素
 * @return {Object} 返回页面的滚动位置
 */
function getScrollPosition(el = window) {
  return {
    x: el.pageXOffset !== undefined ? el.pageXOffset : el.scrollLeft,
    y: el.pageYOffset !== undefined ? el.pageYOffset : el.scrollTop,
  };
}