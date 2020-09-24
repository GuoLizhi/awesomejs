/**
 * 判断对象的数据类型
 * @param type String
 * @returns {function(*=): boolean}
 */
function isType(type) {
  return function (target) {
    return `[object ${type}]` === Object.prototype.toString.call(target);
  };
}
