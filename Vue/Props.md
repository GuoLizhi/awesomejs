1. Props在子组件中也是响应式的，初始化时，会循环props，对每一个key进行defineReactive，但是不会对Props进行深度遍历，仅会对首层的key进行响应式设置（引用类型的Props）

2. 当父组件数据改变时，子组件如何更新？

   这里需要区分改变的是基本类型和引用类型

   当修改的数据是基本类型时，父组件会将新的数据传递给子组件，由于子组件这个key也是响应式的，那就会导致触发set，set通知子组件更新。综上可以认为是，子组件内部的set触发了子组件的更新。

   当修改的数据是引用类型，过程稍有不同，由于父子组件都用到了这个对象，于是这个对象会收集到父子组件的watcher，因此当这个对象被修改时，会通知父子组件更新。综上可以认为是，父组件的data触发子组件更新
