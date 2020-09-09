# Referer

缘由来自于同事给的一个接口，需要我配置一下 header 中的 Referer，但是导致怎么配置都不对，依旧显示当前请求源的地址，加上本身对这个也不是很了解，就做一下细致的学习，也发现 Referer 本身不也复杂。

> Referer 请求头表示告诉服务器，用户在访问当前资源之前的位置。服务器使用 Referer 识别访问来源，来进行用户跟踪、统计分析等

Referer 是"Referrer"的拼写错误，但当时无人纠正便一直沿用至今。

本文主要记录关于 Referer 一下几个知识点：

- Referer 的使用
- Referrer Policy 的使用

## Referer 的使用

正常情况下，我们访问服务器资源时，Referer 会被带入 header 中，但是当我们通过在地址栏中输入资源地址就不会在 header 中加入 Referer，常见的一些情况就包括访问某个链接，请求图片或者视频等。
