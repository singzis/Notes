# nextjs 使用指南

## 静态资源

类似于 image 之类的静态资源可以存放在`public`目录下，比如存放一个名称为`avatar.jpg`的图片，我们可以这么访问图片：

```html
<img src="/avatar/jpg" alt="avatar" />
```

## 页面导航

网站里所有页面都来自与`pages`文件，可以在这个文件下创建页面，然后通过文件名来进行页面跳转：

- `pages/index.js` 这个是`/`导航的页面
- `pages/posts/first-post.js` 这个是`/posts/first-post`导航的页面

然后，可以通过用`<Link>`组件包裹`<a>`标签来进行跳转，需要给`<Link>`的`href`属性注明跳转的页面：

```html
<Link href="/">
  <a>主页</a>
</Link>
```

但是如果需要导航到其他页面（比如哔哩哔哩），就需要用`<a>`标签；如果需要给导航加上属性，比如`className`，则直接在`<a>`上加即可

如果需要获取当前路由信息，可以通过`router`来获取：

```js
import router from "next/router";
```

`router`对象游泳一些返回的对象定义：

- `pathname`：当前路由地址，以`/pages`为根目录
- `query`：一个查询对象
- `asPath`：浏览器中显示的实际路径（包括查询）

## 数据获取

在静态渲染的情况下，依旧可以获取外部数据。

我们`export`t 一个 page 时，也可以同时`export`一个`async`函数`getStaticProps`：

- `getStaticProps`在打包时运行
- 可以通过该函数获取数据，并且把它作为`props`返回
