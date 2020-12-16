### 1.响应式原理

Vue的响应式简单的来说就是当组件中的data发生变化时，会触发一系列的变化，这些变化可以是UI上的更新，或者触发computed/watch等，要弄清楚Vue的响应式原理，我们需要理解3个基本问题

> 当然，Vue中并不是只有data是响应式的，props也是响应式的，这里为了方便就用data来介绍。

#### 1.1 Object.defineProperty

这个ES5中就存在的方法就是Vue响应式原理的核心，它可以给js设置4个常见的特性，configurable(表示该属性是否可以使用delete删除), enumerable(表示该属性是否出现在枚举结果中), set/get(分别为对象赋值和读取时进行的回调)。而Vue主要用到了set/get

```js
var person = { name: 'lznism' };
Object.defineProperty(person, name, {
  configurable: true,
  enumerable: true,
  set (val) {
    console.log('set被触发');
  },
  get () {
		console.log('get被触发');
  }
});
```

当读取`person.name`时get被触发，当对`person.name`赋值时set会被触发。

#### 1.2 依赖收集

所谓的依赖收集是指每一个响应式的属性都会有一个依赖数组与之对应，该数组保存着谁依赖这个属性。比如模板中的mustache, computed, watch...

依赖数组中实际上保存着一个个的Watcher，这些Watcher可以用于实例的更新。依赖收集的时机是Object.defineProperty中的get，就是当Vue发现某个地方有读取某个属性时，就会触发get函数，紧接着就会保存触发这个get函数的Watcher了。

依赖收集对于基础数据类型和引用数据类型（这里主要是对象和数组）而言还存在的一些不同。如果是基础数据类型

```js
function defineReactive(obj, key) {
  var dep = new Dep();
  var val = obj[key];
  Object.defineProperty(obj, key, {
    get () {
      if (Dep.target) {
        dep.addSub(Dep.target);
      }
      return val;
    }
  })
}
```

如果是基础数据类型，它的依赖会被存放在Dep.target中，当触发该属性的get方法时，将Dep.target添加到依赖数组subs中。如果是对象和数组，这里其实增加了一个用于存储依赖的地方。Vue会给每个对象添加一个`__ob__`的属性，这个属性同样也存储了一份依赖subs。这么做的主要目的是用于对象的删除和添加属性，数组的push, pop, splice方法。因为Vue中为了实现这些方法的响应式，都对相关的方法进行了重写。比如$set

```js
Vue.prototype.$set = function (target, key, val) {
  var ob = target.__ob__;
  target[key] = val;
  ob.dep.notify();
}
```

再比如数组的push方法重写

```js
var original = Array.prototype.push;
Array.prototype.push = function() {
  var args = [];
  len = arguments.length;
  while (len--) args[len] = arguments[len];
  var result = original.apply(this, args);
  var ob = this.__ob__;
  ob.dep.notify();
  return result;
}
```

#### 1.3 依赖更新

从上一小节中，我们可以知道，data中的每个属性都会有一个依赖数组`subs`。这个subs就是用来在数据变化时，来通知更新。当data中的某个属性值发生变化时，该属性值就会遍历自己的依赖收集器subs，然后逐个通知Watcher，让Watcher来完成更新。

主要分为3个步骤

1. 直接调用watcher.update，也就是重新调用给watcher保存的更新函数
2. 更新函数就是执行渲染函数，然后读取实例最新的值，最后生成DOM节点
3. DOM节点插入或替换页面，完成更新

### 2.Props

```html
<div class="a">
  <testb :child-name="parentName"></testb>
</div>
```

#### 2.1 父组件怎么传值给子组件Props

上面的模板代码会被解析成一个模板函数

```js
(function() {    
  with(this){  
    return _c('div',{staticClass:"a"},[
      _c('testb',{attrs:{"child-name":parentName}})
    ],1)
  }
})
```

以上代码中，this指向的是父组件a的实例，模板函数执行时，parentName指向的是父组件的作用域。

#### 2.2 子组件如何读取Props

子组件的props会被保存在_props中，当我们使用this.xxx来访问或者赋值时，这里会有一个和data类似的转接功能

```js
Object.defineProperty(vm, key, {
  get() {
    // 当访问this.xxx时，实际上访问的是this._props[xxx]
    return this._props[key]
  },
  set(val) {
    // 当对this.xxx赋值时，实际上赋值的是this._props[xxx]
    this._props[key] = val
  }
})
```

#### 2.3 父组件数据变化，子组件如何更新

父组件的parentName在第一次渲染时，会被读取。同时由于parentName是响应式的，因此读取时get函数会被触发。在get函数中，parentName会将父组件的watcher保存在自己的依赖收集器中。当parentName发生变化时，会触发set函数，通知subs中的watcher更新。这时候渲染函数又会重新执行，进而更新子组件。

当父组件变更的数据是基本类型时，子组件的更新是以下流程

1. 父组件数据改变，只会把新的数据传递给子组件
2. 子组件拿到新的数据，就会直接替换掉之前旧的props
3. 替换的过程中，实际上也就触发了之前设置的响应式的set，此时会通知这个变更props的watcher更新

当父组件变更的数据是引用类型时，父组件的数组data通知子组件更新

### 3.Data

#### 3.1 Data中的数据是如何访问的

data中的数据访问主要依靠的是代理`Object.defineProperty()`，主要的原理可以看下面的一段源码

```js
function proxy(target, sourceKey, key) {
  Object.defineProperty({
    get() {
      return this[sourceKey][key]
    }
    set(val) {
    	this[sourceKey][val] = val;
  	}
  })
}
proxy(vm, '_data', key);
```

从上面的代码可以看出，当我们访问vm.key时，实际上是在访问vm._data.key；当我们赋值vm.key时，实际上赋值的是vm_data.key。

### 4.computed

computed的set和get也会和Object.defineProperty()联系起来，因此computed也是响应式的。

#### 4.1 computed控制缓存

computed值得计算就是调用get函数，然后得到返回值，computed控制缓存使用的是标记位`dirty`，dirty是watcher的一个属性，当dirty=true，读取computed时，会重新计算；当dirty=false，读取computed时会使用缓存。整体的流程大致如下：

1. 一开始每个computed新建自己的watcher是，会设置watcher.dirty=true，以便于computed被使用时，会计算得到值
2. 当依赖的数据变化了，通知computed是，将watcher.dirty=true，以便于其它地方重新渲染，从而重新读取computed时，此时computed重新计算
3. computed计算完成后，会设置watcher.dirty=false，以便于其它地方再次读取时，使用缓存，免于计算。

#### 4.2 依赖的data变化，computed如何更新

现在页面A中使用了计算属性B，而计算属性B又依赖了data C。如果data C发生了变化，具体的更新步骤如下：

1. 通知B watcher更新，其实只会重置脏数据标志位watcher.dirty=true，不会计算值
2. 通知页面Awatcher进行更新渲染，进而重新读取computed B，然后computed B开始重新计算

#### 4.3 computed初始化

当computed属性初始化时，每个属性都会有一个watcher与之对应

```js
watcher[key] = new Watcher(vm, getter, { lazy: true })
```

再来看一下Watcher的源码

```js
function Watcher(vm, expOrFn, options) {
  this.dirty = this.lazy = options.lazy;
  this.getter = expOrFn;
  this.value = this.lazy ? undefined : this.get();
}
```

初始化computed的watcher的流程

1. 保存设置的getter
2. watcher.value存放计算结果，lazy=true时，不会新建实例马上读取
3. computed新建watcher时，传入lazy

还是上面那个例子，现在页面A中使用了计算属性B，而计算属性B又依赖了data C，这里页面A是如何被收集到data C中的依赖的？

```js
function createComputedGetter(key) {
  return function() {
    var watcher = this._computedWatcher[key];
    if (watcher.dirty) {
      watcher.evaluate();
    }
    // 这里就是通过computed，将页面A和data C联系起来
    if (Dep.target) {
      watcher.depend();
    }
    return watcher.value;
  }
}
```

computed作为中间人，让data收集到页面的依赖的具体流程

1. 页面更新，读取computed的时候，Dep.target会设置为页面的watcher

2. computed被读取，createComputedGetter包装函数被触发，第一次会进行计算，watcher.evaluated被调用。computed 计算会读取 data，此时 data 就收集到 computed-watcher

3. 同时 computed-watcher 也会保存到 data 的依赖收集器 dep（用于下一步）。computed 计算完毕，释放Dep.target，并且Dep.target 恢复上一个watcher（页面watcher）

4. 手动 watcher.depend，让 data 再收集一次 Dep.target，于是 data又收集到恢复了的页面watcher


### 5.Event

Vue中事件可以被分为两种，一种是自定义事件，一种是DOM事件

#### 5.1 自定义事件

自定义事件主要由以下两部分构成

1. 事件存储器
2. 绑定事件，触发事件，解绑事件三个函数

Vue中的自定义事件都是存储在实例vm上的_events对象上，key是事件名，value是事件回调。对于自定义事件，我们采用$on绑定，$emit触发，$off解绑事件。

如果我们在组件上绑定了自定义事件，那这个事件会存储在子组件的_events中。子组件中依然是使用$emit去触发这个自定义事件。

Vue自定义事件使用了观察者模式进行事件的监听和分发。自定义事件分为两种情况，一种是自定义，这个比较简单，就是一个简单的观察者模式的实现。如果是在组件上绑定，情况稍有一点复杂

```vue
<test @custom-click="customClickFn"></test>
```

首先，父组件给子组件绑定事件，事件是存放于子组件中的vode.componentOptions.listeners中，具体步骤：

1. Vue.prototype._init
2. initEvents() 给vm添加_events对象，用于保存自定义事件。获取到父组件给子组件绑定的自定义事件，调用updateComponentListener开始注册。
3. 初始化组件信息，将之前存储在vnode中的listeners赋值给_parentListeners。
4. 注册时间，与原生DOM事件绑定一直

#### 5.2 DOM事件

DOM事件，就是直接使用`addEventListener`。绑定事件是在DOM创建之后，插入页面之前。DOM事件会被保存在这个节点解析生成的VNode中。DOM事件可以绑定在标签或者组件上。

对于绑定在标签上的DOM事件

```vue
<div @click="clickFn"></div>
```

具体的步骤为

1. 开始挂载，传入Vue.prototype._update方法，进行新旧VNode对比，生成DOM。
2. 创建DOM，处理数据`invokeCreateHooks`这里指的处理数据，就包含绑定DOM事件。
3. 绑定DOM事件又要分为3种情况：如果新旧事件相同，则替换旧事件；如果新事件不存在旧事件中，则绑定新事件；如果旧事件不存在新事件中，则解绑旧事件。

对于组件绑定DOM事件，Vue中如果想要绑定原生DOM事件在组件上，需要加上native修饰符。

```vue
<test @click.native="clickFn"></test>
```

具体的绑定步骤和上面将DOM事件绑定在标签上是一样的。

### 6. Methods

#### 6.1 Methods是如何访问到的

直接将methods逐个复制到vm上

#### 6.2 Methods是如何固定作用域的

底层是使用的bind来实现

### 7. Filters

首先来看一段简单的Vue代码

```html
<div>{{ name | all }}</div>
```

对应的js代码

```js
new Vue({
  data () { return { name: '111' } },
  filters: {
    all () { return '222' }
  }
})
```

#### 7.1 filters被解析成什么

首先来看被解析生成的渲染函数

```js
(function() {      
    with(this) {            
        return _c('div',[                
            _v(_s(_f("all")(name)))            
        ])      
    }
}
```

可以看出`name | all` 被解析成了`_f("all")(name))`。

#### 7.2 设置的filter是如何被调用的

具体步骤如下

1. 获取所有的filters
2. 过滤出当前用到的filter，上面的例子中就是`all`
3. 执行该filter，并传入filter符号前面的参数，上面的例子中就是`name`
4. 得到过滤之后的值，渲染到页面上

### 8. Watch

设置immediate时，不需要在数据改变时触发，而是初始化watch是，在读取了监听的数据值之后，便立即调用一遍你所设置的监听回调。

当设置了deep是，会做一个深度监听。因为Object.defineProperty()本身是无法做深度监听的，需要对监听的对象做一次深度遍历，将内部的每个属性都用Object.defineProperty()来设置一遍。如果没有设置deep，那watch的watcher仅仅只会被收集在监听的属性中；如果设置了deep，watch的watcher会被设置在监听对象下面的每个属性中。

Vue内部，对3中形态的watch进行了处理

```js
watch: {
  name: {
    handler() {},
  },
  name() {},
  name: 'getName'
}
```

### 9. Mixin

#### 9.1 什么时候合并

这个分为两种情况

1. 全局mixin和基础全局options合并
2. 全局options和自定义options合并

#### 9.2 如何合并

1. mergeOptions
2. defaultStrats: 优先使用组件options, 组件options > 组件mixin options > 全局options
3. data合并
4. 声明周期钩子
5. components, directives, filters（原型叠加）
6. watch（权重越小，越先执行）
7. props，computed，methods （不允许重名）
8. Template, el, propData (直接替换)

### 10.v-model

#### 10.1 v-model如何给组件绑定数据

```html
<div><input v-model="name" /></div>
```

上面这段代码解析成的渲染函数如下

```js
(function(){    
    with(this){  
        return _c('div',[
            _c('input',
                domProps:{"value":name}
            )
        ])
    }
})
```

这里的domProps中的name就会获取到组件实例上的name。

#### 10.2 v-model绑定什么事件

1. Checkbox, select, radio 绑定change事件
2. Text, textarea 绑定input事件

#### 10.3 v-model如何绑定事件

生成input dom之后，插入input dom之前，会使用addEventListener绑定事件

### 11. Directive

#### 11.1 钩子是如何调用的

首先Vue回去对比，旧节点上的指令和新节点上的指令。如果是新指令，需要初始化。初始化的过程如下

1. bind
2. inserted

如果是就指令，则需要更新，执行过程如下

1. update
2. componentUpdated

如果新指令比就指令少了，那会触发unbind钩子

#### 11.2 怎么获取设置的指令钩子

在 updateDirectives 中，处理的是指令的钩子。

normalizeDirectives$1

1. 遍历本节点所有的指令，逐个从组件中获取

2. 把获取的钩子添加到 遍历到的当前指令上

#### 11.3 如何处理钩子

inserted 是在DOM 插入父节点之后才触发的，而 处理 inserted 是在 DOM 插入之前，所有这里不可能直接触发，只能是先保存起来，等到 节点被插入之后再触发。

inserted 钩子是所有节点都插入完毕之后才触发的，而不是插入一个节点就触发一次





