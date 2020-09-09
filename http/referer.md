# Referer

缘由来自于同事给的一个接口，需要我配置一下 header 中的 Referer，但是导致怎么配置都不对，依旧显示当前请求源的地址，加上本身对这个也不是很了解，就做一下细致的学习，也发现 Referer 本身不也复杂。

> Referer 请求头表示告诉服务器，用户在访问当前资源之前的位置。服务器使用 Referer 识别访问来源，来进行用户跟踪、统计分析等

Referer 是"Referrer"的拼写错误，但当时无人纠正便一直沿用至今。

## Referer 的使用

正常情况下，我们访问服务器资源时，Referer 会被带入 header 中，但是当我们通过在地址栏中输入资源地址就不会在 header 中加入 Referer，常见的一些情况就包括访问某个链接，请求图片或者视频等。

并且可以通过`document.referer`查看当前页面的访问来源。

常见用例：

- 追踪死链
- 追踪用户
- 阻止跨站请求伪造
- 优化缓存
- 防盗链：判断 referer 来限制仅指定域名可访问（不过盗链网站也可以进行反盗链，设置 referer 绕过防盗链）

使用 referer 造成的影响大致就是在当前链接中存在一些敏感信息时，访问其他网站就会把这些敏感信息暴露在 referer 中。所以某些时候在访问链接时需要改变 referer 的默认行为：

- 设置 ref="noreferer"属性为其设置独立的请求策略，比如`<a>`、`<link>`和`<area>`：
  `<a href="" ref="noreferrer"></a>`
- 设置 referrerpolicy="origin"属性为其设置独立的请求策略，比如`<a>`、`<img>`、`<iframe>`、`<script>`、`<link>`和`<area>`：
  `<a href="" referrerpolicy="origin">`
- 设置 meta 的 name 为 referrer，为整个页面设置 referer 策略，content 的值同 referrer policy 的值：
  `<meta name="referrer" content="origin">`
- referrer policy

## referrer policy 的使用
