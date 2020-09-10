# Referer

缘由来自于同事给的一个接口，需要我配置一下 header 中的 Referer，但是导致怎么配置都不对，依旧显示当前请求源的地址，加上本身对这个也不是很了解，就做一下细致的学习，也发现 Referer 本身不也复杂。

> Referer 请求头表示告诉服务器，用户在访问当前资源之前的位置。服务器使用 Referer 识别访问来源，来进行用户跟踪、统计分析等

Referer 是"Referrer"的拼写错误，但当时无人纠正便一直沿用至今。

## Referer 的使用

正常情况下，我们访问服务器资源时，Referer 会被带入 header 中，但是当我们通过在地址栏中输入资源地址就不会在 header 中加入 Referer，常见的一些情况就包括访问某个链接，请求图片或者视频等。

并且可以通过`document.Referer`查看当前页面的访问来源。

常见用例：

- 追踪死链
- 追踪用户
- 阻止跨站请求伪造
- 优化缓存
- 防盗链：判断 Referer 来限制仅指定域名可访问（不过盗链网站也可以进行反盗链，设置 Referer 绕过防盗链）

使用 Referer 造成的影响大致就是在当前链接中存在一些敏感信息时，访问其他网站就会把这些敏感信息暴露在 Referer 中。所以某些时候在访问链接时需要改变 Referer 的默认行为：

- 设置 ref="noreferer"属性则会移除 Referer，请求时不会带上访问源，比如`<a>`、`<link>`和`<area>`：
  `<a href="" ref="noreferrer"></a>`
- 设置 referrerpolicy="origin"属性为其设置独立的请求策略，比如`<a>`、`<img>`、`<iframe>`、`<script>`、`<link>`和`<area>`，值同 Referrer-Policy 的值：
  `<a href="" referrerpolicy="origin">`
- 设置 meta 的 name 为 referrer，为整个页面设置 Referer 策略，content 的值同 Referrer-Policy 的值：
  `<meta name="referrer" content="origin">`
- Referrer-Policy

## Referrer-Policy 的使用

> Referrer-Policy 用于 HTTP 请求首部，用来控制哪些访问信息源会在 Referer 中发送

通过配置 Referrer-Policy 的值可以更加灵活的控制 Referer：

- `no-referrer`：整个 Referer 首部被移除，访问信息源不会随请求一起发送
- `no-referrer-when-downgrade`：默认值。同级别的安全协议的情况下（HTTPS->HTTPS），访问信息源会发送；降级的情况下（HTTPS->HTTP），移除 Referer，访问信息源不会发送
- `origin`：仅发送访问信息源的源信息（协议+域名），比如来源是`https://www.xxx.com/index.html`，则 Referer 的值为`https://www.xxx.com/`
- `same-origin`：同源的情况下会发送来源地址，非同源的情况下则不发送
- `strict-origin`：同级别安全协议的情况下，只发送访问信息的源信息；降级情况下，则不发送
- `strict-origin-when-cross-origin`：对于同源情况下会发送来源地址；同级别安全协议下，只发送访问信息的源信息；降级情况下，则不发送
- `unsafe-url`：发送访问来源地址，但只包含源信息、路径和查询字符串，不包含锚点、用户名和密码
