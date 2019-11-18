/**
 * 手动实现一个new
 * 1. 创建一个对象
 * 2. 将这个对象的__proto__属性执行构造函数的prototype
 * 3. 执行构造函数，绑定this执行环境
 * 4. 返回这个新创建的对象
 */
function myNew() {
  const obj = {}
  const constructor = Array.prototype.shift.call(arguments)
  constructor.call(obj, arguments)
  return obj
}
