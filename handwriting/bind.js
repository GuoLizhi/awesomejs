/**
 * 手动实现一个bind
 * bind的主要用途是绑定函数执行时的this
 */
Function.prototype.myBind = function (context) {
  context = context || window
  context.fn = this
  const args = [...arguments].slice(1)
  return function () {
    const result = context.fn(...args)
    delete context.fn
    return result
  }
}
