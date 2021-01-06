1. 为什么频繁更新，最终只更新一次？

Vue中有一个has的map，用来过滤watcher，当这个watcher已经调用了更新函数，那么就在has中标记这个id，也就是说同时调用多次watcher.update，其实只有第一次调用有用，后面的都会被过滤掉

2. Vue中的nextTick做了什么？

```js
Vue.nextTick = function (cb, ctx) {
  callbacks.push(function () {
    cb && cb.call(ctx);
  });

  if (!pending) {
    pending = true;
    if (useMacroTask) {
      macroTimerFunc();
    } else {
      microTimerFunc();
    }
  }
}
```

首先会使用pending标记位来确定是否需要注册宏微任务。当第一次注册时，把pending设置为true，表示任务队列已经开始，同一时期内无需再次注册了。

然后会使用useMacroTask标记位来控制是使用宏任务还是使用 微任务。

> Vue2.6+版本中，不存在宏任务，都是使用的微任务