CSRF跨站请求伪造：攻击者诱导受害者进入第三方网站，在第三方网站中，向被攻击网站发送跨站请求。利用受害者在被攻击网站已经获取的注册凭证，绕过后台的用户验证，达到冒充用户对被攻击的网站执行某项操作的目的。

几种常见类型的CSRF:

1. GET类型的CSRF
2. POST类型的CSRF
3. 链接类型的CSRF

防护策略

	1. 阻止不明外域的访问。比如同源检测和SameSite Cookie
 	2. 提交时要求附加本域才能获取的信息。比如CSRF TOKEN和双重cookie认证

浏览器的同源检测

1. Origin Header
2. Referer Header

CSRF Token: 用户的每一个请求都可以携带一个CSRF攻击者无法获取到的token，服务器校验请求是否携带正确token。具体的操作步骤如下：

1. 将CSRF Token输出到页面中
2. 页面提交请求携带这个token
3. 服务器验证token是否正确

双重cookie认证具体操作步骤如下

1. 用户访问网站时写入cookie（随机字符串）
2. 前端向后端发起请求时，在请求的URL上携带这个这个随机字符串
3. 后端接口校验URL上携带的与cookie中携带的是否相同

Samesite Cookie属性：

1. Strict 表明这个cookie在任何时候都不可能作为第三方cookie
2. Lax 如果当前请求是通过改变当前页面或者打开新页面，并且是GET请求，则这个cookie可以作为第三方cookie