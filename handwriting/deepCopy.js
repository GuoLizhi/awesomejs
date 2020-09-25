/**
 * 简易版的深拷贝
 * @param {*} obj 
 */
function deepCopy(obj) {
  if (typeof obj === "object") {
    var result = obj.constructor === Array ? [] : {};
    for (let i in obj) {
      result[i] = typeof obj[i] === "object" ? deepCopy(obj[i]) : obj[i];
    }
  } else {
    var result = obj;
  }
  return result;
}
