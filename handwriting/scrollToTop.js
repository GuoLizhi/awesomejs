/**
 * 平滑的滚动到页面的顶部
 * @return {void}
 */
function scrollToTop() {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scroll(0, c - c / 8);
  }
}