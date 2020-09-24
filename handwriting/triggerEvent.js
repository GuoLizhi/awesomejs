/**
 * 在给定元素上触发特定事件且能选择地传递自定义数据
 * @param el {HTMLElement}
 * @param eventType {String}
 * @param detail {*}
 * @return {void}
 */
function triggerEvent(el, eventType, detail) {
  el.dispatchEvent(new CustomEvent(eventType, { detail }));
}