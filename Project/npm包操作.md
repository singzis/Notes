# npm包操作

## npm发包

前置：需要npm账号

- 发正式版：
  1. package.json中version写版号
  2. `npm run build`
  3. `npm publish`
- 发beta版：
  1. version中版号改为'x.x.x-beta'
  2. `npm run build`
  3. `npm publish --tag=beta`

## npm删除包和版本

## npm安装并重命名

```shell
npm i <alias_name>@npm:<original_package_name>
# OR
yarn add npm i <alias_name>@npm:<original_package_name>
```

示例：

```shell
npm i antd-latest@npm:antd --save-dev
# OR
yarn add antd-latest@npm:antd --save-dev
```

Tips: 用这种方式，npm 版本需要大于 `6.9.0`（对应 `node.js` 为 `12.0` ）

