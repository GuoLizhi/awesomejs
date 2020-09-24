/**
 * 判断父元素是否包含子元素
 * @param parent {HTMLElement} 父元素
 * @param child {HTMLElement} 子元素
 * @return {boolean}
 */
function elementContains(parent, child) {
  return parent !== child && parent.contains(child);
}