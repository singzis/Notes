# webpack 基础掌握

记录 webpack 使用中基础配置知识，成套的配置在[work-cli](https://github.com/Singz72/work-cli)。

webpack 就好比一个包装厂，我们有制作完成的产品（项目），通过 webpack 这个包装厂，对我们的产品进行上市的包装。我们把项目放到包装厂流水线起点（entry），期间会有一些模块（module）会对产品进行处理，比如上色、抛光等，但也存在一些自定义（plugins）的操作，比如在适当的时机适当的地方贴标签，最后到流水线尽头（output），完成对产品的包装。

然后我们通过加工步骤来逐步拆解 webpack 的流程。

## 准备条件

通过`npm init -y`初始化项目，然后在`src`下新建`index.js`，新建`webpack.config.js`配置 webpack。

基本目录：

- src/index.js
- package.json
- webpack.config.js

## 启动包装（webpack）

> 整条包装线，我们可以通过 webpack 命令来启动。

需要在`package.json`文件中写明脚本命令：

```json
{
  "scripts": {
    "build": "webpack"
  }
}
```

然后通过命令`npm run build`来执行我们包装线。

## 入口（entry）

> 包装厂的入口，用以输入产品。指定产品（项目）所在地址，程序启动后会对指定地址的产品（项目）进行加工和包装。即每一个 html 都对应一个入口，单页应用程序（SPA）有一个入口，多页应用程序（MAP）就会有多个入口。

entry 可以接受字符串、字符串数组、对象和函数等作为值。如果是数组，则其中字符串指定的所有项目都会在程序启动时执行，并且`chunk name`和指定字符串时一样都是`main`。如果是对象，有健值对组成，其中健（key）就是`chunk name`，值指向页面位置。如果是函数，则作为一个动态入口，需要返回字符串、数组和对象。

entry 默认值是`./src/index.js`

```js
module.exports = {
  entry: () => {
    return "./src/index.js";
  },
};
```

## 模式（mode）

> 包装过程中指定产品（项目）的主要使用环境。一般存在'develpoment'和'production'两种环境。

```js
module.exports = {
  mode: "development", // 适用于开发环境
};
```

## 模块（module）

> 包装中的主要处理阶段，因为我们的包装器其实是很蠢很低能的，会存在许多包装情况（rules），他不知道在这个情况下需要上色或者抛光，所以我们需要指明，当遇到 A 情况时，就对其上色，遇到 B 情况时就对其抛光，这里的这些操作就通过 loader 来实现。在 webpack 中就是对一些非 js 文件进行处理，因为 webpack 只认识 js 文件。比如 webpack 需要解析`.css`文件时，就要使用 css 相关的 loader；需要解析`.png`等图片资源时，就需要`url-loader`等 loader。存在在许许多多的 loader，足以应对我们遇见的各种场景。

```js
module.exports = {
  modules: {
    rules: [
      {
        test: /.jsx$/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: function () {
                return [
                  require("autoprefixer")({
                    overrideBrowserslist: [">0.25%", "not dead"],
                  }),
                ];
              },
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
};
```

过程中`rules`指明了一些规则，每个规则需要通过`tset`属性指定的正则来进行匹配，当文件匹配成功，则进行对应的 loader 处理。use 可以接受一个字符串或者数组来说明要用到的 loader。

用什么 loader 来处理，我们是通过`use`属性指明的，比如对于`.css`文件，我们则会对他进行兼容（postcss-loader）、解析`@import`和`require`引入的 css 内容（css-loader）和在`head`标签中添加`style`标签。在用 loader 处理文件的过程中，loader 的调用规则是从左到右，即 postcss-loader->css-laoder->style-loader。

在其中我们调用`postcss-loader`时，有通过`options`对这个 loader 进行一些规则处理，比如这里则是使用了`autoprefixer`插件，对一些 css 属性加浏览器前缀。

在每一个 rule 中，我们可以通过指明`exclude`和`include`属性来注明对哪些文件下的匹配内容不处理或者处理。

其他的一些的关于 module 的配置还是需要翻阅[文档](https://webpack.js.org/loaders/)

## 自定义（plugins）

> 整个包装的灵魂所在，可以做出各种自定义的行为，可以对产品（项目）优化和压缩。每一个插件我们都需要 require 进来，然后根据目的而使用。

比如如果我们需要对构建出的 html 文件做处理，先在 public 下新建一个 index.html，作为我们的模版，然后配置 webpack：

```js
// webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-config");

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html", //
      filename: "index.html",
    }),
  ],
};
```

配置好之后，就指明了我们的模版所在地址，以及在构建后，我们新的 html 文件的名称，而且生成的 html 会自动为我们创建`script`标签引入我们之后构建好的`index.js`。还有许多[plugin](https://www.webpackjs.com/plugins/)可以供我们使用。

## 全自动化（webpack-dev-server）

> 包装全由机器完成。开发环境中我们是难免会对内容进行更改的，我们在每次更改后，可以让 webpack 帮我们 relaod，更新页面上的内容。

我们可以通过更改启动命令，在本地起一个 node 服务，来进行 reload：

```json
{
  "scripts": {
    "dev": "webpack-dev-server",
    "build": "webpack"
  }
}
```

然后通过命令`npm run dev`启动，则一个 dev 服务启动成功，我们有对内容做出更改后，webpack 便会帮我们 reload。但这仅在开发环境中有效。

## 出口（output）

通过 webpack 编译构建的项目的地址。通过该属性可以对其命名，默认为`./dist`，也可以通过其他属性来对构建文件做处理。

```js
module.exports = {
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "[name].build.js",
  },
};
```

`path`则是指明文件输出的地址，这里指明在项目的`build`目录下，webpack 会自动生成这个目录。`filename`则指明了输出文件名，入口文件名为`index.js`，那么这里构建完成后则为`index.build.js`。其他的配置可以参考官方[output](https://www.webpackjs.com/configuration/output/)

## 总结

写的感觉有点乱，也不是很详细，也算是很基础的东西吧。想要玩好 webpack 还是需要下功夫的，很多功能点都在于对 plugins 的使用，尤其是对文件的优化这一块。不过 webpack 本身就是那种配置型的东西，很多东西还是能谷歌到的，对于知识点的掌握，只要能用能配，知道这个插件是干嘛的就行了，但光做到这一步都是比较困难的，还是要用心的学习 webpack，前期能做到使用就是好事，如果后续还需要对 webpack 深入了解，真的要花心思和功夫。
