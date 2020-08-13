# cookie、session、token 和 JWT 总结

## cookie

### 描述

> http 无状态特性导致服务端无法在每次被访问时准确定位客户端的用户，所以通过 cookie 来标记用户。
> cookie 由服务端提供，保存在浏览器，每次访问服务端时带上 cookie，用以告知服务端两次请求是否来自同一浏览器，比如保持用户登录状态。

### 流程

1. 浏览器通过账号密码登录
2. 服务端验证账号密码，验证无误后返回 cookie 等信息
3. 浏览器发送请求访问其他数据时，请求中会带上之前保存的 cookie
4. 服务端解析验证 cookie，返回对应用户请求的数据

### 特点

- 以`key=value`的形式存在浏览器，仅能存储字符串
- 数据大小最多 4k
- 浏览器对统一域名下的 cookie 数量最多保存 20 个
- 存储在浏览器，下次访问同一个服务器时会被请求带上
- 无法跨域访问，cookie 绑定单一域名，仅在能相同域名下被使用，一级域名和二级域名可以共享 cookie
- 时效性，可以设置过期时间（expires）或者有效时间（Max-Age），即使在浏览器关闭后再打开，cookie 也会被保留
- 移动端支持不太良好

### 属性

- expires:cookie 最长有效时间，形式为时间戳。如果未设置该属性，cookie 便会在浏览器关闭后失效。expires 设置的时间同客户端本地时间，即可以通过更改本地时间来使 cookie 存活/过期
- Max-Age:cookie 失效前需要经过的秒数。为-1 或者 0 的时候 cookie 过期。和 expires 同时存在时，Max-Age 优先级更高
- path: 限制 cookie 在哪些路由下可以被访问，比如`path = /home`，则`home`路径下的路由都可以访问，如`/home/article`。默认为`/`，即 cookie 属于当前页面
- domain:指定 cookie 所属域名，默认为当前页面的域名
- secure: 一个带有安全属性的 cookie 只有在请求使用 SSL 和 HTTPS 协议的时候才会被发送到服务器。默认为 false。当 secure 值为 true 时，cookie 在 HTTP 中是无效，尽量不在 HTTP cookie 中存储敏感信息
- httpOnly: 无法使用 javascript 获取 cookie，一定程度上可以防止 XSS 攻击，也不是绝对安全

### 用处

- 会话状态管理（保持用户登录状态、购物车等之类可以记录的数据）
- 个性化设置（网站主题、用户自定义设置等）
- 浏览器行为跟踪（分析用户行为等）

## session

### 描述

> session 是另一种记录服务器与客户端会话状态的机制。
> session 基于 cookie 实现，服务端存储 session，sessionID 存储在客户端中的 cookie 里，服务端解析并匹配请求中携带的 cookie 里的 sessionID，返回对应的数据。

### 流程

1. 客户端首次访问服务器
2. 服务端创建该用户对应的 session 和 sessionID，并返回携带 sessionID 的 cookie
3. 客户端再次访问该服务器时，请求携带 cookie
4. 服务端解析 cookie 里的 sessionID，匹配对应用户，返回相应数据或作执行后续操作

### 特点（与以 cookie 做会话状态做比较）

- 比 cookie 安全，主要信息是存在服务端的
- 值的类型不同，cookie 只能存储字符串在浏览器里，而 session 可以存储任意类型的值在服务端
- 值的大小不同，cookie 是 4k 上限，而 session 能存更多的值，但是会消耗更多服务器资源
- 时效性，cookie 可长可短，session 一般都很短（节省服务器开销）
- session 一般靠 seesionID 基于 cookie 实现
- 移动端支持不太良好
- session 由单个服务器创建，集群服务下，其他服务器在处理 session 时无法拿到相应的凭证，即服务器之间共享 session 比较困难
- 在线用户较多时，session 占据服务端内存较多，需定期清理过期 session
- 无法跨域，除了 cookie 带来的跨域问题，多应用共享 session 时，因为应用部署主机不同也会造成 session 在各个主机之间产生跨域

### 用处

- 同 cookie

## token

### 描述

> 由服务端创建并加密的含有 uid、时间和 sign 等信息的字符串，用以访问接口资源的凭证

### 流程

1. 用户登录输入账号和密码
2. 服务端验证并对账号密码做数字签名，加密后作为 token 返回
3. 客户端拿到 token 后储存在本地，一般在 localStorage 里
4. 通过 API 访问资源时带上 token
5. 服务端解密和验证 token 有效性，并返回对应资源

### 特点

- 服务端无状态化（主要信息存储客户端的 token 里，服务端不用保存，对比 session 就是节省了服务器存储空间，代价是增加了响应时间，需要对 token 解密并查询数据库）
- 安全（需要服务端解密算法解析 token），避免 CSRF 攻击
- 支持移动设备
- 应用负责管理 token，可以避开同源策略

### 用处

- 权限验证

### 与 session 的区别

- Session 是一种记录服务器和客户端会话状态的机制，使服务端有状态化，可以记录会话信息。而 Token 是令牌，访问资源接口（API）时所需要的资源凭证。Token 使服务端无状态化，不会存储会话信息
- Session 和 Token 并不矛盾，作为身份认证 Token 安全性比 Session 好，因为每一个请求都有签名还能防止监听以及重放攻击，而 Session 就必须依赖链路层来保障通讯安全了。如果你需要实现有状态的会话，仍然可以增加 Session 来在服务器端保存一些状态
- 所谓 Session 认证只是简单的把 User 信息存储到 Session 里，因为 SessionID 的不可预测性，暂且认为是安全的。而 Token ，如果指的是 OAuth Token 或类似的机制的话，提供的是 认证 和 授权 ，认证是针对用户，授权是针对 App 。其目的是让某 App 有权利访问某用户的信息。这里的 Token 是唯一的。不可以转移到其它 App 上，也不可以转到其它用户上。Session 只提供一种简单的认证，即只要有此 SessionID ，即认为有此 User 的全部权利。是需要严格保密的，这个数据应该只保存在站方，不应该共享给其它网站或者第三方 App。所以简单来说：如果你的用户数据可能需要和第三方共享，或者允许第三方调用 API 接口，用 Token 。如果永远只是自己的网站，自己的 App，用什么就无所谓了。

## JWT

### 描述

> JSON Web Token，一种以 JSON 格式的 Token 实现方式，可用于跨域。

JWT 分为三个部分，分别有`.`连接：

1. Header：存放 Token 类型和加密的方法
2. Payload：包含一些用户的信息
3. Signature：签名，将前面的 header 和 paylaod 部分以及一个密钥使用 header 中的加密方法进行加密

比如一个签名：

```json
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
  .eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ
  .MejVLl - m7KMfaay0nXxDWGEVPWsQ2f6SZnTvq4fXaLI
```

### 流程

1. 用户输入账号和密码
2. 服务端验证账号密码，生成 JWT 并加密，返回给客户端
3. 客户端将 JWT 存储在 localStorage 中
4. 客户端请求数据时，在请求头中加入 JWT
5. 服务端检测 JWT，从中获取用户信息，验证成功后，返回对应数据

### 特点

- 无状态（信息存在 JWT 中，JWT 由应用管理）
- 可跨域
- 自包含信息（内部存储了一些信息，可以减少对数据库的查询，加密的话可以存储一些敏感信息）
- 一旦 JWT 签发，直到过期都有效（所以存在被盗用的风险，可以把有效期设置的短一些，最好也使用 HTTPS 传输）
