/**
 * 手动实现一个call
 * call的主要用途是绑定函数执行时的this
 */
Function.prototype.myCall = function (context) {
  context = context || window
  context.fn = this
  const args = Array.prototype.slice.call(arguments, 1)
  console.log(args)
  const result = context.fn(...args)
  delete context.fn
  return result
}
