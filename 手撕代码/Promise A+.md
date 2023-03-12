手写一个Promise/A+，整体还是能更完整的认识Promise的
```js
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class APromise {
  constructor(executor) {
    this.state = PENDING
    this.value = ''
    this.handlers = []
    executor(this.fulfill, this.reject)
  }

  fulfill = value => {
    if (this.state === PENDING) {
      this.state = FULFILLED
      this.value = value
      this.handlers.forEach(this.handle)
      this.handlers = []
    }
  }

  reject = value => {
    if ((this.state = PENDING)) {
      this.state = REJECTED
      this.value = value
      this.handlers.forEach(this.handle)
      this.handlers = []
    }
  }

  handle = handler => {
    if (this.state === PENDING) {
      this.handlers.push(handler)
    } else {
      if (this.state === FULFILLED && handler.onFulfilled) {
        handler.onFulfilled(this.value)
      }
      if (this.state === REJECTED && handler.onRejected) {
        handler.onRejected(this.value)
      }
    }
  }

  then = (onFulfilled, onRejected) => {
    return new APromise((resolve, reject) => {
      this.handle({
        onFulfilled: value => {
          if (typeof onFulfilled === 'function') {
            try {
              resolve(onFulfilled(value))
            } catch (err) {
              reject(err)
            }
          } else {
            resolve(value)
          }
        },
        onRejected: value => {
          if (typeof onRejected === 'function') {
            try {
              resolve(onRejected(value))
            } catch (err) {
              reject(err)
            }
          } else {
            reject(value)
          }
        },
      })
    })
  }

  catch = onRejected => {
    return this.then(null, onRejected)
  }

  finally = onFinally => {
    return this.then(
      value => APromise.resolve(onFinally()).then(() => value),
      reason =>
        APromise.resolve(onFinally()).then(() => {
          throw reason
        })
    )
  }

  static resolve = value => {
    return new APromise(resolve => {
      resolve(value)
    })
  }

  static reject = value => {
    return new APromise((resolve, reject) => {
      reject(value)
    })
  }

  static all = promises => {
    return new APromise((resolve, reject) => {
      const result = []
      let count = 0
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(
          value => {
            result[i] = value
            count++
            if (count === promises.length) {
              resolve(result)
            }
          },
          reason => {
            reject(reason)
          }
        )
      }
    })
  }

  static race = promises => {
    return new APromise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(
          value => {
            resolve(value)
          },
          reason => {
            reject(reason)
          }
        )
      }
    })
  }

  static any = promises => {
    return new APromise((resolve, reject) => {
      let count = 0
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(
          value => {
            resolve(value)
          },
          reason => {
            count++
            if (count === promises.length) {
              reject(reason)
            }
          }
        )
      }
    })
  }

  static allSettled = promises => {
    return new APromise(resolve => {
      const result = []
      let count = 0
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(
          value => {
            result[i] = { status: 'fulfilled', value }
            count++
            if (count === promises.length) {
              resolve(result)
            }
          },
          reason => {
            result[i] = { status: 'rejected', reason }
            count++
            if (count === promises.length) {
              resolve(result)
            }
          }
        )
      }
    })
  }
}
```

参考：[Promises](https://www.mauriciopoppe.com/notes/computer-science/computation/promises/)