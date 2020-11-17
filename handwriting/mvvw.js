/**
 * 实现一个简单响应式原理，包含了依赖收集与更新
 */
// eslint-disable-next-line no-unused-vars
class MVVM {
  constructor (options = {}) {
    this.options = options
    this.observe(options.data)
    const root = document.querySelector(options.el)
    this.compile(root)
  }

  observe (data) {
    Object.keys(data).forEach(key => {
      // 采用闭包的形式创建一个观察者
      // 这个obv仅针对data[key]
      const obv = new Observer()
      // 这里采用data[`_${key}`]，而不是data[key]的原因是防止循环触发data[key]的get
      data[`_${key}`] = data[key]
      Object.defineProperty(data, key, {
        get () {
          // 依赖收集，收集的是存储的Observer.target
          Observer.target && obv.addSubNode(Observer.target)
          return data[`_${key}`]
        },
        set (newVal) {
          // 依赖更新
          obv.update(newVal)
          data[`_${key}`] = newVal
        }
      })
    })
  }

  compile (node) {
    // 首次编译时，就会找出哪些数据依赖于options中的data
    Array.prototype.forEach.call(node.childNodes, child => {
      if (!child.firstElementChild && /\{\{(.*)\}\}/.test(child.innerHTML)) {
        const key = RegExp.$1.trim()
        // 这里是一种比较巧妙的形式，利用了类上的静态属性来传递依赖的节点
        Observer.target = child
        child.innerHTML = child.innerHTML
          .replace(new RegExp('\\{\\{\\s*' + key + '\\s*\\}\\}', 'gm'), this.options.data[key])
        Observer.target = null
      }
    })
  }
}

class Observer {
  constructor () {
    this.subNode = []
  }

  addSubNode (node) {
    this.subNode.push(node)
  }

  update (newVal) {
    this.subNode.forEach(node => {
      node.innerHTML = newVal
    })
  }
}
