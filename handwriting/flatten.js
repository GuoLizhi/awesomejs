/**
 * 将数组扁平化
 * @param {Array} arr
 * @return {Array} 返回扁平化之后的数组
 */
function flatten(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      result = result.concat(flatten(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}