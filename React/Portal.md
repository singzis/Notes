# Portal

Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案

```react
ReactDOM.createPortal(child, container)
```

第一个参数（`child`）是任何[可渲染的 React 子元素](https://zh-hans.reactjs.org/docs/react-component.html#render)，例如一个元素，字符串或 fragment。第二个参数（`container`）是一个 DOM 元素