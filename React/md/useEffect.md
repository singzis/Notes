# useEffect 使用不完全指南

列一些在使用 useEffect 的时候，经常会遇见的一些问题，以及一些使用总结

- [useEffect 中的 props 和 state](useEffect中的props和state)
- [useEffect 的依赖](useEffect的依赖)
- [useEffect 的清除](useEffect的清除)
- [useEffect 中的数据请求](useEffect中的数据请求)
- [useEffect 中的回调函数](useEffect中的回调函数)

## useEffect 中的 props 和 state

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

## useEffect 的依赖

## useEffect 的清除

## useEffect 中的数据请求

## useEffect 中的回调函数
