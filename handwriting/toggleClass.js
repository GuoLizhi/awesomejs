/**
 * 切换一个元素上的className，如果有则移除；没有就添加
 * @param  {HTMLElement} el DOM元素
 * @param  {String} className
 * @return {void}
 */
function toggleClass(el, className) {
  el.classList.toggle(className);
}
