两个TAB页面需要满足如下条件才可以实现storage监听

1. 同源
2. 一个修改了localStorage事件
3. 另一个注册了storage事件

> 注意：不可再同一个网页修改localStorage，又同时监听localStorage的变化

监听

```js
window.addEventListener('storage', e => {
    alert(e.newValue)
})
```

如果在同一个页面内实现监听，可以重写localStorage.setItem

```js
var originEvent = new Event('setItemEvent')
localStorage.setItem = function(key, newValue) {
    var setItemEvent = new Event('setItemEvent')
    setItemEvent.value = newValue
    window.dispatchEvent('setItemEvent')
    originEvent.apply(this, arguments)
}
window.addEventListener('setItemEvent', e => {
    alert(e.newValue)
})
localStorage.setItem('name', 'guolizhi')
```