1. v-model是如何绑定表单值的？

Vue针对不同的表单元素会有专属的方法来进行深度解析

但对于每一个表单元素都有一个相同的操作，就是通过addProp去保存绑定的属性，然后进行属性绑定

```js
function addProp(el, name, value) {
  (el.props || (el.props = [])).push({ name: name, value: value });
}
```

然后是解析el.props，将其拼接成字符串domProps，然后在插入DOM之前，会将这个domProps遍历赋值到DOM上

每个表单元素绑定事件的流程也是大致相同的，会经过以下几个步骤

- 拼接事件成字符串：每种元素拼接事件都不一样
- 保存好事件名和拼接好的回调：每个元素的event事件和拼接的回调是不一样的，但它们保存的流程都是一样的
- 完善拼接回调：每一项回调最外层都会包上function字符串，并把所有事件逐个拼接成on字符串

```js
`on: {
  input: function($event) {
    name = $event.target.value
  },
  change: function($event) {
    name = 1
  }
}`
```

- 绑定事件，在插入DOM之前，会将on上面保存的所有事件都遍历绑定到DOM上

2. input, textarea

绑定属性：value

拼接事件：`name=$event.target.value`，事件是input事件

双向更新：这里的变化分为内部变化和外部变化

- 内部变化： 通知watcher更新，render function重新执行，获取新的name，绑定到DOM元素属性value
- 外部变化：使用$event.target.value赋值给内部的name

3. select

绑定属性：selectedIndex

拼接事件：从所有option中筛选出被选择的option，使用数组保存筛选后的option的value，然后判断是否多选，如果是多选则返回数组否则返回数组的第一项，事件是change事件

双向更新：这里的变化分为内部变化和外部变化

- 内部变化：通知watcher更新，render function重新执行，获取新的name，于是更新select元素属性selectedIndex
- 外部变化，直接赋值给绑定值，绑定值变化，通知watcher更新，再走内部变化的流程

4. checkbox

绑定属性：checked

拼接事件：如果是数组，当选中时，把当前项concat进数组；取消选择，把当前项移除数组。如果是非数组，直接赋值即可。事件是change事件

双向更新：

- 内部变化：通知watcher更新，render function重新执行，获取新的name，更新checkbox的checked属性
- 外部变化，判断是否多选和是否选择，来决定如何赋值更新绑定值name，然后走内部变化的流程

5. Radio

绑定属性：checked

拼接事件：直接`name=1`，1是你设置给radio的值，事件是change事件

双向更新：

- 内部变化：通知watcher更新，render function重新执行，获取新的name，更新radio元素属性
- 外部变化：直接赋值更新绑定值name等于radio元素属性value

6. input详解

- input的预输入延迟更新（比如输入中文拼音时，不触发input事件）

Vue通过composing这个标记为来判断是否需要实时更新，Vue会为input和textarea绑定compositionstart, compositionend, change事件

compositionstart：在input事件触发之前触发，但是一些可以直接到达输入框的字符是不会触发compositionstart的，只有类似于拼音这种不直接达到输入框的字符才会触发compositionstart

因此我们需要在compositionstart的事件中，将composing置为true，在compositionend中，再去将composing置为false，然后手动trigger此时的input事件

> 在safari<10.2的浏览器中，不会触发compositionend事件，于是Vue采用change事件来代替

所有的compositionstart, compositionend, change事件会在v-model指令的inserted钩子中使用addEventListener方法绑定

- v-model.lazy

当设置lazy修饰符时，input绑定的是change事件，而不是input，也就是当我们改变了内容，失去焦点时才会触发

- v-model.trim/v-model.number

对于trim和number，Vue会对表单值进行处理

trim：值会调用trim方法

number：会调用_n转化为数字的方法

如果v-model设置了trim和number，最终会使用$forceUpdate方法来强制数据更新，作用是将页面上显示的值也强制使用trim和number过滤一遍。

7. select详解

先来看Vue是如何设置selectedIndex的

- 当绑定值无法匹配任何option是，设置selectedIndex=-1，然后select就会显示为空
- 选择时，如果多个option值相等，只取第一个相等项
- 当options选项更新，Vue会根据之前的选择，更新它在options的位置

再来看看在哪里设置selectedIndex

Vue会在v-model的两个钩子函数中更新select的selectedIndex

- inserted
- componentUpdated