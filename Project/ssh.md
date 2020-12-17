# SSH

## 简介

SSH（Secure Shell）是一种网络协议，用于加密两台计算机之间的通信，并且支持各种身份验证机制。业务中，主要用于保证远程登录和远程通信的安全。

SSH的软件架构是服务器-客户端模式（Server-Client）。客户端（client）负责向服务器发出请求，OpenSSH的实现为ssh；服务器（server）负责接收客户端发出的请求，OpenSSH的实现为sshd。

OpenSSH的客户端是二进制程序ssh:
|系统|位置|
|---|---|
|Linux/Unix|`/usr/local/bin/ssh`|
|Windows|`\ProgramFiles\OpenSSh\bin\ssh.exe`|

## 基本命令

ssh登陆远程服务器：

```shell
ssh hostname
```

如果未指定用户名，则采用客户端的当前用户名，作为远程服务器的登陆用户名。

指定登陆用户名，用`@`分割：

```shell
ssh username@hostname
```

通过`-l`参数，可以把用户名和主机名分开：

```shell
ssh -l username hostname
```

通过`-p`配置访问的端口：

```shell
ssh -p port hostname
```

## 配置项

|配置项|作用|示例|
|-|-|-|
|`-c`|指定加密算法|`ssh -c blowfish,3des hostname`|
|`-C`|压缩数据传输|`ssh -C hostname`|
|`-d`|设置打印的debug信息级别，数值越高，输出的内容越详细|`ssh -d 1 hostname`|
|`-D`|指定本机的Socks监听端口，该端口收到的请求，都将转发到远程的SSH主机，又称动态端口转发|`ssh -D port hosename`|
|`-f`|SSH链接在后台运行||
|`-F`|指定使用的配置文件|`ssh -F /usr/local/ssh/other_config`|
|`-h`，`--help`|帮助信息|`ssh -h`|
|`-i`|指定私钥，意为“identity_file”，默认值为`~/.ssh/id_dsa`。其中，对应的公钥必须存放在服务器|`ssh -i my-key hostname`|
|`-l`|指定登陆名|`ssh -l username hostname`|
|`-L`|设置本地端口转发。所有发向本地port端口的请求，都会经过hostname发往targetServer的80端口，相当于直接连上了targetServer的80端口|`ssh -L port:targetServer:80 username@hostname`|
|`-m`|指定校验数据完整性的算法|`ssh -m hmac-shall,hamc-md5 hostname`|
|`-o`|指定一个配置命令|`ssh -o "Keyword Value"`|
|`-p`|指定端口|`ssh -p port hostname`|
|`-q`|安静模式，不向用户输出任何警告信息|`ssh -q hostname`|
|`-R`|指定远程端口转发。命令需在跳板服务器执行，指定本地计算机local监听自己的port端口，所有发向这个端口的请求，都会转向 targetServer的902端口|`ssh -R port:targetServer:902 local`|
|`-t`|在ssh直接运行远端命令时，提供一个互动时Shell|`ssh -t hosename emacs`|
|`-v`|显示详细信息，可以重复多次，重复次数越多，信息越详细|`ssh -vvv hostname`|
||||
||||
||||
||||
||||
||||
||||
||||
||||

## 参考

[SSH](https://wangdoc.com/ssh/basic.html)
