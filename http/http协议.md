# http 协议

## 什么是 http 协议

http 协议用于建立客户端和服务器之间的通信，以一种请求&响应的交换完成这种通信。

建立通信的过程中，由客户端率先发起请求，服务器接收到请求后便会做出响应。

请求中，客户端会发出请求报文，报文需要明确指出请求的方法、请求需要访问的资源对象（URI），以及协议版本：

```http
GET /user/index.html HTTP/1.1
Host: xxx.com
Connection: keep-alive

xxx=实体内容
```

- GET：请求方法
- /user/index.html：需要访问的资源
- HTTP/1.1：协议版本
- Host：可选，请求的首部字段
- Connection：可选，请求的首部字段
- xxx=实体内容：可选，请求的实体内容

服务器收到请求后，将处理结果作为响应返回：

```http
HTTP/1.1 200 ok
Date: Mon Jun 29 2020 00:18:52 GMT+0800
Content-Length: 1000
Content-Type: text/html

<html>
...
</html>
```

- HTTP/1.1：协议版本
- 200 ok：响应状态码
- Date：响应返回时间，响应的首部字段
- Content-Length：响应内容长度，响应的首部字段
- Content-Type：响应类型，响应首部字段
- html：响应内容

## 请求方法

## http 持久链接

## http 无状态和状态管理
