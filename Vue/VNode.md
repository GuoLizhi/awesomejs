1. VNode是什么以及作用？

VNode表示虚拟节点Virtual DOM，它的本质是用js对象来描述真实DOM。它的作用如下：

- 兼容性强，不受执行环境的影响
- 减少DOM操作，任何页面的变化，都会使用VNode进行操作对比，主需要在最后一步挂载更新DOM，不需要频繁操作DOM

2. VNode是如何生成的？

Vue中，有一个专门的VNode类，用来生成VNode

3. VNode中存放了什么信息？

- 普通属性，比如节点属性，class/style/绑定的事件
- Elm：真实的DOM节点，elm会在需要创建DOM时完成赋值
- context: 渲染模板的上下文
- isStatic: 是否是静态节点，当一个节点被标记为静态节点时，说明这个节点可以不用去更新他了，DIFF的时候会忽略这个节点，提高效率
- parent: 组件的外壳节点，外壳节点通常用语保存一些父组件传给子组件的数据
- componentInstance：组件实例
- componentOptions：存储props, slot, listeners,children等等

4. VNode如何生成

render function的执行会得到当前组件的VNode，创建VNode分为两种情况

- 正常标签
- 组件，如果是组件会先调用createComponent

5. VNode存放在哪？

- parent
- _vnode：存放当前节点的VNode，当数据变化生成新的VNode时，会来和`_VNode`对比
- $vnode：只有组件实例才有，因为$vnode存放的是外壳节点，页面实例中是不存在$vnode的

