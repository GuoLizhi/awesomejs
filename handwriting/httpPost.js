/**
 * 发送http post请求
 * @param url
 * @param data {Object} 向后台传递的数据
 * @param callback 成功的回调函数
 * @param err 失败的回调函数
 */
function httpPost(url, data, callback, err = console.error) {
  const request = new XMLHttpRequest();
  request.open("POST", url, true);
  request.setRequestHeader("Content-Type", "application/json;charset=utf-8");
  request.onload = () => callback(request.responseText);
  request.onerror = () => err(request);
  request.send(data);
}