/**
 * 手动实现一个apply
 * apply的主要用途是绑定函数执行时的this
 */
Function.prototype.myApply = function (context) {
  context = context || window
  context.fn = this
  const args = Array.prototype.slice.call(arguments, 1)

  let result = null
  if (Array.isArray(args[0])) {
    result = context.fn(...args[0])
  } else {
    result = context.fn()
  }
  return result
}
