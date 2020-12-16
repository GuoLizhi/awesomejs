/**
 * 发送http post请求
 * @param url
 * @param callback 成功回调函数
 * @param err 失败回调函数
 */
function httpGet(url, callback, err = console.error) {
  const request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.onload = () => callback(request.responseText);
  request.onerror = () => err(request);
  request.send();
}