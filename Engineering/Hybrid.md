### 1. JavaScript通知Native

通常有3中方式

1. API注入，Native直接获取JavaScript上下文，并且在里面挂载对象或者方法，使js可以直接调用
2. Webview中的方法拦截，比如prompt/alert，通常使用prompt，因为这个在前端使用频率几乎为0
3. Webview URL Schema拦截跳转

