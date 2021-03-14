/**
 * 检测一个对象大小
 * number -> 固定8字节
 * string -> 2字节
 * boolean -> 固定4字节
 */
const seen = new WeakSet()
function sizeOf(obj) {
  const type = typeof obj
  switch (type) {
    case 'string':
      return obj.length * 2
    case 'number':
      return 8
    case 'boolean':
      return 4
    case 'object':
      if (Array.isArray(obj)) {
        return obj.map(sizeOf).reduce((res, curr) => {
          return res + curr
        }, 0)
      } else {
        if (obj === null) return 0
        let bytes = 0
        // 对象里的key也是占用空间的
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
          if (typeof obj[keys[i]] === 'object' && typeof obj[keys[i]] !== null) {
            bytes += sizeOf(keys[i])
            if (seen.has(obj[keys[i]])) {
              continue
            }
            bytes += sizeOf(obj[keys[i]])
          }
        }
      }
    default:
      return 0
  }
}