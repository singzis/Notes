# useEffect 使用不完全指南

列一些在使用 useEffect 的时候，经常会遇见的一些问题，以及一些使用总结

- [useEffect 中的 props 和 state](useEffect中的props和state)
- [useEffect 的依赖](useEffect的依赖)
- [useEffect 的清除](useEffect的清除)
- [useEffect 中的数据请求](useEffect中的数据请求)
- [useEffect 中的回调函数](useEffect中的回调函数)

## useEffect中的props和state

props 或者 state 的更新会触发组件的重新渲染，
每次渲染都会有它自己的effct，
且 effect 会捕获专属于它自己的数据流 props 和 state，
而且每个effect中的数据都不同于以往，
（这也是为什么有时候effect中的props和state会是旧值的原因，组件更新没能使effect重新创建去捕获新的props和state，导致存在其中的props和state还是之前的值，这是遗漏了一些依赖导致的）

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

## useEffect的依赖

通过传入依赖，
来告诉react，
只有当传入的依赖中某个state改变时，
才调用effect。

如果当前渲染中这些依赖项，和上一次运行这个effect的值一样，因为没有什么需要同步，react便会跳过这次effect。
如果这些依赖中有一个值在两次渲染中不一样，便不能跳过改次effect，需要同步所有

对于effect来说，用到的所有组件内的值，都必须包含在依赖中，包括props和state以及函数等一切组件里的东西，可以通过传入[]空数组，使effect只在组件挂载时执行，因为没有依赖项，后续便不会再被react调用

需要注意的是，如果在effect中有使用某个effect外的某个函数，而这个函数有使用到数据流中的某个state或者props，比如

```js
function App(){
  const [count,setCount] = useState(0)

  const add = () => console.log(count)

  useEffect(() => {
    add()
  }, [])
  return <button onClick={()=>setCount(count+1)}>+</button>
}
```

当count改变时，边调用一次add函数，但是因为effect没有把add函数归入依赖，effect便不会接收到count的更新，以至于没能及时调用add

解决办法：

1.把add函数放入effect中，并把函数用的组件内数据归入依赖（这里是count）

```js
  useEffect(() => {
    const add = () => console.log(count)
    add()
  }, [count])
```

2.如果想复用add函数的逻辑，可以把add函数作为依赖

```js
  const add = () => console.log(count)
  useEffect(() => {
    add()
  }, [add])
```

3.2中的依赖方式过于简单粗暴，因为每次渲染都会更新add函数，便会触发effect的调用。可以通过使用useCallback来包裹函数，并对函数加上依赖，只有在依赖更新时，才更新这个函数

```js
  const add = useCallback(() => console.log(count),[count])
  useEffect(() => {
    add()
  }, [add]) // 这样在组件渲染时，便不会时刻都更新add函数，仅仅在count变化时才会更新add函数
```

## useEffect的清除

## useEffect中的数据请求

## useEffect中的回调函数
