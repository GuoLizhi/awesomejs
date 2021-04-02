/**
 * 手写String.prototype.trim()
 */
String.prototype._trim = function () {
  const len = this.length
  if (len === 0) return ''
  let start = 0
  let end = len - 1
  while (start <= end) {
    if (this[start] !== ' ') break
    start++
  }
  while (start <= end) {
    if (this[end] !== ' ') break
    end--
  }
  console.log(start, end)
  return this.slice(start, end)
}
