/**
 * 检测浏览器是否支持webp
 */
function checkWebp() {
  try {
    return document.createElement('canvas')
      .toDataURL('image/webp') // 将canvas转化为webp格式图片，base64编码
      .indexOf('data:image/webp') === 0
  } catch (e) {
    return false
  }
}