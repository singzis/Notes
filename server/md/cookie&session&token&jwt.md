# cookie、session、token 和 JWT 总结

## cookie

### 描述

http 无状态特性导致服务端无法在每次被访问时准确定位客户端的用户，所以通过 cookie 来标记用户。
cookie 由服务端提供，保存在浏览器，每次访问服务端时带上 cookie，用以告知服务端两次请求是否来自同一浏览器，比如保持用户登录状态。

### 流程

1.浏览器通过账号密码登录

2.服务端验证账号密码，验证无误后返回 cookie 等信息

3.浏览器发送请求访问其他数据时，请求中会带上之前保存的 cookie

4.服务端解析验证 cookie，返回对应用户请求的数据

### 特点

- 以`key=value`的形式存在浏览器，仅能存储字符串
- 数据大小最多 4k
- 存储在浏览器，下次访问同一个服务器时会被请求带上
- 无法跨域访问，cookie 绑定单一域名，仅在能相同域名下被使用，一级域名和二级域名可以共享 cookie
- 时效性，可以设置过期时间（expires）或者有效时间（Max-Age），即使在浏览器关闭后再打开，cookie 也会被保留

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

session 是另一种记录服务器与客户端会话状态的机制。
session 基于 cookie 实现，服务端存储 session，sessionID 存储在客户端中的 cookie 里，服务端解析并匹配请求中携带的 cookie 里的 sessionID，返回对应的数据。

### 流程

1.客户端首次访问服务器

2.服务端创建该用户对应的 session 和 sessionID，并返回携带 sessionID 的 cookie

3.客户端再次访问该服务器时，请求携带 cookie

4.服务端解析 cookie 里的 sessionID，匹配对应用户，返回相应数据或作执行后续操作

### 特点（与以 cookie 做会话状态做比较）

- 比 cookie 安全，主要信息是存在服务端的
- 值的类型不同，cookie 只能存储字符串在浏览器里，而 session 可以存储任意类型的值在服务端
- 值的大小不同，cookie 是 4k 上限，而 session 能存更多的值，但是会消耗更多服务器资源
- 时效性，cookie 可长可短，session 一般都很短（节省服务器开销）
- session 靠 seesionID 与 cookie 做关联

### 用处

同 cookie
