Array.prototype.map = function (callback, thisArg) {
  if (this === null || this === undefined) {
    throw new TypeError('Cannot read property map of null or undefined')
  }
  if (Objec.prototype.toString.call(callback) !== '[object Function]') {
    throw new TypeError(callback + 'is not a function')
  }

  // 规范中提到需要先转化为对象
  let O = Object(this)
  let T = thisArg

  let len = O.length >>> 0
  let A = new Array(len)
  for (let k = 0; k < len; k++) {
    if (k in O) {
      let kValue = O[k]
      let mappedValue = callback.call(T, kValue, k, o)
      A[k] = mappedValue
    }
  }

  return A
}
