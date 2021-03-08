### 1. 数据更改方式的不同

React推崇的是函数式编程，一种不可变的数据结构。对于状态的更改，我们需要用`setState`来修改。如果我们直接给状态赋值，比如state.a='xxx'，并不会触发界面的更新。

Vue状态的修改就比较简单了，他可以直接对data赋值，触发响应式更新。对之前依赖收集到的watcher，触发watcher更新。

总体来说，在易用性上，Vue是要优于React的。但是React推崇的这个不可变的数据更容易debug和一些时间旅行的功能。另外如果Vue初始化的data比较大，结构嵌套比较深，Vue会对其进行深度遍历，进行`Object.defineProperty()`。

### 2. DIFF的不同点

React如果某个组件的数据发生变化，会触发这个组件的重新渲染，但也并不是整个组件全部都重新渲染，而是会进行一个DIFF。DIFF的整体思路还是同层比较，如果我们不想某一个组件进行DIFF，React提供了shouldComponentUpdate方法，让我们自己来判断组件是否需要执行后面的DIFF,patch和update。

Vue并不会像React一样会去进行一整个组件树的diff。由于之前使用到了Object.defineProperty来收集依赖，因此它会去更细粒度的比较VDOM的变化。

### 3. 逻辑复用

React：render props，hooks， HOC

Vue：directives，mixin，composition API
