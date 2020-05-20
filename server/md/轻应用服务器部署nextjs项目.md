# 阿里云轻应用服务器部署 nextjs 项目

## 描述

打算用 nextjs 配合 react hook 写一个博客，但是发现部署并没有 nextjs 官方文档写的那么简单（是我太菜了），踩坑需要记录一下。

## 配置

- nextjs 官方 demo
  - nextjs v9.4.1
  - react v16.13.1
- 轻应用服务器
  - CentOS 7.3 64 位
  - node v14.2.0
  - nginx v1.16.1
  - pm2 v4.4.0

## 前端项目构建

这里直接`yarn create next-app`创建项目，主要内容可以浏览官网[nextjs](https://www.nextjs.cn/docs/getting-started)。

这里改动了文件结构，新增了几个路由页面用以测试。

- pages
  - about.jsx
  - index.jsx
  - layout.jsx
  - other.jsx

`layout.jsx`是项目路由文件，里面主要写路由跳转等一些公用信息。

```js
// index.jsx
import import Head from "next/head";
import Link from "next/link";

export default function Layout(props) {
  return (
    <div className="container">
      <Head>
        <title>next_blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ul>
        <li>
          <Link href="/">home</Link>
        </li>
        <li>
          <Link href="/about">about</Link>
        </li>
        <li>
          <Link href="/other">other</Link>
        </li>
      </ul>
      <div>{props.children}</div>
    </div>
  );
}
```

其他的页面，可以随便写点什么。

本地通过`next dev`可以启动项目，页面正常显示就可以开始部署了。

## 部署

### node 安装和配置

这里用的服务器，是基于 CentOS 镜像创建的 nodejs 应用服务器。

环境如果没有装 NVM，就需要手动安装一个。
NVM 一个 node 版本管理器，可以同时安装多个版本的 node，并可以来回切换。
安装步骤可以按照[官方](https://github.com/nvm-sh/nvm/blob/master/README.md)提供的方法来。

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```

通过 NVM 安装 node 稳定版本，即当前 node 官方提供的最新版本，npm 默认与 node 一起打包下载。

```shell
nvm install stable
```

能够查询到 node 和 npm 的版本号即表示下载成功。

```shell
node -v # v14.2.0
npm -v # 6.14.4
```

### nginx 安装和配置

```shell
yum install nginx
```

能够查询 nginx 的版本号即安装成功。

```shell
nginx -v # v1.16.1
```

我们可以在 `/etc`和`/usr`下面找到 nginx 相关的文件，其中最主要的文件：

- `/etc/nginx/nginx.conf`：nginx 的主配置文件，这里是默认 ip 下的各种服务配置
- `/etc/nginx/conf.d`：nginx 的子配置文件夹
- `/usr/share/nginx/html`：静态资源存放的地方

这里对 nginx 做默认的配置，把首页重定向到我们即将在 nextjs 里设置的地址`http://localhost:3000`

```conf
# nginx.conf
server {
    ...
    # 我们只更改location里的内容
    location / {
        proxy_pass http://localhost:3000;
    }
    ...
}
```

其余的 nginx 设置可以参考[链接](https://mp.weixin.qq.com/s/JUOyAe1oEs-WwmEmsHRn8w)

### next 文件打包

官方提供的命令`next build`可以打包项目，官方配置下可以通过`next start`启动构建的项目。打包后的文件会存放在`.next`文件下，也可以通过设置`next.config.js`[自定义构建目录](https://www.nextjs.cn/docs/api-reference/next.config.js/setting-a-custom-build-directory)。

```js
module.exports = {
  distDir: "build", // or dist
};
```

因为这里是使用的自定义服务器来运行 nextjs 项目的，根据[官方文档](https://www.nextjs.cn/docs/advanced-features/custom-server)，我们需要创建`server.js`作为 node 的入口文件：

```js
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;

    if (pathname === "/about") {
      app.render(req, res, "/about", query);
    } else if (pathname === "/other") {
      app.render(req, res, "/other", query);
      n;
    } else {
      handle(req, res, parsedUrl);
    }
  }).listen(3001, (err) => {
    if (err) throw err;
    console.log("> Next_blog ready on http://localhost:3001");
  });
});
```

然后需要更改`package.json`里的`start`命令，之后在项目里就通过这个命令来启动项目。

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    // "start": "next start",
    "start": "NODE_ENV=production node server.js"
  }
}
```

构建后需要上传的文件：

- .next
- pages
- public
- next.config.js（如果有的话）
- server.js（nodejs 入口文件）
- package.json

然后把这些文件放到你想放的位置，比如之前说的`/usr/share/nginx/html`下。然后我们需要在文件里安装依赖：

```shell
npm install
```

通过 node 启动项目：

```shell
node server.js
```

然后你可以通过 ip 或者解析的域名来访问，成功显示页面内容则配置成功。
