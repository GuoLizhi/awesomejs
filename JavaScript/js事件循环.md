由于JavaScript是一种单线程的语言。可以假想如果没有事件循环，那js任务都只能一个一个执行，如果其中一个任务需要较长的时间，那整体的执行效率就会变得非常低。为了高效的执行js任务，因此出现了事件循环`Event Loop`。事件循环`Event Loop`中有两种任务`微任务`和`宏任务`

1. 微任务：比如Promise.then, MutationObserver，微任务的优先级要比宏任务要高
2. 宏任务：比如整体的script代码，setTimeout，setInterval，Node中的I/O操作等

Node V10之前的宏微任务执行顺序与当前浏览器中宏微任务执行顺序略有不同，在Node V10以前，宏任务分为以下几个阶段：

1. timer定时器，这个阶段执行已经安排的setTimeout和setInterval回调
2. pending callback 待定回调，这个阶段主要执行延迟到下一个循环迭代的I/O操作
3. idle/prepare：仅系统内部使用
4. poll：检索新的I/O操作
5. check：该阶段执行setImmediate()回调函数
6. close callback: 这个阶段主要执行某些回调的关闭，比如socket的关闭

在以上每个阶段的前提下，V10以前的版本执行宏任务按照如下顺序执行：

1. 执行完当前阶段的所有宏任务
2. 执行完nextTick中的所有任务
3. 执行完微任务队列中的人物

以下是几个经典的Event Loop面试题

```js
async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2')
}
console.log('script start')
setTimeout(() => {
  console.log('setTimeout')
}, 0)
async1()
new Promise((resolve) => {
  console.log('promise1')
  resolve()
}).then(() => {
  console.log('promise2')
})
console.log('script end')

/*
  script start
  async1 start
  async2
  promise1
  script end
  async1 end
  promise2
  setTimeout
*/
```

以上题目有两个需要注意的地方

1. Promise的构造函数是宏任务
2. `await async2()`这个可以简单地看成以下函数

```js
// await的函数可以看成放到了Promise的构造函数中
// await后面接着的执行语句可以看做是放入了Promise的then上面
new Promise(() => {
  async2()
}).then(() => {
  console.log('async2')
})
```

再来看一个

```js
console.log('start')
setTimeout(() => {
  console.log('children2')
  Promise.resolve().then(() => {
    console.log('children3')
  })
}, 0)
new Promise((resolve) => {
  console.log('children4')
  setTimeout(() => {
    console.log('children5')
    resolve('children6')
  }, 0)
}).then((res) => {
  console.log('children7')
  setTimeout(() => {
    console.log(res)
  }, 0)
})

/*
  start
  children4
  children2
  children3
  children5
  children7
  children6
*/
```

这题需要注意的地方就是`new Promise().then()`是不会立即放入微任务队列中。因为它要等内部resolve之后才会将其放入微任务队列中。也就是构造函数中的setTimeout宏任务执行之后，它才会被放入微任务队列中。

```js
const p = function() {
  return new Promise((resolve) => {
    const p1 = new Promise((resolve) => {
      setTimeout(() => {
        resolve(1)
      }, 0)
      resolve(2)
    })

    p1.then(res => {
      console.log(res)
    })
    console.log(3)
    resolve(4)
  })
}


p().then(res => {
  console.log(res)
})
console.log('end')

/*
  3
  end
  2
  4
*/
```

这题需要注意的地方，Promise一旦resolve之后，再次调用resolve就无效了，所以p1里面会resolve出来2