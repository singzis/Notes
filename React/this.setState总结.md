# this.setState(partialState)，react 内部过程总结

## 缘由

因为接手老项目cvd，项目中大多数都是class组件，会用到很多`setState`进行更新，但之前已经写了大半年的hook了，故重新对`setState`进行流程梳理

- react 源码版本：16.8.6

## 流程

### 组件内发起更新请求

react 内部可以通过以下方式更新组件状态：

```js
this.setState(partialState)
```

### partialState 存储于当前组件的 state 暂存队列中

逻辑通过`enqueueSetState(this, partialState, callback)`实现

1.获取当前组件实例

```js
var fiber = get(inst) // inst一般是当前组件，this
```

2.创建更新对象，保存此次更新的信息

```js
var update = createUpdate(expirationTime)
```

update 对象结构：

```typescript
type Update<State> {
  expirationTime: expirationTime, // 到期时间

  tag: 0 | 1 | 2 | 3, // 更新类型
  payload: any, // 负载，保存这次的更新状态
  callback: (() => maixed), // 回调函数，组件渲染完成后需要执行的函数

  next: Update<State> | null, // 下一个更新
  nextEffect: Update<State> | null, // 下一个效果
}
```

### 更新入队

逻辑通过`enqueueUpdate(fiber, update)`实现

1.创建更新队列

react 会为此次更新创建两条更新队列，两条队列共享同一个链表结构`updateQueue`：

```ts
export type UpdateQueue<State> = {
  baseState: State

  firstUpdate: Update<State> | null
  lastUpdate: Update<State> | null

  firstCapturedUpdate: Update<State> | null
  lastCapturedUpdate: Update<State> | null

  firstEffect: Update<State> | null
  lastEffect: Update<State> | null

  firstCapturedEffect: Update<State> | null
  lastCapturedEffect: Update<State> | null
}
```

2.把此次更新插入到更新队列

```js
// react 16.8.6
function appendUpdateToQueue(queue, update) {
  // 把更新加入到队列尾部
  if (queue.lastUpdate === null) {
    // 队列为空
    queue.firstUpdate = queue.lastUpdate = update
  } else {
    queue.lastUpdate.next = update // 之前队列最后一个更新的next指向此次更新
    queue.lastUpdate = update // 此次更新作为队列最后一个更新
  }
}
```

更新队列大概结构如下：

![updateQueue](http://singz72.com/blogImage/react/updateQueue.png)

简述一下 react 使用两条队列的原因：

![twoUpdateQueue](http://singz72.com/blogImage/react/twoUpdateQueue.png)

> UpdateQueue 是优先更新的链表。
> 像 fiber 一样，更新队列是成对出现的：一个当前队列（代表屏幕的可见状态：current queue）和一个进行中的队列（可以在提交之前进行异步更改和处理：work-in-progress queue），这是双重缓冲的一种形式。
>
> 如果我们在进行中队列上已经处理完毕的更新在提交（commit 到当前队列）前被丢弃，我们将通过克隆当前队列来创建新的进行中的队列重新开始渲染。
>
> 两个队列共享一个持久的单链表结构。 当安排更新时，我们会将其插入到两个队列的末尾。 每个队列都维护一个指向单链表中第一个待更新的指针（firstUpdate）。 进行中队列的指针（firstUpdate）的位置始终等于或大于当前队列的指针（firstUpdate），因为我们主要处理在进行中队列上更新，当我们把进行中处理完毕的更新提交（commit）给当前队列时，当前队列的指针进行更新。
>
> 我们插入更新到两个队列的原因，是我们可能会丢弃这些更新。
> 例如，如果我们仅将更新添加到进行中队列，某些原因导致渲染中断，之后再通过复制得到进行中队列，再进行重新渲染，某些更新就可能会丢失。 同样，如果我们仅向当前队列添加更新，则每当一个正在进行的队列提交并与当前队列交换时，更新将丢失。 但是，通过插入到两个队列，我们保证更新将成为下一个进行中的工作的一部分。 （而且，由于进行中的工作队列一旦提交便成为当前队列，因此不存在两次应用相同更新的危险。）

### 请求更新

生成新的更新队列后，需要开始处理更新队列

主要通过`requestWork`函数发起这个任务

这个函数主要的功能就是通过`isBatchingUpdates`判断程序是否处于批处理状态：

1. 处于批处理状态，则将需要更新的当前组件加入待更新组件队列中
2. 未处于批处理状态，将`isBatchingUpdates`设置为`true`，通过 event handler（事务）重新调用上一个方法，保证当前组件被加入到待更新组件队列中

### 处理请求队列

逻辑通过`processUpdateQueue(workInProgress, queue, props, instance, renderExpirationTime)`实现

1. 循环处理每个 update
2. 对每个 update 做优先级判断
3. 请求 state 更新

对更新和优先级做个解释：

> 更新不是按优先级排序，而是按照插入更新队列的顺序排序；
> 新的更新总是附加在列表的末尾。
>
> 但是，优先级仍然很重要。
> 在渲染阶段处理更新队列时，结果中仅包含具有足够优先级的更新。
> 如果由于优先级不足而跳过更新，则该更新将保留在队列中，以便稍后在较低优先级渲染期间进行处理。
> 至关重要的是，跳过更新之后的所有更新也将保留在队列中，无论其优先级如何。
> 这意味着高优先级更新有时会以两个单独的优先级进行两次处理。
> 我们还跟踪基本状态，该状态表示在队列中首次应用更新之前的状态。

### 处理 state

逻辑通过`getStateFromUpdate(workInProgress, queue, update, prevState, nextProps, instance)`实现

1.通过 update.tag 判断更新类型

react 有四种更新类型：

```js
var UpdateState = 0 // 更新状态 需要合并前一次的状态和本次的状态
var ReplaceState = 1 // 替换状态 直接使用下一次的状态
var ForceUpdate = 2 // 强制更新 使用前一次的状态
var CaptureUpdate = 3 // 捕获更新
```

当类型为 UpdateState 和 ReplaceState 时，会判断 payload 的类型：

```js
var _payload = update.payload
if (typeof _payload === 'function') {
  // 更新函数
  // ...
  var nextState = _payload.call(instance, prevState, nextProps)
  // ...
  return nextState
}
```

这里也就是官网文档提供的我们可以通过传入函数来更新 state：

```js
this.setState((prevState, nextProps) => {
  // TODO
})
```

当类型是 UpdateState 时，还会合并前后 state 并作为结果返回：

```js
var _payload = update.payload
var partialState = void 0
if (typeof _payload === 'function') {
  // ...
} else {
  partialState = _payload
}
// 合并当前state和之前的state
return _assign({}, prevState, partialState)
```

这里也就说明日常使用的`this.setState()`就是 UpdateState 类型的更新。不过需要注意，`_assign`是 react 内部一个对象合并函数，但它本身其实是`Object.assign`，通过控制台可以看出：

```js
React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.assign ===
  Object.assign // true
```

所以`this.setState`是一个浅合并！！！

### 提交更新和 shouldComponentUpdate

之后就是提交批次处理更新的结果，并移交给`shouldComponentUpdate`来判断是否 render

## 总结

### 完整流程

1. 将 setState 传入的 partialState 参数存储在当前组件实例的 state 暂存队列中
2. 判断当前 React 是否处于批量更新状态，如果是，将当前组件加入待更新的组件队列中
3. 如果未处于批量更新状态，将批量更新状态标识设置为 true，用事务再次调用前一步方法，保证当前组件加入到了待更新组件队列中
4. 遍历待更新组件队列依次执行更新
5. 将组件的 state 暂存队列中的 state 进行合并，获得最终要更新的 state 对象，并将队列置为空
6. 提交更新
7. 执行生命周期 componentShouldUpdate，根据返回值判断是否要继续更新
8. 执行真正的更新，render
9. 执行生命周期 componentDidUpdate

### 其他问题

#### 批处理、异步和同步更新，执行顺序

关于批处理：简单说就是在一个渲染周期内，如果有多个组件发生更新，最终都会在最后一次`setState`后，放入同一个队列，进行一次统一更新，目的就是防止多个组件进行多次的`render`，提升性能

因为有上面说明，所以在 react 容器中，setState 看起来就是异步操作的，但是对于更新而言，都是按照顺序插入到 update queue 队列的最后面，即`setState`的执行顺序最终是不变的。

但当处于 react 容器之外，比如某些异步事件（setTimeout、Promise 等）的回调函数中，`setState`强制同步更新，不会对 state 进行合并。但可以通过`unstable_batchedUpdates`进行合并（异步）更新。其实在 react 容器内的更新，都是通过`unstable_batchedUpdates`进行的，如果有多层的`unstable_batchedUpdates`，react 会取最外层的该事件进行合并

```js
var ReactDOM = {
  unstable_batchedUpdates: batchedUpdates$1,
  // ...
}
```

```js
Promise.resolve().then(() => {
  ReactDom.unstable_batchedUpdates(() => {
    this.setState({ a: 1 })
    this.setState({ b: 2 }) // 合并两次更新为一次更新
  })
})
```

不过之前有听说，react团队是打算更改这样的逻辑，不管是否在react容器内调用`setState`，都会满足异步更新。但就目前而言，只要在react容器内，就由react说了算。

#### 优先级问题

优先级问题好像是fiber出来之后才有的，不清楚之前的react是否会有这个因素存在。

官方给出一个关于优先级的例子：

![priority](http://singz72.com/blogImage/react/priority.png)

因为以插入顺序处理更新，并且在跳过之前的更新时对高优先级更新进行重新设置，所以无论优先级如何，最终结果都是确定的。中间状态可能会因系统资源而异，但最终状态始终相同。
