# lsof

## mac查看端口使用情况

Mac下使用lsof（list open files）来查看端口占用情况，lsof 是一个列出当前系统打开文件的工具。

使用 lsof 会列举所有占用的端口列表：

```shell
lsof
```

使用less可以用于分页展示，如：

```shell
lsof | less
```

也可以使用 -i 查看某个端口是否被占用，如：

```shell
lsof -i:3000
```

如果端口被占用，则会返回相关信息，如果没被占用，则不返回任何信息。

如果需要杀掉某个端口

```shell
kill -9 PID
```

## lsof 语法

lsof ［options］ filename

常用的参数列表：

```shell
lsof filename 显示打开指定文件的所有进程
lsof -a 表示两个参数都必须满足时才显示结果
lsof -c string   显示command列中包含指定字符的进程所有打开的文件
lsof -u username 显示所属user进程打开的文件
lsof -g gid 显示归属gid的进程情况
lsof +d /dir/ 显示目录下被进程打开的文件
lsof +d /dir/ 同上，但是会搜索目录下的所有目录，时间相对较长
lsof -d fd 显示指定文件描述符的进程
lsof -n 不将ip转换为hostname，缺省是不加上-n参数
lsof -i 用以显示符合条件的进程情况
lsof -i[46] [protocol][@hostname|hostaddr][:service|port]
           46 --> ipv4 or ipv6
           protocol --> tcp or udp
           hostname --> internet host name
           hostaddr --> ipv4地址
           service --> /etc/service中的 service name (可以不只一个)
           port --> 端口号 (可以不只一个)
```

查看所属root用户进程所打开的文件类型为txt的文件:

```shell
lsof -a -u root -d txt
```

## lsof其他的用途

1.查找谁在使用文件系统：

在卸载文件系统时，如果该文件系统中有任何打开的文件，操作通常将会失败。那么通过lsof可以找出哪些进程在使用当前要卸载的文件系统，如下：

```shell
lsof /gtes11/
```

2.恢复删除的文件

当linux计算机受到入侵时，常见的情况是日志文件被删除，以掩盖攻击者的踪迹。管理错误也可能导致意外删除重要的文件，比如在清理旧日志时，意外地删除了数据库的活动事务日志。有时可以通过lsof来恢复这些文件。
