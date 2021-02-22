### 1. 数据绑定

Vue3中使用`Proxy`代替了之前的`Object.defineProperty`。Proxy可以轻松实现对数组的劫持，以及对对象新增或者删除属性的劫持操作。但是Proxy也涉及到一些细节性的操作

1. 拦截器的默认行为

```js
const obj = []
const newObj = new Proxy(obj, {
  get(target, key, receiver) {
    console.log(`getting ${key}`)
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    console.log(target, key, value, receiver)
    return Reflect.set(target, key, value, receiver)
  }
})

obj.push(1)
```

这里的set操作实际上是有一个默认行为，比如这里直接使用`target[key] = value;`，那此时就会报错。因为默认情况下，对数组的某个索引赋值，不仅会对索引进行操作，还会对其`length`属性进行操作。比如以上的代码，set行为默认会触发两次。这里最好的处理方式就是使用Reflect来返回默认行为。

2. 多次触发get/set

上面的例子中，get和set都会触发两次，分别为：

1. 第一次get，触发数组的push属性的读取
2. 第二次get，触发数组的length属性的读取
3. 第一次set，触发数组索引对应值得修改
4. 第二次set，触发数组length属性的修改

这种行为显然不太友好，在Vue中，那就回多次触发页面的重新渲染。

这里我们可以使用setTimeout来解决重复的trigger，相当于加一层防抖函数

```js
function reactive(data, cb) {
  let timer = null
  return new Proxy(data, {
    get(target, key, recevier) {
      return Reflect.get(target, key, recevier)
    },
    set(target, key, value, recevier) {
      // 这里相当于debounce的操作
      // 这样就可以解决重复trigger的问题
      clearTimeout(timer)
      timer = setTimeout(() => {
        cb && cb()
      }, 0)
      return Reflect.set(target, key, value, recevier)
    }
  })
}
```

Vue3中的处理，通过 判断 key 是否为 target 自身属性，以及设置val是否跟target[key]相等 可以确定 trigger 的类型，并且避免多余的 trigger。

```js
function set(target, key, val, receiver) {
  console.log(target, key, val)
  const hadKey = hasOwn(target, key)
  const oldValue = target[key]
  
  val = reactiveToRaw.get(val) || val
  const result = Reflect.set(target, key, val, receiver)

  if (!hadKey) {
    console.log('trigger ... is a add OperationType')
  } else if(val !== oldValue) {
    console.log('trigger ... is a set OperationType')
  }

  return result
}
```

3. Proxy只能代理一层

```js
const deepObj = {
  a: { b: { c: 1 } }
}
const newDeepObj = new Proxy(deepObj, {
  get(target, key, receiver) {
    console.log(`getting ${key}`)
    console.log(receiver)
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    console.log(target, key, value, receiver)
    return Reflect.set(target, key, value, receiver)
  }
})

newDeepObj.a.b.c = 2 // getting a
```

从上面的例子可以看出，对对象的深度操作，仅仅能代理到第一层，如果需要深度监听，那需要开发者自己进行深度递归。

```js
// Vue3中的处理
function createGetter() {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver)
    return isObject(res) ? reactive(res) : res
  }
}
```

可以看到Vue会判断Reflect返回的是否是对象，如果是对象再走一次proxy，从而获得了对对象内部的监测