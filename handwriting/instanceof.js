/**
 * 手动实现一个instanceof
 * 实现instanceof是一个不断在原型链上查找的过程
 * 不断的用实例上的__proto__与所需要比较对象的prototype相比较
 */
function myInstanceof (left, right) {
  while (left.__proto__) {
    if (left.__proto__ === right.prototype) {
      return true
    } else {
      left = left.__proto__
    }
  }
  return false
}
