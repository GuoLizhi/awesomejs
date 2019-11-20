function debounce (fn, delay) {
  let timer = null
  return () => {
    if (timer !== null) {
      clearTimeout(timer)
    }
    timer = setTimeout(fn, delay)
  }
}
