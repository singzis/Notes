手写一个Promise/A+，整体还是能更完整的认识Promise的
```js
// 首先是Promise的三个状态
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class APromise {
  constructor(executor) {
    // 初始化状态
    this.state = PENDING
    // 成功时的值和失败的错误原因都映射到‘value’上
    // 初始时无‘value’

    // .then 队列
    this.queue = []

    // 执行传入的函数
    doResolve(this, executor)
  }

  then(onFulfilled, onRejected) {
    const promise = new APromise(() => {})
    handle(this, { promise, onFulfilled, onRejected })
    return promise
  }
}

function fulfill(promise, value) {
  if (value === promise) {
    return reject(promise, new TypeError())
  }
  if (value && (typeof value === 'object' || typeof value === 'function')) {
    let then
    try {
      then = value.then
    } catch (err) {
      return reject(promise, err)
    }

    if (then === promise.then && promise instanceof APromise) {
      promise.state = FULFILLED
      promise.value = value
      return finale(promise)
    }

    if (typeof then === 'function') {
      return doResolve(promise, then.bind(value))
    }
  }

  promise.state = FULFILLED
  promise.value = value
  finale(promise)
}

function reject(promise, reason) {
  promise.state = REJECTED
  promise.value = reason
  finale(promise)
}

function finale(promise) {
  const length = promise.queue.length
  for (let i = 0; i < length; i++) {
    handle(promise, promise.queue[i])
  }
}

// 为executor创建参数
function doResolve(promise, executor) {
  let called = false

  function wrapFulfill(value) {
    if (called) {
      return
    }
    called = true
    fulfill(promise, value)
  }

  function wrapReject(reason) {
    if (called) {
      return
    }
    called = true
    reject(promise, reason)
  }

  try {
    executor(wrapFulfill, wrapReject)
  } catch (err) {
    wrapReject(err)
  }
}

function handle(promise, handler) {
  // 使用while是因为嵌套的promise本身有可能有另一个promise作为解析值
  // 获取最深层的promise
  while (promise.state !== REJECTED && promise.value instanceof APromise) {
    promise = promise.value
  }

  // 通过状态判断执行
  // 当前状态为pending时，则将then回调函数推入then队列
  // 不是pending则立即执行当前then回调
  if (promise.state === PENDING) {
    promise.queue.push(handler)
  } else {
    handleResolved(promise, handler)
  }
}

function handleResolved(promise, handler) {
  setImmediate(() => {
    const cb =
      promise.state === FULFILLED ? handler.onFulfilled : handler.onRejected
    // 如果参数不是函数，则立即执行resolve
    if (typeof cb !== 'function') {
      if (promise.state === FULFILLED) {
        fulfill(handle.promise, promise.value)
      } else {
        reject(handle.promise, promise.value)
      }
      return
    }
    try {
      const value = cb(promise.value)
      fulfill(handle.promise, value)
    } catch (err) {
      reject(handle.promise, err)
    }
  })
}
```

参考：[Promises](https://www.mauriciopoppe.com/notes/computer-science/computation/promises/)