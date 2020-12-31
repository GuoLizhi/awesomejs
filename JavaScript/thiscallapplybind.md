this的指向分为如下几种情况

1. 全局上下文，指向window
2. 函数上下文
   1. 直接调用
   2. call/apply方式调用
   3. bind
3. 箭头函数，箭头函数中没有this。指向的是外城
4. 作为对象的一个方法调用，this指向该对象
5. 作为一个构造函数，this指向new的那个对象
6. 作为一个DOM事件处理函数，this指向事件处理程序所绑定到的DOM节点
7. 作为HTML标签内联事件处理函数，this指向所在的DOM节点

```js
Function.prototype.call2 = function(context) {
  context = context || window
  context.fn = this
  var args = []
  for (var i = 1; i < arguments.length; i++) {
    args.push('arguments[' + i + ']')
  }
  var result = eval('context.fn(' + args + ')')
  delete context.fn
  return result
}

Function.prototype.apply2 = function(context, args) {
  context = context || window
  context.fn = this
  var result
  if (!args) {
    result = context.fn()
  } else {
    var arr = []
    for (var i = 0; i < args.length; i++) {
      arr.push('args[' + i + ']')
    }
    result = eval('context.fn(' + arr + ')')
  }
  delete context.fn
  return result
}

Function.prototype.bind2 = function (context) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);
  var fNOP = function () {};
  var fBound = function () {
    var bindArgs = Array.prototype.slice.call(arguments);
    return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
  }
  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();
  return fBound;
}
```

