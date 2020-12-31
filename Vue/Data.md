为什么可以通过this.xxx访问到data中的xxx属性？

Vue将data中的数据存放于vm._data中，然后使用Object.defineProperty()的方式，当我们访问this.xxx时，会自动代理到`this._data.xxx`中。当我们设置this.xxx时，实际上设置的是`this._data.xxx`