1. mixins什么时候合并

在创建组件实例初始化之前，会把全局选项和组件选项合并起来

全局选项包含：全局过滤器，全局指令，全局mixin，全局组件。这些全局选项会以引用的方式传递到每一个组件中，之后每个组件中就可以使用到全局选项

2. mixins是如何合并的

场景设置

1. 组件options -> A
2. 组件mixin -> B
3. 组件mixin的mixin -> C
4. 全局options -> D

策略一：函数合并策略

例子：provide, data

合并流程：A -> B -> C -> D

策略二：叠加成数组

例子：生命周期函数，watch

执行顺序：全局mixins的生命周期hooks -> 组件mixin的mixin的生命周期hooks -> 组件mixin的生命周期hooks -> 组件options的生命周期hooks

权重小的先执行

策略三：原型叠加

例子：components, filters, directives

这些对象合并时，不会相互覆盖，而是权重小的会被放在权重大的原型上

```js
A.__proto__ = B  
B.__proto__ = C  
C.__proto__ = D
```

策略四：覆盖叠加

例子：props, methods, computed, inject

两个对象合并时，如果有重复的key，权重大的覆盖权重小的

策略五：直接替换

例子：template, el, propData

直接使用权重大的替换权重小的

> 覆盖叠加和直接替换是不同的，覆盖叠加只是相同的才会使用权重的大，而直接替换是直接使用权重大的