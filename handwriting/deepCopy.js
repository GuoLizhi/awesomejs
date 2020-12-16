/**
 * 简易版的深拷贝
 * @param {*} obj
 */
function deepCopy(obj) {
  let result
  if (typeof obj === "object") {
    result = obj.constructor === Array ? [] : {};
    for (let i in obj) {
      result[i] = typeof obj[i] === "object" ? deepCopy(obj[i]) : obj[i];
    }
  } else {
    result = obj;
  }
  return result;
}
