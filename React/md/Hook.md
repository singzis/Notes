#### useState

```js
const [state, setState] = useState(initialState);
```

返回一个`state`，和更新该`state`的函数

在组件初始渲染时，会接收一个值 `initialState` 作为初始 `state`，可以组件内任意位置使用该 `state`

`setState` 可以在后续用来更新`state`，通过接受一个值，作为新的 `state`，*替换*原有的 `state`，并触发一次新的渲染

```js
setState(newState)
```

> 在后续的重新渲染中，`useState` 返回的第一个值将始终是更新后最新的 `state`

##### 函数式更新

在需要使用先前的 `state` 来计算新的 `state` 时，可以通过传递函数给 `setState`，该函数会接收先前的 `state`，并返回一个更新后的 `state`。

```js
setState(prevState => prevState + 1)
```

> 与 `class` 组件中的 `setState` 方法不同，`useState` 不会自动合并更新对象。可以用函数式的 `setState` 结合展开运算符来达到合并更新对象的效果，否则新返回的对象 `state` 可能会丢失某些属性

```js
setState(prevState => {
     return {...prevState, ...newState}
})
```


##### 惰性初始 state

`initialState` 只会在初始渲染时有效，后续的渲染都会采用当前的最新值。如果初始值需要经过一系列计算，可以传入一个函数，并返回初始 `state`，而这个函数也只会在初次渲染时调用

```js
const [state, setState] = useState(() => {
    const initialState = getSomethingFromProps(props)
    return initialState
})
```

#### useEffect

```js
useEffect(() => {
    effect
    return () => {
        cleanup
    }
}, [input])
```

接收一个一个包含命令式、且可能有副作用代码的函数，类似于class组件中的componentDidMount、componentWillUnmount和componentDidUpdate等生命周期函数

默认情况下，`useEffect` 会在组件渲染结束后执行，也可以设置为仅在某些值改变后执行

##### 清除 effect

可以通过返回函数，在 `effect` 被注销/卸载前执行，以此处理一些事件，如同前面的 `useEffect` 中返回的函数，并且在组件多次渲染的情况中，执行下一个 `effect` 之前，上一个 `effect` 会被清除(这里的 `effect` 指的是代码中相同位置的 `effect`)

##### effect 的执行机制

在浏览器完成绘制之后，传入 `useEffect` 的函数会延迟执行，可以用于设置订阅以及事件处理等情况，因此不适宜在函数中执行会阻塞浏览器更新屏幕的操作

`useEffect` 会保证在 `React` 任何新的渲染前执行完毕

##### effest 的条件执行

`useEffeft` 可以通过接收第二个参数，来约定 `effect` 什么时候会被重新创建

这个参数为一个数组，需要确保数组中的值为*所有外部作用域中会变化并且在 `useEffect`中使用的变量*，否则函数会使用到之前渲染的旧变量，如同上面的`[input]`

如果仅想执行一次`effect`（在组件挂载和卸载时执行），可以传递一个空数组`[]`作为第二个参数，因为不需要依赖任何变量，所以不会执行第二次，而其中使用到的 `props`和`state`就会一直保持着初始值

#### useContext

```js
const value = useContext(MyContext)
```

接收一个context对象（`React.createContext`的返回值）并返回该context的当前值。当前的 context 值由上层组件中距离当前组件最近的 `<MyContext.Provider>` 的 value prop 决定

但组件上层最近的 `<MyContext.Provider>` 更新时，该Hook会触发渲染，并使用最新传递给`MyContext` provider 的context value值

> 如果你在接触 Hook 前已经对 context API 比较熟悉，那应该可以理解，`useContext(MyContext)` 相当于 class 组件中的 `static contextType = MyContext` 或者 `<MyContext.Consumer>`。
> `useContext(MyContext)` 只是让你能够读取 context 的值以及订阅 context 的变化。你仍然需要在上层组件树中使用 `<MyContext.Provider>` 来为下层组件提供 context。

[useContext](https://zh-hans.reactjs.org/docs/hooks-reference.html#usecontext)
