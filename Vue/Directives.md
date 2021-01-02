1. 如何获取指令

获取指令分为两个步骤

1. 遍历本节点所有的指令，逐个从组件中获取这些指令的相关信息
2. 把获取的钩子添加到当前处理的组件上

```js
function normalizeDirectives$1(dirs, vm) {
  var res = {};
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    res[dir.name] = dir;
    // 从当前组件的options中获取
    dir.def = vm.$options['directives'][dir.name];
  }
  return res
}
```

2. 怎么调用钩子

bind: 当遇到新的指令，会直接执行bind钩子

update：当碰到旧指令，会直接执行update钩子

unbind：当指令被去掉时，会执行unbind钩子

inserted：该钩子会分为保存和执行两个步骤。所有的inserted钩子会用一个数组保存起来，当所有节点插入完毕之后，再遍历这个数组，进行触发。而不是插入一个节点就执行一次

componentUpdated和insterted钩子差不多，都有保存和执行两个阶段