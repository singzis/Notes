从0构建一个react+typescript+webpack的项目

1.包管理工具安装

```shell
npm init
```

2.安装主要核心库

```shell
pnpm install react react-dom
```

3.使用typescript编写项目，就需要安装对应的依赖，而且还需要为react和react-dom安装声明文件依赖

```shell
pnpm install "typescript" @types/react @types/react-dom --save-dev
```

然后还需要在根目录下创建tsconfig.json文件配置，不推荐使用`tsc --init`，配置不够全

```json
{
  "compilerOptions": {
    "target": "ES2016",
    "module": "commonjs",
    "strict": true,
    "jsx": "react",
    "sourceMap": true,
    "experimentalDecorators": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false,
    "lib": ["esnext", "dom"]
  },
  "include": ["src"],
  "exclude": ["node_modules", "build"]
}
```

其中`noEmit`会影响typescript编译器是否输出文件，true为不输出，默认值是false，输出文件

4.在根目录下新建`src`文件夹，存放源代码，在下面新建index.tsx作为主入口文件，新建App.tsx作为主程序文件，新建index.html作为模版文件，新建index.module.css作为样式文件

src/App.tsx
```tsx
import React from 'react'

export default () => {
  return <div>App</div>
}
```

src/index.tsx
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
)
```

通过react的能力，会将内容渲染到一个id为root的节点里，需要在html模版中创建一个这样的节点

src/index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

src/index.module.css
```css
.text {
	color: red
}
```

为了解决css声明问题，需要在根目录创建声明文件

.d.ts
```ts
declare module '*.css' {
  const content: { [key in string]: string }
  export default content
}
```

在对应文件夹创建声明文件

src/typings.d.ts
```ts
declare module '*.css'
```


5.使用了tsx语法，所以需要使用babel相关依赖，可以将tsx语法转成浏览器可识别的javascript代码

```shell
pnpm install @babel/core @babel/cli @babel/preset-env @babel/preset-react @babel/preset-typescript --save-dev
```

babel的核心依赖包：
- @babel/core：babel的核心功能，包括转换器和核心插件
- @babel/cli：babel的命令行界面，用于在命令行中运行babel
- @babel/preset-env：一组插件，用于将javascript代码转换为目标浏览器或运行环境的最新版本
- @babel/pollify：用于提供新的javascript特性

@babel/preset-react和@babel/preset-typescript分别是react和typescript的预设，主要用于转换为js代码

然后在根目录创建bable.config.json配置文件，配置上面安装的预设依赖包

bable.config.json
```json
{
  "presets": [
    "@babel/preset-react",
    "@babel/preset-typescript",
    [
      "@babel/preset-env",
      {
        "targets": {
          "edge": "17",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1"
        },
        "useBuiltIns": "usage",
        "corejs": "3.6.5"
      }
    ]
  ]
}
```

6.因为使用webpack做构建工具，需要安装webpack相关依赖

```shell
pnpm install webpack webpack-cli webpack-dev-server --save-dev
```

在根目录新增webpack.config.js配置文件

```js
const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  devServer: {
    hot: true,
    port: 8080,
    open: true,
  },
}
```

为了能使webpack对指定文件作出正确的编译，需要安装对应的loader解析

```shell
pnpm install ts-loader babel-loader style-loader css-loader file-loader --save-dev
```

-   ts-loader：用于加载并转换 TypeScript 代码。
-   babel-loader：用于加载并转换 JavaScript 代码，使用 Babel 进行转换。
-   css-loader：用于加载和解析 CSS 文件，并将其转换为 JavaScript 模块。
-   style-loader：用于在浏览器中加载并应用 CSS 样式。
-   file-loader：用于加载并处理文件，例如图片、字体等

针对打包后的内容，需要安装一个插件

```shell
pnpm install html-webpack-plugin --save-dev
```

-   html-webpack-plugin：用于自动生成 HTML 文件，并将打包后的 JS 和 CSS 自动插入该 HTML 文件中。这样可以节省手动创建 HTML 文件并添加脚本和样式的步骤。
-   ~~clean-webpack-plugin：用于清理构建目录中的旧文件。例如，在每次构建之前，可以使用此插件清理旧文件，以确保只保留最新的构建。这样可以避免旧文件留在构建目录中，从而避免混淆~~clean-webpack-plugin的功能可以通过`output.clean:true`替代，前提是webpack的版本高于5.20

7.在package.json增加相关命令启动和打包项目

```json
"scripts": {
	"start": "webpack-dev-server --mode development",
    "build": "webpack",
}
```


8.增加git管理

```shell
git init
```

根目录新增.gitignore文件，把不需要加入版本管理的文件排除掉

```text
# 设置环境变量
.env

# 编译生成的文件
/dist
/build
/tmp

# 开发过程中的文件
/node_modules

# 项目私有的文件
/coverage
/test-results

# 操作系统生成的文件
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# 其他类型的文件
*.log
*.lock
*.swp
*.out
```

9.本地跑项目和本地打包

```shell
pnpm run start
```

```shell
pnpm run build
```