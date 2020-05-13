# 轻服务器环境部署总结

> 搭建这么一个 nodejs 环境的服务器，是真麻烦，全当学习了

## 安装 NVM

环境如果没有装 NVM，就需要手动安装一个。
NVM 一个 node 版本管理器，可以同时安装多个版本的 node，并可以来回切换.
安装步骤可以按照[官方](https://github.com/nvm-sh/nvm/blob/master/README.md)提供的方法来

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```

通过 NVM 安装 node 稳定版本，即当前 node 官方提供的最新版本，npm 默认与 node 一起打包下载

```shell
nvm install stable
```

能够查询到 node 和 npm 的版本号即表示下载成功

```js
node - v; // v14.2.0
npm - v; // 6.14.4
```
