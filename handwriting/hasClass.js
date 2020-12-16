/**
 * 检测一个元素上是否包含某个className
 * @param  {HTMLElement} el DOM元素
 * @param  {String} className
 * @return {Boolean}
 */
function hasClass(el, className) {
  return el.classList.contains(className);
}