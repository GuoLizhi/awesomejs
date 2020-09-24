/**
 * bind实现原理
 * @param {Object} context 需要绑定的上下文执行环境
 */
Function.prototype.myBind = function (context = window) {
  if (typeof this !== "function") {
    throw new Error("Only function can call this method!");
  }
  const args = [...arguments].slice(1);
  return function () {
    return fn.apply(context, args.concat(...arguments));
  };
};
