# React Server Component

## 简介

React Server Component（RSC），由react团队2020年12月22日提出的一个方案，把组件放到服务端，据说为了解决开发中的一些痛点，在体验、维护性和性能之间找到一个平衡点

一般而言，只能满足以上两点，按照官方给的例子说明，三个组件应该如何请求数据：

```jsx
function Page({ id }){
  return (
    <Details pageId={id}>
      <Header pageId={id} />
      <Content pageId={id} />
    </Details>
  )
}
```

1. 在组件顶层通过1个fetch请求完所有数据，这样请求会变得很长，用户体验✅维护性❎性能❎
2. 在组件顶层通过3个fetch请求数据，用户体验✅维护性❎性能✅
3. 在各个组件中管理fetch请求数据，用户体验❎维护性✅性能✅

改进方案一般都是优化后端逻辑，提升接口访问速度

而通过RSC进行优化可以直接拿到带有数据的组件而不需要多次请求，结果就是部分组件请求数据的逻辑会发生改变，现在我们是通过组件向服务端多次发送请求获取数据，来往信息是数据

![1](https://pic3.zhimg.com/80/v2-5e24a6440ac701c796c0e45e0d53d96a_1440w.jpg?source=1940ef5c)

通过RSC可以把一些fetch丢到服务端，客户端只负责部分渲染逻辑，也就不再需要多次访问服务端了，来往信息就是组件，只要符合组件接口，不用关心组件内部数据的逻辑处理

![2](https://pic3.zhimg.com/80/v2-e893a7e1d3597764b2425ddc3bce3744_1440w.jpg?source=1940ef5c)

并且因为RSC主要是在服务端计算的，前端文件打包后RSC组件不会带入包中，可以减少包的大小，并且服务端中引入一些依赖也不会，可以看到build后，文件中仅含有客户端组件

![img](/Users/zhouxing/Downloads/WeChat2ab2f5093d98a8c3b5d628634fd88d96.png)

## 基本示例

RSC通过后缀区分组件，以`.server.js`结尾的为服务端组件，以`client.js`结尾的为客户端组件（现react组件），以官方demo举例：

```jsx
// Note.server.js
import { db } from './db.server'
import NoteEditor from './NoteEditor.client';

export default Note({ selectedId, isEditing }) {
  const note = db.query(`select * from notes where id = $1`, [selector]).rows[0] // 数据都在rows字段中
  
  return (
    <div>
      <h1>{note.title}</h1>
      <section>{note.body}</section>
      {isEditing ? <NoteEditoe note={note} /> : null}
    </div>
  )
}
```

- 这是一个服务端组件，通过接受props渲染节点，但是存在的问题是无法维持自身的状态
- 无法访问DOM和其他的浏览器api
- 可以直接访问数据库，或者调用api以及访问文件
- 可以直接引用客户端组件，并在浏览器上渲染，后续打包会做区分

```tsx
// NoteEditor.client.js
import { useState } from 'react'

export default NoteEditor({ note }) {
  const [title, setTitle] = useState(note.title)
  const [body, setBody] = useState(note.body)
  
  const updateTitle(e) => {
    setTitle(e.target.value)
  }
  
  const updateBody = (e) => {
    setBody(e.target.value)
  }
  
  const onSubmit = () => {
    // TODO
  }
  
  return (
    <form onSubmit={onSubmit}>
      <input name="title" onChange={updateTitle} value={title}/>
      <textarea name="body" onChange={updateBody}>{body}</textarea>
    </form>
  )
}
```

这是一个客户端组件，和平时的react组件一样，没有区别，除了后缀多了一个`client`，并且可以保持状态，访问DOM等

## 核心功能

RSC的实现目前主要依靠一个webpack插件`react-server-dom-webpack`。通过该插件可以实现差异化打包，针对`client.js`后缀的组件进行打包

```js
const ReactServerWebpackPlugin = require('react-server-dom-webpack/plugin');
webpack(
  {
    // ... 
    plugins: [
      // ...
      // 不对server组件做打包处理
      new ReactServerWebpackPlugin({isServer: false}),
    ],
  },
);
```

跑一下官方的demo，本地通过Server启动一个Express服务，启用webpack打包成静态资源，通过浏览器访问页面，会有一个`react?`开头的请求去获取项目的所有组件，然后由`react-server-dom-webpack`打包处理返回一个序列化的特殊格式：

```js
// Cache.client.js
import {createFromFetch} from 'react-server-dom-webpack';

export function useServerResponse(location) {
  const key = JSON.stringify(location);
  const cache = unstable_getCacheForType(createResponseCache);
  let response = cache.get(key);
  if (response) {
    return response;
  }
  // 核心，通过react-server-dom-webpack对请求做处理
  response = createFromFetch(
    fetch('/react?location=' + encodeURIComponent(key))
  );
  cache.set(key, response);
  return response;
}
```

![image-20211205222109097](/Users/zhouxing/Library/Application Support/typora-user-images/image-20211205222109097.png)

> M：客户端组件
>
> S：react.Suspense组件，包裹带有请求的组件，让我们等待组件加载，可以做一些loading处理
>
> J：服务端组件，一个带有节点信息的JSON数据

然后客户端得到response，再利用`react-server-dom-webpack`插件解析这个特殊格式的数据，遇到M则通过访问姿态资源获取对应的组件，遇到J则反序列化JSON得到一个真正的组件，最后渲染到页面上

```js
// Root.client.js
function Content() {
  const [location, setLocation] = useState({
    selectedId: null,
    isEditing: false,
    searchText: '',
  });
  // 核心，通过react-server-dom-webpack对响应做解析
  const response = useServerResponse(location);
  return (
    <LocationContext.Provider value={[location, setLocation]}>
      {response.readRoot()}
    </LocationContext.Provider>
  );
}
```

## 与SSR的关系

看起来很像SSR（Server-Side Rendering)，但是和SSR是有本质不同的：

- SSR通过服务端计算插入数据，把渲染后的html返回给客户端
- RSC返回是一种特殊格式，需要通过插件解析渲染组件，所以不支持SEO
- SSR每一个请求都是一个html，一个SSR即一个应用，无法维持状态
- RSC不管请求多少次都是在同一个html中，客户端组件保持的状态是不会丢失的

## 总结

基础：

1. 服务端组件.server.js，客户端组件.client.js，共享组件.js（可以在客户端服务端工作，单同时具备两者的劣势）
2. 核心功能来自插件react-server-dom-webpack
3. 不同于SSR的地方在于返回的不是html，而是chunks
4. 服务端组件通过反序列化渲染，客户端渲染
5. 服务端组件可以作为客户端组件子组件，反之也行

优势：

1. 减少bundle包体积，尤其是高依赖无状态组件（编辑器？）
2. 可以直接通过db获取数据或者调用api、访问文件
3. 常规数据只用请求一次，比如列表页：`useEffect(() => fetch(),[])`，可以直接获取
4. 组件共享（试想一下，可能以后不是单纯的像antd那样的组件，公司可以实现公共调用的业务组件，不用关心数据如何处理的）
5. 市面上也有类似产品，但RSC属于react生态

劣势：

1. 服务端组件无状态，仅客户端组件可以保持状态
2. 不支持渲染周期（useEffect等）
3. 不支持浏览器API
4. 无法SEO（可以用SSR做首屏，单独通过另一个文件做客户端渲染，使用RSC）
5. 学习成本高（sql、服务端知识、环境配置等等）
6. 心智模式会转变（使用惯了redux再用其他的是有点不适应）



现阶段RSC除了一定的学习成本外，基础配置也不是很简洁，但从业务上看更加细粒度的管理组件，并且可以实现组件共享，从职业上看也扩展了前端技术边界（卷起来？），个人还是挺期待这个功能。



## 相关参考

- [React server components介绍](https://zhuanlan.zhihu.com/p/340816128)
- [如何看待 React Server Components？](https://www.zhihu.com/question/435921124)
- [server-components-demo](https://github.com/reactjs/server-components-demo)
- [RFC](https://github.com/josephsavona/rfcs/blob/server-components/text/0000-server-components.md)