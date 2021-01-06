1. DOM事件是如何解析的（针对普通HTML标签）？

DOM事件在解析成render function的过程中，会挂载到on下面

```js
(function () {
  with(this) {
    return _c('div', {
      on: {
        click: function($event) {
          this.alert(1234)
        }
      }
    })
  }
})
```

2. DOM事件是如何绑定的（针对普通HTML标签）？

原生事件会存放在VNode上的data中。VNode创建完毕之后，会调用Vue原型上的_update方法，进行新旧VNode对比，然后生成DOM挂载到页面上，对于DOM事件的处理，分为以下3中情况

- 新旧事件相同，替换旧事件
- 新事件不存在于旧事件中，绑定新事件
- 旧事件不存在于新事件中，删除旧事件

3. DOM事件是如何解析的（针对Vue组件）？

组件绑定原生的DOM事件需要用到native修饰符，组件的原生DOM事件在解析成render function的过程中，会挂载到nativeOn上面

```js
(function () {
  with(this) {
    return _c('div', {
      nativeOn: {
        click: function($event) {
          this.alert(1234)
        }
      }
    })
  }
})
```

生成外壳VNode的过程中nativeOn和on上面都会保存这个事件

4. DOM事件是如何绑定的（针对Vue组件）？

事件绑定的具体过程和普通HTML标签绑定DOM事件大致相同

5. Vue中自定义事件？

Vue的自定义事件很简单，就是通过观察者模式进行事件的监听和分发的，Vue的自定义事件存储在_events中。

- $on 绑定事件
- $off 解绑事件
- $once 一次性绑定事件
- $emit 触发事件

