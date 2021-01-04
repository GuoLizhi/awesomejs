组件挂载的过程主要分为两个阶段

1. init
2. mount

init阶段：主要初始化了options，computed，data之类。初始化Vue实例，并给实例绑定一些方法。出发了beforeCreate, created钩子

mount阶段：如果options中包含了el选项，Vue则会去调用实例上的$mount方法，去挂载DOM。核心代码如下

```js
function mountComponent(vm, el) {    
    new Watcher(vm, function() {
        vm._update(vm._render());
    })    
    return vm
}
function Watcher(vm, expOrFn) {    
    this.getter = expOrFn;    
    this.get();
}
Watcher.prototype.get = function() {
    value = this.getter(vm);
}
```

新建watcher之后，马上调用了一次get方法，也就是执行了一次`vm._update(vm._render())`方法。

- vm._render() 执行之前解析得到的渲染函数，返回一个VNode
- vm._update() 对比VNode，DIFF，挂载更新DOM