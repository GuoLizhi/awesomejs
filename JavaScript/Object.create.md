`Object.create`用来创建一个对象

```js
Object.create(proto, [propertiesObject])
```

proto是新创建对象的原型对象，propertiesObject可选，要添加新对象的可枚举属性（非原型上）

```js
const person = {
  name: 'lznism'
}

const p1 = Object.create(person, {
  // 这里添加的属性是其自身属性，不是原型链上的属性
  age: {
    writable: true,
    configurable: true,
    value: 20
  }
})

console.log(p1)

/*
  最终生成的对象
  {
    age: 20
    __proto__:
      name: 'lznism'
  }
*/
```

Object.create(null)用来创建一个`纯净`对象，对象内不会隐式的自动包含`__proto__`

```js
Object.create(null) // 创建一个纯净对象
Object.create(null, {
  name: {
    value: 'lznism'
  }
}) // 创建对象{name: 'lznism'}, 这个对象的原型上不包括任何多余属性
```