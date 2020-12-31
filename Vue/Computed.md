1. computed初始化的过程中发生了什么？

每一个computed属性都会配置一个watcher,getter保存着computed当前属性的计算函数（简单的说：就是当我们调用这个getter时，就可以获取此时最新的computed值）

```js
watchers[key] = new Watcher(vm, getter, { lazy: true })

// 对应的Watcher类的代码
function Watcher(vm, expOrFn, options) {
  this.getter = expOrFn
  this.dirty = options.lazy
  this.lazy = options.lazy
  this.value = this.lazy ? undefined : this.get()
}
```

我们将当前computed的计算函数保存在了Watcher中，方便后面计算，由于我们传入了lazy属性，不会马上就计算出watcher.value的值

以上代码中dirty表示缓存是否可用，如果为true表示缓存脏了，需要重新计算。



2. 当computed依赖了data中的数据，data发生变化时，如何触发computed的更新？

当computed中的属性C依赖了data中的属性D，属性D就会收集到C的watcher。当D发生变化时，会触发watcher的update方法，将C的watcher的dirty属性设置为true，再次读取C时，就会重新调用之前watcher中保存的计算函数，从而获取到新的值



3. 当页面依赖了computed，而computed又依赖了data时，如果data发生变化，页面的更新流程？

首先我们需要知道computed中的属性其实使用Object.defineProperty()包装过的，当触发computed属性的get时，会经历如下过程：

1. 当computed属性的watcher.dirty为true时，会重新计算watcher.value
2. 让computed属性收集到当前页面的wathcer
3. 最后返回最新的watcher.value

因此，当data发生变化时，会通知页面watcher更新，页面watcher会重新执行本watcher中保存的计算函数，从而读取到最新的computed