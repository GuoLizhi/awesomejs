/**
 * apply实现原理
 * @param {Object} context 需要绑定的上下文执行环境
 */
Function.prototype.myApply = function (context = window) {
  if (typeof this !== "function") {
    throw new Error("Only function can call this method!");
  }
  let result;
  context.fn = this;
  if (arguments[1]) {
    result = context.fn(arguments[1]);
  } else {
    result = context.fn();
  }
  delete context.fn;
  return result;
};
