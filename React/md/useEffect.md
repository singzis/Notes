# useEffect 使用不完全指南

列一些在使用 useEffect 的时候，经常会遇见的一些问题，以及一些使用总结

- [useEffect 中的 props 和 state](useEffect中的props和state)
- [useEffect 的依赖](useEffect的依赖)
- [useEffect 的清除](useEffect的清除)
- [useEffect 中的数据请求](useEffect中的数据请求)
- [useEffect 中的回调函数](useEffect中的回调函数)

## useEffect 中的 props 和 state

props 或者 state 的更新会触发组件的重新渲染，
每次渲染都会有它自己的 effct，
且 effect 会捕获专属于它自己的数据流 props 和 state，
而且每个 effect 中的数据都不同于以往，
（这也是为什么有时候 effect 中的 props 和 state 会是旧值的原因，组件更新没能使 effect 重新创建去捕获新的 props 和 state，导致存在其中的 props 和 state 还是之前的值，这是遗漏了一些依赖导致的）

```js
function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      console.log(count);
    }, 3000);
  }, [count]);

  return <button onClick={() => setCount(count + 1)}>+</button>;
}
```

count 的变化会导致组件的更新，重新渲染后的组件会执行 effect

```js
// 初次渲染时,count取的是默认值0，在此时，effect捕获到属于他的count:0
// ...
useEffect(() => {
  setTimeout(() => {
    console.log(0); // 此刻的count为0
  }, 3000);
}, [count]);
// ...

// 在点击按钮增加count后,count变化导致组件重新渲染，生成新的effect并在渲染完成后运行，在此时，effect捕获到属于他的count:1

// ...
useEffect(() => {
  setTimeout(() => {
    console.log(1); // 此刻的count为1
  }, 3000);
}, [count]);
// ...

// ...
```

> 组件内的每一个函数（包括事件处理函数，effects，定时器或者 API 调用等等）会捕获定义它们的那次渲染中的 props 和 state。

## useEffect 的依赖

通过传入依赖，
来告诉 react，
只有当传入的依赖中某个 state 改变时，
才调用 effect。

如果当前渲染中这些依赖项，和上一次运行这个 effect 的值一样，因为没有什么需要同步，react 便会跳过这次 effect。
如果这些依赖中有一个值在两次渲染中不一样，便不能跳过这次 effect，需要同步所有

对于 effect 来说，用到的所有组件内的值，都必须包含在依赖中，包括 props 和 state 以及函数等一切组件里的东西，可以通过传入[]空数组，使 effect 只在组件挂载时执行，因为没有依赖项，后续便不会再被 react 调用

需要注意的是，如果在 effect 中有使用某个 effect 外的某个函数，而这个函数有使用到数据流中的某个 state 或者 props，比如

```js
function App() {
  const [count, setCount] = useState(0);

  const add = () => `react.${count}`;

  useEffect(() => {
    const v = add();
    // do something need v
  }, []);
  return <button onClick={() => setCount(count + 1)}>+</button>;
}
```

希望当 count 改变时，调用一次 add 函数，但是因为 effect 没有把 add 函数归入依赖，effect 便不会接收到 count 的更新，以至于没能及时调用 add

解决办法：

1.把 add 函数放入 effect 中，并把函数用的组件内数据归入依赖（这里是 count）

```js
useEffect(() => {
  const add = () => `react.${count}`;
  const v = add();
  // do something need v
}, [count]);
```

2.如果想复用 add 函数的逻辑，可以把 add 函数作为依赖

```js
const add = () => `react.${count}`;
useEffect(() => {
  const v = add();
  // do something need v
}, [add]);
```

3.2 中的依赖方式过于简单粗暴，因为每次渲染都会更新 add 函数，便会触发 effect 的调用。可以通过使用 useCallback 来包裹函数，并对函数加上依赖，只有在依赖更新时，才更新这个函数

```js
const add = useCallback(() => `react.${count}`, [count]);
useEffect(() => {
  const v = add();
  // do something need v
}, [add]); // 这样在组件渲染时，便不会时刻都更新add函数，仅仅在count变化时才会更新add函数
```

## useEffect 的清除

目的是为了消除 effect 的副作用，比如取消订阅。

清除和 effect 的执行一样，发生在渲染之后，也就是界面上出现新的 UI 后，才会执行旧 effect 的清除操作，然后才是新 effect 的执行操作，并且不用担心旧 effect 中 props 和 state 值的问题，因为他在创建时便已经捕获了需要的数据

```js
useEffect(() => {
  ChatAPI.subscribeToFriendStatus(props.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.id, handleStatusChange);
  };
});
```

执行流程大概是

- `{id: 10}`的数据发生变化为`{id: 20}`
- React 渲染`{id: 20}`的 UI
- 浏览器绘制`{id: 20}`的界面
- React 清除`{id: 10}`的 effect
- React 执行`{id: 20}`的 effect

不用担心 effect 会记错它里面的值，只要他创建后，便一定会捕获到它使用到的组件内的数据流

## useEffect 中的数据请求

- 仅在组件初次渲染后进行数据请求
  - 通过传入空数组[]作为 effect 的依赖，避免在组件更新时执行，仅仅只在组件挂载时执行。在这里，不应该把 Promise 或者 async 函数作为 effect 的第一个参数，因为他们会返回一个 Promise 结构的函数，根据要求，effect 要么什么都不返回，要么就返回清除函数，所以这里应该对这种情况进行包裹处理，比如把他们包在其他函数里进行操作
- 手动请求
  - 通过传入需要的依赖，比如通过输入框搜索做请求，便可以把输入框的值作为依赖，当值改变时便进行搜索请求，也请记得做防抖处理

数据请求主要是需要找准依赖，不设置依赖，会导致组件每次渲染都会发送一次请求，而直接把依赖设置为[]，虽然只会在组件初次渲染后执行一次，其后便不再调用，但需要小心这种情况，需要准确排查是否有用到组件内数据或者函数，最好的方式还是找准 effect 需要的依赖，防止发生未知的错误

## useEffect 中的回调函数

最常见的情况，就是在 effect 中的某个回调函数里，使用当前的 props 或者 state，而不是之前捕获的数据，这种情况就好比在过去使用现在的东西

```js
const [count, setCount] = useState;

useEffect(() => {
  const data = request("www.website.com/api=api", {
    success() {
      // 请求成功后执行,并打印最新的count
      console.log(count);
    }
  });
}, []);
```

这种情况在 class 组件里屡见不鲜，在 componentDidMount 中做完数据请求后，需要用到某些值，我们只需要通过 this 便可轻易拿取到。或者比较常用的就是在 componentDidMount 设置 swiper 组件，因为渲染的原因，DOM 会延迟生成，但需要在组件中使用到这个 swiper DOM

在 effect 中，需要达到这样的标准，就得对数据进行 useRef 处理

```js
const [count, setCount] = useState;
const latestCount = useRef(count);

useEffect(() => {
  latestCount.current = count;
  const data = request("www.website.com/api=api", {
    success() {
      // 请求成功后执行,并打印最新的count
      console.log(latestCount.current);
    }
  });
}, []);
```

swiper 类似的写法

```js
const [someNode, setSomeNode] = useState;

useEffect(() => {
  const mySwiper = new Swiper(".swiper-container", {
    // ...
    on: {
      slideChangeTransitionStart: () => {
        console.log(someNode)
      }
    }
  });
}, []);

return <>
  <div className="swiper-container">...</div>
  <div ref={someNode}>some node</div>
</>
```

useRef包裹的数据，就有点像class中this.state一样，每次对数据的修改，都是修改的state中的东西，不像捕获到的props和state，你没法保证在任意一个回调函数中latestCount.current的值是不变的，而且根据定义，可以随时修改它

这里也再次诠释了useState中一个要点，就是setCount的作用是替换原先的值，不管你是单独的一个数还是一个对象，而不是像this.setState一样，是靠合对象并来产生的新值，比如`{...oldState, ...newState}`

参考：

- [useEffect 完整指南](https://overreacted.io/zh-hans/a-complete-guide-to-useeffect)
- [How to fetch data with React Hooks?](https://www.robinwieruch.de/react-hooks-fetch-data)
