/**
 * new实现原理
 */
function myNew () {
  const obj = {}
  const ctor = Array.prototype.shift.call(arguments)
  obj.__proto__ = ctor.prototype
  const ret = ctor.apply(obj, arguments)
  return typeof ret === 'object' ? ret : obj
}