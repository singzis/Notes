# nginx 配置

## 文件结构

```bash
# 全局块
# 配置影响nginx全局的指令。一般有运行nginx服务器的用户组，nginx进程pid存放路径，日志存放路径，配置文件引入，允许生成worker process数等
# ...
events {
  # events块;
  # 配置影响nginx服务器或与用户的网络连接。有每个进程的最大连接数，选取哪种事件驱动模型处理连接请求，是否允许同时接受多个网路连接，开启多个网络连接序列化等
  # ...
}

# http块
# 配置http服务器，虚拟主机相关参数，mime类型，日志格式等;一个nginx.conf文件可以有多个http块
http {
  # ...

  # server块
  # 配置虚拟主机相关参数，一个http块可以有多个server块，每个server块可以监听一个端口，可以配置域名，也可以不配置域名，即监听所有域名
  server {
    # server全局块
    # 配置影响当前server块的指令，如server_name，listen，root，index等
    # ...

    # location块
    # 配置请求的路由和处理方式
    location [PATTERN] {
        # ...
    }

    location [PATTERN] {
        # ...
    }
  }

  server {
    # ...
  }

  # ...
}
```

## 基础配置

### 配置文件

- nginx.conf：nginx 的主配置文件
- conf.d：nginx 的配置文件目录
- nginx.conf.default：nginx 的默认配置文件，在 nginx.conf 中没有配置的时候会生效
- default.d：nginx 的默认配置文件目录

配置文件的合成优先级

在 Nginx 中，配置文件可以分散在多个文件中，并且按照一定的优先级进行加载。通常情况下，我们会在 nginx.conf 文件中包含一个或多个 \*.conf 文件，这些文件通常存放在 conf.d 目录中。

以下是关于 Nginx 配置文件优先级的说明：

nginx.conf 文件的优先级最高，它包含了所有 Nginx 的全局配置，例如 worker_processes、pid、events 等等。此文件中的配置将适用于所有 server blocks。

在 nginx.conf 文件中，可以使用 include 指令来加载其他的配置文件，例如`include /etc/nginx/conf.d/*.conf`;，其中 conf.d 目录下的所有 `\*.conf 文件将被加载。

如果一个配置项在多个配置文件中都有定义，那么后面的配置文件会覆盖前面的配置文件。例如，如果 nginx.conf 文件中设置了 worker_processes 4;，但是 conf.d/custom.conf 文件中设置了 worker_processes 8;，那么最终的 worker_processes 将是 8。

如果你的 conf.d 目录中有多个 \*.conf 文件，那么它们的加载顺序将按照字母顺序进行。例如，conf.d/00-default.conf 将先于 conf.d/10-custom.conf 加载。

总之，Nginx 配置文件的优先级是从高到低依次为 nginx.conf 文件、include 指令中包含的配置文件，以及 conf.d 目录下的 \*.conf 文件，其中后面的配置文件会覆盖前面的配置文件


https://www.zhihu.com/question/21483073/answer/2252761291
