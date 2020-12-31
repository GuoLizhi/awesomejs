1. filters被解析成什么？

filters会被解析成渲染函数

```js
(function () {
  with (this) {
    return _c('div', [
      _v(_s(_f("all")(parentName)))
    ])
  }
})()
```

比如{{ parentName | all }}会被解析成_f("all")(parentName)

_f是具体的过滤器函数

2. filter如何被调用

_f会从当前实例的$options中的filters中，取出all指定的过滤器，比如上面的例子中就会取出all这个过滤器，执行之后会返回一个函数，这个函数再次传入parentName，执行就会得到最终的值。