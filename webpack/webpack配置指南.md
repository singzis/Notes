# webpack 配置指南

记录个人在配置 webpack 时一些心路，方便遇到问题时能及时找到原因。

以一下配置为基础记录：

```js
// webpack.config.js

const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "[name].build.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
```

## html 页面配置

在使用`html-webpack-plugin`时，如果对导出的 html 重命名时有加入 hash 值，则需要对页面做映射（index.html->index.hash.html），不然即使是单页程序，访问也会出问题，因为默认访问的是`index.html`，但现在入口 html 名变成了`index.xxx.html`了。

## css 分离

默认情况下，webpack 解析所有的 css 内容并写入 build 后的 js 文件中，然后会通过`style-loader`，将 css 内容添加到头部 style 标签中。所以如果原本项目就很大的话，js 和 css 揉杂在一起会让 js 文件变得很大，导致加载 js 文件时影响页面的渲染。

这里使用`mini-css-extract-plugin`插件来对 css 文件的抽离，因为不再需要通过 loader 往 html 加入 style 标签，所以直接弃用`style-loader`。

**`mini-css-extract-plugin`只适用于 webpack v4 以上版本。**

> 该插件将 CSS 提取到单独的文件中。 它为每个包含 CSS 的 JS 文件创建一个 CSS 文件。 它支持 CSS 和 SourceMap 的按需加载。

```js
// webpack.config.js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /.\css$/,
        use: [
          {
            laoder: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../", // css中通过url访问的文件，相对于css的公共路径，默认值同output的publicPath
            },
          },
        ],
      },
      "css-loader",
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // 这里属性与output中的属性相似
      filename: "css/[name].css",
      chunkname: "[id].css",
    }),
  ],
};
```

通过对导出 css 文件命名，把它分配进了叫做 css 的目录。因为在`plugins`中配置的`mini-css-extract-plugin`的属性和`output`中的属性近似，这里导出的 css 文件名也和 entry 中指定的 chunkname 一样（默认为 main），所以导出的 css 文件名为'main.css'，也可以命名时指定 hash 值，便于区分更新：`[name].[hash].css`。

这里有一个比较重要的地方就是，比如你在 css 中有引入本地静态资源，而你又恰巧把 css 放入单独的目录下：

```css
/* /css/main.css */

body {
  background-image: url("../assets/images/bg.jpg");
}
```

项目不管是启用热更新或者 build 后，资源地址会被解析为`assets/images/bg.jpg`，控制台便会出现找不到资源的错误，因此我们需要对 css 访问的资源做路径处理：

```test
publicPath: '../'
```

这里就是写明 css 相对于静态资源的路径，也就是把原本 css 中缺失的一部分在 build 后的文件中补上。

## 模块热替换

> 模块热替换（hot module replacement）功能会在应用程序运行过程中，替换、添加或删除模块，而无需重新加载整个页面。简称 HMR。

HMR 带来的优点包括：

1. 会保存页面加载时的应用程序的状态。举例来说就是当我们在页面上选中某个 checkBox 时，reload 会导致我们的选中丢失，但是 HMR 却只会更改需要响应的模块，不会导致我们的状态丢失
2. 只更新我们变动的内容，不用手动刷新页面，可以节约很多开发时间
3. 源码变动时，浏览器会立即更新内容

**HMR 只适用于开发环境**

关于 HMR 的配置，首先是需要启动 WDS 的，在`package.json`中修改脚本：

```json
{
  "script": {
    "dev": "webpack-dev-server"
  }
}
```

然后需要配置一下 webpack.config.js：

```js
module.exports = {
  // plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    // hot: true,
    hotOnly: true,
  },
};
```

这里有几点需要注意：

1. devServer 是作为`webpack-dev-server`的一个 options 配置的地方，所以我们在 devServer 中添加的属性`hotOnly:true`，也可以通过修改脚本命令达到一样的行为：`webpack-dev-server --hotOnly`
2. hot 和 hotOnly 的区别是：前者在未开启 HMR 功能的模块更新内容后，页面会 reload，后者则不会，而是直接在控制台给出警告
3. `HotModuleReplacementPlugin`是 webpack 提供的启动 HMR 的插件，在启用`hot:true`或者`hotOnly:true`的情况下，这个插件会自动被添加，所以可以不用手动添加，除非你有其他的配置需求

关于 HMR 的实现原理：
