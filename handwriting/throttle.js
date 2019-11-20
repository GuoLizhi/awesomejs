function throttle (fn, delay) {
  let timer = null
  return function () {
    const context = this
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(context, arguments)
        timer = null
      }, delay)
    }
  }
}
