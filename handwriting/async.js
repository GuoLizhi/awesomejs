/**
 * 使用generator来实现async/await
 * @param {Function} generator 
 */
function asyncFunc(generator) {
  const gen = generator()

  // 通过递归调用next方法，将gen执行到底
  function next(data) {
    const { value, done } = gen.next()
    if (done) {
      return value
    } else if (!(value instanceof Promise)) {
      next(value)
    } else {
      value.then(data => next(data))
    }
  }
  next()
}
