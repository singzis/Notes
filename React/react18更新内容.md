Release：[tag v18.0.0](https://github.com/facebook/react/releases/tag/v18.0.0)

## 新API

### useId

在客户端与服务端生成唯一id

```react
const id = useId()
```

### useTransition & startTransition

标记某些state的更新为低优先级（所有其他状态更新或 UI 渲染触发器具有更高的优先级），react允许高优先级的更新可以打断这些state的更新

`startTransition`用于不能使用hook的地方

```react
const [isPending, startTransition] = useTransition()
const [text, setText] = useState('')

const handleChange = (e) => {
  startTransition(() => setText(e.target.value))
}

return (
	<div>
  	<input value={text} onChange={handleChange} />
    <p>{isPending ? '更新中...' : text}</p>
  </div>
)
```

- isPending：`boolean`，告诉react是否处于延迟更新中
- startTransition：`（callback）=> void`，包裹一个更新函数，告诉react这是一个低优先级的更新
- 需要能够操控状态更新的函数，比如这里的`setText`

### useDeferredValue

同`useTransition`，只是包裹的是需要推迟更新的值，用于无法控制状态更新的函数，或者不能使用`useTransition`的时候

```react
function List(list) {
  const _list = useDeferredValue(value)
  
  return <div>
  	{list.map(l => <p>{l.name}</p>)}
  </div>
}
```

### useSyncExternalStore & useInsertionEffect

主要用于库中的api

## React DOM Client

废弃`ReactDOM.render`和`ReactDOM.hydrate`，采用新的API，通过`react-dom/client`导出

- `createRoot`：创建一个根结点用以渲染或者卸载
- `hydrateRoot`：水合一个服务器渲染的程序

```react
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
  	<App />
  </React.StrictMode>
)
```

## 功能改进

- 自动批处理：[说明](https://github.com/reactwg/react-18/discussions/21)，在 React 18 之前，React只在事件处理程序期间批量更新。 默认情况下，Promise、setTimeout、本机事件处理程序或任何其他事件内部的更新不会在 React 中批处理。加入createRoot的React18，将会自动批处理状态更新，无论在什么地方

  ```react
  function App() {
    const [count, setCount] = useState(0);
    const [flag, setFlag] = useState(false);
  
    function handleClick() {
      fetchSomething().then(() => {
        // react17及更早的版本中，以下事件不会批处理
        // 因为回调函数发生在事件之后，而不是事件期间
        setCount(c => c + 1); // 产生一次 re-render
        setFlag(f => !f); // 产生一次 re-render
      });
      fetchSomething().then(() => {
        // React 18
        setCount(c => c + 1);
        setFlag(f => !f);
        // 仅执行一次重新渲染
      });
  
    }
  
    return (
      <div>
        <button onClick={handleClick}>Next</button>
        <h1 style={{ color: flag ? "blue" : "black" }}>{count}</h1>
      </div>
    );
  }
  ```

  - 可以通过`ReactDOM.flushSync()`退出批处理

    ```react
    import { flushSync } from 'react-dom'; // Note: react-dom, not react
    
    function handleClick() {
      flushSync(() => {
        setCounter(c => c + 1);
      });
      // 重新渲染
      flushSync(() => {
        setFlag(f => !f);
      });
      // 重新渲染
    }
    ```

    

- Stricter Strict Mode：更严格的严格模式，这是未来的功能，通过`<React.StrictMode />`包裹组件，使组件在卸载之间保持状态。目前是为了做好准备，目前仅限开发阶段使用。React会自动卸载并重新安装每个组件，当组件第一次挂载后，在第二次挂载时会恢复上一次的状态

- React 现在总是同步刷新副作用函数
- 挂起树保持一致：如果一个组件在添加进树之前由于异步操作保持挂起，react不会将该组件以不完整的状态添加到树中或者触发该组件的副作用函数，反之，react会丢弃创建中的树，等待异步操作完成，然后尝试重新渲染，期间不会阻塞浏览器
- react现在依赖现代浏览器的功能：Promise、Symbol和Object.assign等，旧版浏览器需要手动做兼容