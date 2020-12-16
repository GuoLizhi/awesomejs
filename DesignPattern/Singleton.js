class Singleton {
  constructor (name) {
    this.name = name
    this.instance = null
  }
  getName() {
    console.log(this.name)
  }
  static getInstance(name) {
    let instance = null
    return function () {
      if (!instance) {
        instance = new Singleton(name)
      }
      return instance
    }
  }
}

const a = Singleton.getInstance("Mike")
const b = Singleton.getInstance("Lily")
console.log(a === b) // true
a.getName()
b.getName()
