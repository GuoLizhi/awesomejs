/**
 * promise实现原理
 */
const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

class Promise {
  /**
   * 实例化Promise时，会传入executor参数，该参数是一个函数
   * 这个函数接受两个参数，成功和失败的回调函数
   * @param {Function} executor
   */
  constructor(executor) {
    this.state = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state === PENDING) {
        this.state = FULFILLED;
        this.value = value;
        this.onResolvedCallbacks.forEach((fn) => fn());
      }
    };

    const reject = (reason) => {
      if (this.state === PENDING) {
        this.state = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };

    // 如果executor执行报错，则直接reject
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  /**
   * then方法中返回一个新的promise，将这个新的promise传入到下一个then中
   * 如果返回的是一个普通值，直接将这个普通值传递给下一个then
   *
   * @param {Function} onFulfilled 成功时的回调
   * @param {Function} onRejected 失败时的回调
   */
  then(onFulfilled, onRejected) {
    const promise2 = new Promise((resolve, reject) => {
      if (this.state === FULFILLED) {
        let x = onFulfilled(this.value);
        resolvePromise(promise2, x, resolve, reject);
      }
      if (this.state === REJECTED) {
        let x = onRejected(this.reason);
        resolvePromise(promise2, x, resolve, reject);
      }
      if (this.state === PENDING) {
        this.onResolvedCallbacks.push(() => {
          let x = onFulfilled(this.value);
          resolvePromise(promise2, x, resolve, reject);
        });
        this.onRejectedCallbacks.push(() => {
          let x = onRejected(this.reason);
          resolvePromise(promise2, x, resolve, reject);
        });
      }
    });
    return promise2;
  }
}

/**
 * @param {Promise} promise2 then方法返回的新的Promise
 * @param {*} x onFulfilled或onRejected返回值
 * @param {Function} resolve
 * @param {Function} reject
 */
function resolvePromise(promise2, x, resolve, reject) {
  // 循环引用
  if (x === promise2) {
    return reject(new TypeError("Chaining cycle detected for promise"));
  }
  let called = false;
  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    try {
      let then = x.then;
      // 判断x是否是promise
      if (typeof then === "function") {
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          (err) => {
            if (called) return;
            called = true;
            reject(err);
          }
        );
      } else {
        resolve(x);
      }
    } catch (err) {
      if (called) return;
      called = true;
      reject(err);
    }
  } else {
    resolve(x);
  }
}

Promise.resolve = function (val) {
  return new Promise((resolve, reject) => {
    resolve(val);
  });
};

Promise.reject = function (val) {
  return new Promise((resolve, reject) => {
    reject(val);
  });
};

/**
 * @param {Promise[]} promises
 */
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(resolve, reject);
    }
  });
};

/**
 * @param {Promise[]} promises
 */
Promise.all = function (promises) {
  let arr = [];
  let i = 0;
  function processData(index, data, resolve) {
    arr[index] = data;
    i++;
    if (i === promises.length) {
      resolve(arr);
    }
  }
  return new Promise((resolve, reject) => {
    promises[i].then((data) => {
      processData(i, data, resolve);
    }, reject);
  });
};
