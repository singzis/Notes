# 手撕 Promise/A+

手写一个不完全的 Promise/A+，整体还是能更完整的认识 Promise 的

```js
const Pending = 'pending'
const Fulfilled = 'fulfilled'
const Rejected = 'rejected'

class APromise {
  constructor(executor) {
    this.state = Pending
    this.value = null
    this.handlesQueue = []

    const fulfill = value => {
      if (this.state === Pending) {
        this.state = Fulfilled
        this.value = value
        this.handlesQueue.forEach(this.handle)
        this.handlesQueue = []
      }
    }

    const reject = reason => {
      if (this.state === Pending) {
        this.state = Rejected
        this.value = reason
        this.handlesQueue.forEach(this.handle)
        this.handlesQueue = []
      }
    }

    try {
      executor(fulfill, reject)
    } catch (e) {
      reject(e)
    }
  }

  handle = cb => {
    if (this.state === Pending) {
      this.handlesQueue.push(cb)
    } else if (this.state === Fulfilled && cb.onFullField) {
      cb.onFullField(this.value)
    } else if (this.state === Rejected && cb.onRejected) {
      cb.onRejected(this.value)
    }
  }

  then = (onFullField, onRejected) => {
    return new APromise((resolve, reject) => {
      this.handle({
        onFullField: val => {
          try {
            if (typeof onFullField === 'function') {
              // 这里是关键，如果onFullField返回的是一个Promise，那么就会等待这个Promise的状态变化，目前该函数不具备处理返回Promise的能力
              resolve(onFullField(val))
            } else {
              resolve(val)
            }
          } catch (e) {
            reject(e)
          }
        },
        onRejected: val => {
          try {
            if (typeof onRejected === 'function') {
              // 这里是关键，如果onRejected返回的是一个Promise，那么就会等待这个Promise的状态变化，目前该函数不具备处理返回Promise的能力
              resolve(onRejected(val))
            } else {
              reject(val)
            }
          } catch (e) {
            reject(e)
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
      val => {
        onFinally()
        return val
      },
      reason => {
        onFinally()
        return reason
      }
    )
  }

  static resolve = val => new Promise(resolve => resolve(val))

  static reject = reason => new Promise((_, reject) => reject(reason))

  static all = promises => {
    return new APromise((resolve, reject) => {
      const result = new Array(promises.length)
      let count = 0
      promises.forEach((promise, idx) => {
        promise
          .then(
            val => {
              count++
              result[idx] = val
              if (count === promises.length) {
                resolve(result)
              }
            },
            reason => {
              reject(reason)
            }
          )
          .catch(reject)
      })
    })
  }

  static allSettled = promises => {
    return new APromise((resolve, reject) => {
      const result = new Array(promises.length)
      let count = 0
      promises.forEach((promise, idx) => {
        promise
          .then(
            val => {
              count++
              result[idx] = {
                state: Fulfilled,
                value: val,
              }
              if (count === promises.length) {
                resolve(result)
              }
            },
            reason => {
              count++
              result[idx] = {
                state: Rejected,
                value: reason,
              }
              if (count === promises.length) {
                resolve(result)
              }
            }
          )
          .catch(reject)
      })
    })
  }

  static race = promises => {
    return new APromise((resolve, reject) => {
      promises.forEach(promise => {
        promise
          .then(
            val => {
              resolve(val)
            },
            reason => {
              reject(reason)
            }
          )
          .catch(reject)
      })
    })
  }
}
```

参考：[Promises](https://www.mauriciopoppe.com/notes/computer-science/computation/promises/)
