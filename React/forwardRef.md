# forwardRef 的使用

> React.forwardRef

函数组件上无法使用 ref，因为没有实例，需要通过 forwardRef 转化，然后通过 ref 指向目标节点，并且 ref 一般作为 forwardRef 包裹的组件的第二个参数传入（第一个是 props），第二个参数 ref 只在使用 forwardRef 定义组件时存在。常规函数和 class 组件不接收 ref 参数，且 props 中也不存在 ref

forwardRef 的类型：

```ts
function forwardRef<T, P = {}>(
  render: ForwardRefRenderFunction<T, P>
): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>
```

接受一个类似于类型为`ForwardRefRenderFunction`的普通组件`render function`作为参数，返回一个类型为`ForwardRefExoticComponent`的最终组件，这两个只是具有附加属性 displayName、defaultProps 等的函数类型声明

一般无法使用 forwardRef 创建泛型通用组件，需要使用一些技巧，就可以使组件可以额外添加新的属性

目标组件：

```tsx
import React, { Ref, ReactElement } from 'react'

type Option<O = unknown> = {
  value: O
  label: string
}

type Props<T extends Option<unknown>> = {
  options: T[]
}

const options = [
  { value: 1, label: 'la1', flag: false },
  { value: 2, label: 'la2', flag: true },
]

const myRef = React.createRef<HTMLDivElement>()

// 需要添加ref的组件
const FRefInputComp = <T extends Option>(
  p: Props<T>,
  ref: Ref<HTMLDivElement>
) => (
  <div ref={ref}>
    {p.options.map(o => (
      <p>{o.label}</p>
    ))}
  </div>
)
```

1.类型断言

```tsx
const FRefOutComp1 = React.forwardRef(FRefInputComp) as <T extends Option>(
  p: Props<T>,
  ref?: Ref<HTMLDivElement>
) => ReactElement

const Comp1 = () => <FRefOutComp1 options={options} ref={myRef} />
```

2.包装组件

```tsx
const FRefOutComp2 = React.forwardRef(FRefInputComp)

const Wrapper = <T extends Option>({
  ref,
  ...rest
}: Props<T> & { ref?: Ref<HTMLDivElement> }) => (
  <FRefOutComp2 {...rest} ref={ref} />
)

const Comp2 = () => <Wrapper options={options} ref={myRef} />
```

3.自定义 ref，不使用 forwardRef

```tsx
const FRefOutCmop3 = <T extends Option>(
  p: Props<T> & { ref?: Ref<HTMLDivElement> }
) => (
  <div ref={ref}>
    {p.options.map(o => (
      <p>{o.label}</p>
    ))}
  </div>
)F

const Cmop3 = () => <FRefOutCmop3 options={options} ref={myRef} />
```

4.创建通用型的 forwardRef

在项目中增加一个文件`react-augment.d.ts`，增加 react 的模块类型声明，覆盖 forwardRef 一个新的函数重载类型签名：

（不是很懂这个的适用场景）

```ts
import React from 'react'

declare module "react" {
  function forwardRef<T, P = {}>(
    render: (p: P, ref: ForwardRef<T>)=> ReactElement || null
  ): (p: P & RefAttributes<T>) => ReactElement || null
}
```

## 参考

- [React with Typescript -- Generics while using React.forwardRef](https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref/58473012#58473012)
- [How to use Props with Generics with React.memo](https://stackoverflow.com/questions/60386614/how-to-use-props-with-generics-with-react-memo/60389122#60389122)
