flex属性是`flex-grow`, `flex-shrink`, `flex-basis`这3个属性的缩写

1. flex-grow:用于设置各个item按对应比例划分剩余空间。如果没有指定flex-grow，则相当于`flex-grow: 1`
2. flex-shrink:用于设置item总和超出容器空间时，各个item按比例收缩。如果没有指定flex-shrink，则相当于`flex-shrink: 1`
3. flex-basis:用于设置各个item项伸缩的基准值，可以取值为长度或百分比，如果省略了该属性，则相当于`flex-basis: 0%`

flex取不同的值
1. flex:none等同于`flex:0 0 auto`
2. flex:auto等同于`flex:1 1 auto`
3. flex为一个数字时，相当于设置flex-grow。比如flex:1等同于`flex:1 1 0%`
4. flex为两个数字时，相当于设置flex-grow, flex-shrink。比如flex: 1 0等同于`flex:1 0 0%`
5. flex为一个数字和一个百分比时，相当于设置flex-grow, flex-basis。比如flex: 1 20%等同于`flex: 1 0 20%`

### flex-grow
css
```html
<div class="container">
  <div class="item a">
    <p>a</p>
    <p>width:100</p>
    <p>flex-grow:1</p>
    <p>100 + (1 / (1 + 2 + 1)) * 150 = 137.5</p>
  </div>
  <div class="item b">
    <p>b</p>
    <p>width:150</p>
    <p>flex-grow:2</p>
    <p>100 + (2 / (1 + 2 + 1)) * 150 = 175</p>
  </div>
  <div class="item c">
    <p>c</p>
    <p>width:100</p>
    <p>flex-grow:2</p>
    <p>100 + (1 / (1 + 2 + 1)) * 150 = 137.5</p>
  </div>
</div>
```
css
```css
.container {
  width: 500px;
  height: 200px;
  background: #ccc;
  display: flex;
}
.container .item {
  height: 100%;
  text-align: center;
}
.a {
  width: 100px;
  background: red;
  flex-grow: 1; /* 剩余空间占1份 */
}
.b {
  width: 150px;
  background: palegoldenrod;
  flex-grow: 2; /* 剩余空间占2份 */
}
.c {
  width: 100px;
  background: pink;
  flex-grow: 1; /* 剩余空间占1份 */
}
```

flex-grow:0表示即使存在剩余空间，也不会去瓜分

### flex-shrink

css

```css
.container {
  width: 500px;
  height: 200px;
  background: #ccc;
  display: flex;
}
.container .item {
  height: 100%;
  text-align: center;
}
/*
  总权重：1 * 200 + 2 * 350 + 200 * 3 = 1500
  压缩率： ya => 1 * 200 / 1500
          yb => 2 * 350 / 1500
          yc => 3 * 200 / 1500
  最终宽度：width - 溢出空间 * 压缩率
  widthA = 200 - ya * 250
  widthB = 350 - yb * 250
  widthC = 200 - yc * 250
*/
.a {
  width: 200px;
  background: red;
  flex-shrink: 1;
}
.b {
  width: 350px;
  background: palegoldenrod;
  flex-shrink: 2;
}
.c {
  width: 200px;
  background: pink;
  flex-shrink: 3;
}
```
html
```html
<div class="container">
  <div class="item a">
    <p>a</p>
    <p>width:200</p>
    <p>flex-shrink:1</p>
  </div>
  <div class="item b">
    <p>b</p>
    <p>width:350</p>
    <p>flex-shrink:2</p>
  </div>
  <div class="item c">
    <p>c</p>
    <p>width:200</p>
    <p>flex-shrink:3</p>
  </div>
</div>
```
> 如果子元素没有溢出，设置flex-shrink无效

css

```css
.container {
  width: 500px;
  height: 200px;
  background: #ccc;
  display: flex;
}
.item {
  width: 100px;
  height: 100px;
}
/* 结论：min-width/max-width > flex-basis > width */
.a {
  /* flex-basis优先级高于width */
  flex-basis: 200px;
  background: pink;
}
.b {
  /* max-width优先级高于flex-basis */
  max-width: 50px;
  flex-basis: 150px; 
  background: palegoldenrod;
}
.c {
  background: palevioletred;
}
```

html

```html
<div class="container">
  <div class="item a">
    <p>a</p>
  </div>
  <div class="item b">
    <p>b</p>
  </div>
  <div class="item c">
    <p>c</p>
  </div>
</div>
```