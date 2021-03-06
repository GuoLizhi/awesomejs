/**
 * 函数柯里化
 * @param {Function} fn 需要被柯里化的函数
 * @param {Array} args 参数
 */
function curry(fn, args = []) {
  var length = fn.length;
  var context = this
  return function () {
    newArgs = args.concat(Array.prototype.slice.call(arguments));
    // 如果当前函数的参数，小于总共所需要的参数
    // 则直接递归处理
    if (newArgs.length < length) {
      return curry.call(context, fn, newArgs);
    } else {
      return fn.apply(this, newArgs);
    }
  };
}
