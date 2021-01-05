### 1. 创建组件VNode

核心源码

```js
function createComponent(
  Ctor, data, context,
  children, tag
) {
  var baseCtor = context.$options._base;
  // 创建组件构造函数
  Ctor = baseCtor.extend(Ctor);
  var vnode = new VNode(
    "vue-component-" + (Ctor.cid) + name,
    data, undefined, undefined,
    undefined, context,
    {
      Ctor: Ctor
    }
  );
  return vnode
}
```

以上createComponent主要作用有3点

- 创建组件构造函数
- 处理父组件给子组件的数据
- 创建组件外壳VNode

核心流程如下

1. 页面渲染函数执行
2. _c('test')执行
3. createElement碰到tag是一个组件
4. 从父组件中，拿到test组件的options，传入createComponent
5. createComponent调用Vue.extend创建组件构造函数
6. 创建VNode，并把构造函数和父组件给子组件的数据保存进去
7. 返回VNode

