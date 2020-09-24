/**
 * 数组去重
 * @param {Array} arr
 * @return {Array} 去重后的数组
 */
function unique(arr) {
  return Array.from(new Set(arr));
}