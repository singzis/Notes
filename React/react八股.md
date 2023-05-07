# 基于React18整理

## 18新增特性

- 新Api
  - useId：在客户端与服务端生成唯一 id
  - useTransition/startTransition：标记某些 state 的更新为低优先级
  - useDeferredValue：同 useTransition，只是包裹的是需要推迟更新的值
  - createRoot/hydrateRoot：取代原来的 ReactDom.render/ReactDom.hydrate，创建一个根结点用以渲染或者卸载/水合一个服务器渲染的程序
- 功能改进
  - 自动批量处理：在 React 18 之前，React 只在事件处理程序期间（理解为React环境中）批量更新。 默认情况下，Promise、setTimeout、本机事件处理程序或任何其他事件内部的更新不会在 React 中批处理（回调中有多次setState，则会触发多次更新，因为不在React环境中）。在React18中，将会自动批处理状态更新，无论在什么地方
  - Suspense
    - 支持SSR
    - 之前异步加载的组件在父级中如果没有找到Suspense组件，则会报错，React18之后不会报错，而是整个组件变成一个异步组件
    - 允许fallback没有值，之前如果fallback没有值，则会往上寻找最近Suspense边界，没有找到的话则报错，React18之后会则不会渲染任何东西，直到异步完成
  - 现在组件能够渲染undefined，之前是函数组件必须返回JSX或者null
- 新能力
  - React server component：服务端组件
  - 并发渲染：提供了协同、基于优先级的渲染、调度和中断，比如通startTransition降低状态的更新优先级
