1. 生命周期钩子是如何执行的

根据之前的mixin原理可以知道，Vue内部的生命周期钩子都是使用数组来存储的。执行的时候也是通过遍历这个数组来一个个执行。

2. 生命周期钩子什么时候触发

- 合并选项，设置初始值，事件等
- beforeCreate
- 初始化选项
- created
- 获取挂载的DOM父节点
- beforeMount
- 解析模板成渲染函数，并执行渲染函数，生成DOM插入页面
- mounted



组件更新阶段

- beforeUpdate
- 重新调用渲染函数，对比新旧节点得到最小差异，只更新这个差异的部分
- updated



组件移除阶段

- beforeCreate
- 实例被移除，watcher被移除，DOM被移除
- destroyed