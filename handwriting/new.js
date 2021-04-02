/**
 * new实现原理
 * 具体步骤
 * 1. 新建一个对象
 * 2. 获取到参数中的构造函数
 * 3. 将新建对象的原型，指向构造函数的原型
 * 4. 执行构造函数，如果返回的是对象，那么最终新建的就是这个返回的对象，否则就是之前新建的那个对象
 */
function myNew () {
  const obj = {}
  const ctor = Array.prototype.shift.call(arguments)
  obj.__proto__ = ctor.prototype
  const ret = ctor.apply(obj, arguments)
  return typeof ret === 'object' ? ret : obj
}