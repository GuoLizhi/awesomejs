/**
 * 控制最大并发数量
 * @param {Array} urls 请求的url数组
 * @param {Function} handler 回调函数
 * @param {Number} limit 最大并发
 */
function limitLoad(urls, handler, limit) {
  // 对数组进行拷贝
  const sequence = [].concat(urls)

  // 先将请求数量并发到最大
  const promises = sequence.splice(0, limit).map((url, index) => {
    // 这里返回的index可以作为promises的角标
    return handler(url).then(() => {
      return index
    })
  })

  let p = Promise.race(promises)
  for (let i = 0; i < sequence.length; i++) {
    // 这里的then中的res就是上面返回的index
    p = p.then(res => {
      // 因为第res个最快执行完毕，因此现在将其替换成最新的
      promises[res] = handler(sequence[i]).then(() => {
        return res
      })
      return Promise.race(promises)
    })
  }
}