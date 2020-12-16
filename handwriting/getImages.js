/**
 * 获取页面上所有的图片
 * @param el {HTMLElement} 包裹的元素
 * @param includeDuplicates 是否包含重复元素
 * @return {string[]} 返回所有图片url
 */
function getImages(el, includeDuplicates = false) {
  const images = [...el.getElementsByTagName("img")].map((img) =>
    img.getAttribute("src")
  );
  return includeDuplicates ? images : [...new Set(images)];
}