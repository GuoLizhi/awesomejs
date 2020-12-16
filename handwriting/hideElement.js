/**
 * 隐藏页面上所有的隐藏元素
 * @param  {String} selector 元素选择器
 * @return {void}
 */
function hideElement(selector) {
  const el = document.querySelectorAll(selector);
  Array.from(el).forEach((e) => (e.style.display = "none"));
}