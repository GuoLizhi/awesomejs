### 1. CSRF简介

CSRF跨站请求伪造：攻击者诱导受害者进入第三方网站，在第三方网站中，向被攻击网站发送跨站请求。利用受害者在被攻击网站已经获取的注册凭证，绕过后台的用户验证，达到冒充用户对被攻击的网站执行某项操作的目的。

### 2. CSRF形成的步骤

1. 用户登录网站a.com，并保留了登录凭证
2. 在未登出a.com的情况下，被攻击者诱导点击访问了b.com，并且携带了用户在a.com中的登录凭证
3. 在b.com中，向a.com的网站后台发送了请求，并携带了a.com的登录凭证
4. a.com的网站后台以为是a.com的网站前端发出的请求，并成功执行了这个请求
5. 完成攻击

### 3. 几种常见类型的CSRF

1. GET类型的CSRF，比如常见的图片链接

```html
<img src="http://hacker.com/amount=100"/>
```

2. POST类型的CSRF，比如表单自动提交

```html
<form method="post">
	<input type="hidden" name="amount" value="100">
</form>
<script>
	document.forms[0].submit()
</script>
```

访问这个页面之后，表单会自动提交，从上面的例子可以看出POST请求并不是完全可靠的。

3. 链接类型的CSRF，这种类型的CSRF需要用户点击才可以被攻击，一般出现在论坛的某些恶意诱导链接

```html
<a href="http://hacker.com/amount=100">重磅消息</a>
```

### 4. 防护策略

1. 阻止不明外域的访问。比如同源检测和SameSite Cookie
2. 提交时要求附加本域才能获取的信息。比如CSRF TOKEN和双重cookie认证

#### 4.1 浏览器的同源检测

1. Origin Header
2. Referer Header

以上两个http请求的header都在请求头中，会自动携带，后端可以先根据这两个信息来判断是否是可信域过来的请求

CSRF Token: 用户的每一个请求都可以携带一个CSRF攻击者无法获取到的token，服务器校验请求是否携带正确token。具体的操作步骤如下：

1. 将CSRF Token输出到页面中
2. 页面提交请求携带这个token
3. 服务器验证token是否正确

双重cookie认证具体操作步骤如下

1. 用户访问网站时写入cookie（随机字符串）
2. 前端向后端发起请求时，在请求的URL上携带这个这个随机字符串
3. 后端接口校验URL上携带的与cookie中携带的是否相同

> 这种方式虽然简单，但是也存在一定的局限性。比如前端网站的地址为`www.a.com`，调用后台接口的地址`api.a.com`。此时cookie存在于`www.a.com`中，而`api.a.com`就访问不到。于是认证的cookie就必须放在`a.com`这个域名下，这样每个子域都可以访问。如果某个子域名存在XSS攻击，那这样也会不安全。

Samesite Cookie属性：

1. Strict 表明这个cookie在任何时候都不可能作为第三方cookie
2. Lax 如果当前请求是通过改变当前页面或者打开新页面，并且是GET请求，则这个cookie可以作为第三方cookie

比如用户从`a.com`到`b.com`时，如果SameSite如果设置的时Lax，此时仍然可以利用到a.com的cookie。但如果是表单构造的post请求，那此时cookie将不会被携带。

Samesite Cookie缺点：

1. 兼容性差
2. 不支持子域，如果网站会在多个子域间跳转，那此时每个子域都需要登录

