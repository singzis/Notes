手写一个Promise/A+，整体还是能更完整的认识Promise的
```js
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

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

  reject = reason => {
    if (this.state === PENDING) {
      this.value = reason
      this.state = REJECTED
      this.handlers.forEach(this.handle)
      this.handlers = []
    }
  }

  handle = handle => {
    if (this.state === PENDING) {
      this.handlers.push(handle)
    } else if (this.state === FULFILLED && handle.onFulfilled) {
      handle.onFulfilled(this.value)
    } else if (this.state === REJECTED && handle.onRejected) {
      handle.OnRejected(this.value)
    }
  }

  then = (onFulfilled, onRejected) => {
    return new APromise((resolve, reject) => {
      this.handle({
        onFulfilled: value => {
          if (typeof onFulfilled === 'function') {
            try {
              resolve(onFulfilled(value))
            } catch (e) {
              reject(e)
            }
          } else {
            resolve(value)
          }
        },
        onRejected: reason => {
          if (typeof onRejected === 'function') {
            try {
              resolve(onRejected(reason))
            } catch (e) {
              reject(e)
            }
          } else {
            reject(value)
          }
        },
      })
    })
  }

  catch = onRejected => {
    return this.then(null,  onRejected)
  }

  finally = onFinally => {
    return this.then(
      value => {
        return APromise.resolve(onFinally()).then(() => value)
      },
      reason => {
        return APromise.resolve(onFinally()).then(() => {
          throw reason
        })
      }
    )
  }

  static resolve = value => new APromise(resolve => resolve(value))

  static reject = reason => new APromise((resolve, reject) => reject(reason))

  static all = promises => {
    return new APromise((resolve, reject) => {
      const result = new Array(promises.length)
      let count = 0
      promises.forEach((promise, index) => {
        promise.then(
          value => {
            result[index] = value
            count++
            if (count === promise.length) {
              resolve(result)
            }
          },
          reason => {
            reject(reason)
          }
        )
      })
    })
  }

  static any = promises => {
    return new APromise((resolve, reject) => {
      let count = 0
      promises.forEach(promise => {
        promise.then(
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
      })
    }) 
  }

  static race = promises => {
    return new APromise((resolve, reject) => {
      promises.forEach(promise => {
        promise.then(resolve, reject)
      })
    })
  }

  static allSettled = promises => {
    return new APromise(resolve => {
      const result = new Array(promises.length)
      let count = 0
      promises.forEach((promise, index) => {
        promise.then(
          value => {
            result[index] = { status: FULFILLED, value }
            count++
            if (count === promises.length) {
              resolve(result)
            }
          },
          reason => {
            result[index] = { status: REJECTED, reason }
            count++
            if (count === promises.length) {
              resolve(result)
            }
          }
        )
      })
    })
  }
}
```

参考：[Promises](https://www.mauriciopoppe.com/notes/computer-science/computation/promises/)