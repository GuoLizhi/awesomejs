## 1. 普通slot

1.1 插槽内容是如何解析的

插槽生成render function之后，作用域是其父组件实例。也就是说插槽内部的变量的获取是从其父组件内部获取的。

1.2 插槽是如何插入子组件的

比如有如下插槽

```html
<test>我是组件内部的slot</test>
```

这个组件会生成如下的VNode

```js
{
  tag: 'div',
  children: [{
    tag: 'test',
    children: ['我是组件内部的slot']
  }]
}
```

从以上的VNode可以看到

1. test组件是父组件的一个子元素
2. test组件内的slot，被当做test组件的子元素

