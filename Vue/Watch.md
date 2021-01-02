1. watch初始化过程？

watch初始化时，也会遍历当前组件options中的watch，对每一个键都进行createWatcher操作。createWatcher会进行两个操作

1. 获取到watcher的回调
2. 调用$watch

$watch方法是Vue中的一个核心部分，用来初始化Watcher

```js
Vue.prototype.$watch = function (
  // expOrFn 是 监听的 key，cb 是监听回调，opts 是所有选项
  expOrFn, cb, opts
) {
  // 每个watch都会配置一个watcher
  var watcher = new Watcher(this, expOrFn, cb, opts);
  // 设定了立即执行，就马上执行回调
  if (opts.immediate) {
    cb.call(this, watcher.value);
  }
}
```

2. 怎么确定监听哪些值

```js
var Watcher = function (vm, key, cb, opt) {
  this.vm = vm;
  this.deep = opt.deep;
  this.cb = cb;
  // 这里省略处理 xx.xx.xx 这种较复杂的key
  this.getter = function (obj) {
    return obj[key]
  };
  // this.get 作用就是执行 this.getter函数
  this.value = this.get();
};
Watcher.prototype.get = function () {
  var value = this.getter(this.vm);
  return value
};
```

当执行watcher.getter的时候，就会读取data中的xxx，当data中的xxx发生变化时，就会通知这个watcher进行更新。

2. 深度监听的流程

深度监听的原理比较简单，Vue会对传入的key进行深度遍历，当这个key对应的对象内部任意一个值发生变化时，通会通知watcher进行更新

3. 如何触发监听函数

上面已经分析过，当data中的xxx属性发生变化时，会通知watch的watcher进行更新，而watcher更新实际上是调用的watcher上的update方法。而update方法做的事情也比较简单

1. 再次调用watcher原型上的get方法
2. 调用之间保存的watch回调

```js
Watcher.prototype.update= function() {    
    var value = this.get();    
    if (this.deep) {        
        var oldValue = this.value;        
        this.value = value;        
        // cb 是监听回调
        this.cb.call(this.vm, value, oldValue);
    }
}
```

