# npm发包

前置：需要npm账号

- 发正式版：
  1. package.json中version写版号
  2. `npm run build`
  3. `npm publish`
- 发beta版：
  1. version中版号改为'x.x.x-beta'
  2. `npm run build`
  3. `npm publish --tag=beta`
