/**
 * instanceOf实现原理
 * @param {Function} left 
 * @param {Function} right 
 */
function instanceOf (left, right) {
  let lProto = left.__proto__;
  let rProto = right.prototype;
  while (true) {
    if (lProto === null) return false;
    if (lProto === rProto) return true;
    lProto = rProto.__proto__;
  }
}
