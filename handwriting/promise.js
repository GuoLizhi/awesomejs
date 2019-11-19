const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

function resolvePromise (promise2, x, resolve, reject) {
  if (x === promise2) {
    return reject(new TypeError('Chaning cycle detected for promise'))
  }
  let called = false
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      let then = x.then
      if (typeof then === 'function') {
        then.call(x, y => {
          if (called) return
          called = true
          resolvePromise(promise2, y, resolve, reject)
        }, err => {
          if (called) return
          called = true
          reject(err)
        })
      } else {
        resolve(x)
      }
    } catch (err) {
      if (called) return
      called = true
      reject(err)
    }
  } else {
    resolve(x)
  }
}

class Promise {
  constructor (executor) {
    this.state = PENDING
    this.value = undefined
    this.reason = undefined
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []

    const resolve = (value) => {
      if (this.state === PENDING) {
        this.state = FULFILLED
        this.value = value
        this.onResolvedCallbacks.forEach(fn => fn())
      }
    }
    const reject = (reason) => {
      if (this.state === PENDING) {
        this.state = REJECTED
        this.reason = reason
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }

    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then (onFullfilled, onRejected) {
    onFullfilled = typeof onFullfilled === 'function' ? onFullfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err }

    let promise2 = new Promise((resolve, reject) => {
      if (this.state === FULFILLED) {
        setTimeout(() => {
          let x = onFullfilled(this.value)
          resolvePromise(promise2, x, resolve, reject)
        })
      }
      if (this.state === REJECTED) {
        setTimeout(() => {
          let x = onRejected(this.reason)
          resolvePromise(promise2, x, resolve, reject)
        })
      }
      if (this.state === PENDING) {
        setTimeout(() => {
          this.onResolvedCallbacks.push(() => {
            let x = onFullfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          })
          this.onRejectedCallbacks.push(() => {
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          })
        })
      }
    })

    return promise2
  }
}
