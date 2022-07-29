# React.Suspense

> 用于某些组件需要经历一些列操作后再渲染的情况，例如请求数据，在未达到要求之前，由`fallback`中的节点代替渲染

1. React.Suspense 用于包裹组件，使用时不能写于需要做Suspense处理的组件内部

```tsx
import React from 'react'
import Child from './child'

export default () => (
  <React.Suspense fallback={<div>loading...</div>}>
    <Child />
  </React.Suspense>
)
```
