### 1. 原型继承

组合继承

```js
function Parent(name) {
  this.name = name
}
Parent.prototype.sayName = function() {
  console.log(this.name)
}

function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}
Child.prototype = new Parent()
```

这种继承方式有两个比较严重的缺点

1. 父类的构造函数被调用了2次，可以看到在子类的构造函数中执行了一次`Parent.call()`，然后在原型上执行了一次`new Parent()`，是一种性能上的浪费
2. Child实例的constructor属性不对，此时`c.constructor`执行的父类的构造函数，对此我们需要人为指定`Child.prototype.constructor = Child`
3. 子类原型上属性污染的问题，比如此时Parent类上还有一个属性`job`，此时这个`job`属性不仅会存在于子类的实例上，也会存在于子类的原型上

寄生式组合继承

```js
function extend(child, parent) {
  const prototype = Object.create(parent.prototype)
  prototype.constructor = child
  child.prototype = prototype
}

function Animal(type) {
  this.type = type
}
Animal.prototype.say = function() {
  console.log('animal say...')
}
function Cat(type, name) {
  Animal.call(this, type)
  this.name = name
}
extend(Cat, Animal)
Cat.prototype.say = function() {
  console.log('cat say...')
}
```

这种方式目前ES5实现继承的最优解。只调用了一次父类的构造函数，并且也不会有原型上被其余属性污染的问题

### 2. 原型和原型链

原型：每一个JavaScript对象(null除外)在创建的时候就会与之关联另一个对象，这个对象就是我们所说的原型，每一个对象都会从原型`继承`属性

`__proto__`:每一个JavaScript对象(null除外)都具有一个属性，叫`__proto__`，这个属性会指向对象的原型

```js
function Person() {}
var p = new Person()
p.__proto__ === Person.prototype // true
```

constructor: 原型上的constructor也可以指向构造函数

```js
Person === Person.prototype.constructor // true
```

Object.getPrototypeOf(): 用来获取一个对象的原型

```js
Object.getPrototypeOf(p) === Person.prototype
```

当读取实例的属性时，如果找不到，就会去查找与对象关联的原型中的属性，如果还查不到，就去查原型的原型，一直找到最顶层为止

原型的原型：

```js
Person.prototype.__proto__ === Object.prototype // true
Object.prototype.__proto__ === null // true
```

实例的constructor: 实例上其实并不存在constructor属性的，但是如果实例上查不到，回去原型上查找

```js
p.constructor === Person.prototype.constructor
```

两种对象类型

1. 函数对象：凡是通过new Function()的方式创建的对象都是函数对象
2. 普通对象，除了函数对象之外的

每个对象实例上都有一个constructor的属性，指向构造函数

```js
function Person() {}
const p = new Person()
console.log(p.constructor === Person) // true
```

每一个函数对象都有一个prototype的属性，指向函数的原型

原型对象Person.prototype是构造函数Person的一个实例