/**
 * instanceOf实现原理
 * 核心原理：不断向上查找left的原型，与right的prototype进行对比。
 * 如果期间遇到相等的那说明left就是right的实例。一旦left的prototype变为null，说明已经查找到原型链的顶端了，返回false
 * @param {Function} left 
 * @param {Function} right 
 */
function instanceOf (left, right) {
  let lProto = left.__proto__;
  let rProto = right.prototype;
  while (true) {
    if (lProto === null) return false;
    if (lProto === rProto) return true;
    lProto = lProto.__proto__;
  }
}
