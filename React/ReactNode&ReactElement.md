`ReactElement`是带有类型和属性的一个对象

```ts
type Key = string | number
interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
	type: T
	Props: P
	key: Key | null
}
```

`ReactNode`是一个联合类型

```ts
type ReactText = string | number
type ReactChild = ReactElement | ReactText

interface ReactNodeArray extends Array<ReactNode> {}
type ReactFragment = {} | ReactNodeArray

type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined
```

`JSX.Element` 是一个 `ReactElement`，props 的通用属性和类型是 any。它存在，因为各种库可以以自己的方式实现 JSX，因此 JSX 是一个全局命名空间，然后由库设置，React 是这样设置的：

```ts
declare global {
	namespace JSX {
		interface Element extends React.ReactElement<any,any> {}
	}
}
```

比如：

```react
<p> // <- ReactElement = JSX.Element
	<Custom> // <- ReactElement = JSX.Element
		{true && 'test'} // <- ReactNode
	</Custom>
</p>
```

至于为什么class组件和函数组件返回的类型不同，是因为：

`Component`返回：

```ts
render(): ReactNode
```

函数组件是一个无状态组件：

```ts
interface StatelessComponent<P = {}> {
	(props: P & { children?: ReactNode }, context?: any): ReactElement | null
}
```

参考：
[When to use JSX.Element vs ReactNode vs ReactElement?](https://stackoverflow.com/questions/58123398/when-to-use-jsx-element-vs-reactnode-vs-reactelement)