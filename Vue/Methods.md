1. methods是如何通过this来访问的

直接遍历methods，将上面的方法一个个复制到Vue实例上

2. methods是如何固定作用域的

Vue使用了bind去绑定methods的作用域，并且对于浏览器的兼容性，Vue也实现了相关的polyfill

```js
function polyfillBind(fn, ctx) {
  function boundFn(a) {
    var l = arguments.length
    return l ? (
      l > 1 ?
      fn.apply(ctx, arguments) :
      fn.call(ctx, a)
    ) : fn.call(ctx)
  }
}
```

