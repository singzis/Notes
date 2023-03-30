开源的应用容器引擎，用于开发、发布和运行应用程序。将应用程序和基础架构分离，以便快速交付软件。

## 基本概念

### 镜像(image)

**镜像** 是一个特殊的文件系统，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量等）。镜像不包含任何动态数据，其内容在构建之后也不会被改变。

镜像构建时，会一层层构建，前一层是后一层的基础。每一层构建完就不会再发生改变，后一层上的任何改变只发生在自己这一层。因此，在构建镜像的时候，我们要尽量减少重复构建镜像层。

### 容器(container)

**容器** 是用镜像创建的实例，可以被启动、开始、停止、删除。容器之间相互隔离。可以把容器看做是一个简易版的`Linux`环境（包括root用户权限、进程空间、网络空间等）和运行在其中的应用程序。

容器与镜像的关系类似于面向对象编程中的类和对象，镜像好比是类，容器则是对象。

### 仓库(repository)

仓库就是存放镜像的地方，我们可以把镜像发布到仓库中，需要的时候从仓库中拉下来使用。  
**Docker** 官方提供了 Docker Hub 仓库，提供了大量的基础镜像，方便我们下载使用。

## 特点

- 轻量
  - 为何启动快速？如何做到和宿主机共享内核？
  - 当我们请求Docker运行容器时，Docker会在计算机上设置一个资源隔离的环境，然后将打包好的应用程序和关联的文件复制到Namespace内的文件系统中，此时环境的配置就完成了，之后Docker会执行我们预先指定的命令，运行应用程序
- 可移植性

## 核心概念

- build、ship、run（搭建、发布、运行）
- build once, run anywhere（一次搭建，处处运行）
- Docker本身不是容器，是创建容器的工具，应用容器的引擎
- 三个核心：
  - 镜像 Image
    - 只读
  - 容器 Container
    - 是镜像可以运行的实例
    - 一般情况下，隔离于其他容器
    - 由启动或者创建时的配置决定
  - 仓库 Repository

- Docker使用Linux内核和内核功能（例如 `Cgroups` 和 `namespaces`）来分隔进程，以便进程相互独立
- 由于 `Namespace` 和 `Cgroups` 功能仅在 `Linux` 上可用，因此容器无法在其他操作系统上运行。那么 `Docker` 如何在 `macOS` 或 `Windows` 上运行？ `Docker` 实际上使用了一个技巧，并在非 `Linux` 操作系统上安装 `Linux` 虚拟机，然后在虚拟机内运行容器
- 镜像是一个可执行包，其包含运行应用程序所需的代码、运行时、库、环境变量和配置文件，容器是镜像的运行时实例

## 常用命令

| 命令       | 描述                                                         |
| ---------- | ------------------------------------------------------------ |
| FROM       | - 指定基础镜像，所有构建的镜像都必须有一个基础镜像，且`FROM`命令必须是`Dockerfile`的第一个命令<br />- `FROM <image>[:<tag>] [AS <name>]`从一个指定版本的镜像构建起一个新的镜像名字<br />- 示例：`FROM nginx:1.23.1 AS nginx1231` |
| MAINTAINER | - 镜像维护者的信息<br />- `MAINTAINER <name>`<br />- 示例：`MAINTAINER qunqing` |
| ENV        | - 设置环境变量，有些容器运行时会需要某些环境变量<br />- `ENV <key> <value>` 一次设置一个环境变量<br />- `ENV <key>=<value> <key>=<value> <key>=<value>` 设置多个环境变量<br />- 示例：`ENV JAVA_HOME /usr/java1.8/` |
| RUN        | - 构建镜像时要执行的命令<br />- sheel 格式： `RUN <command>`<br />- exec 格式： `RUN ["executable", "param1", "param2"]` ，注意该格式被解析为JSON数组，所以需要使用双引号<br />- 示例：`RUN /bin/bash -c 'source $HOME/.bashrc; echo $HOME'`<br />- 示例：`RUN ["/bin/bash", "-c", "echo hello"]` |
| ADD        | - 将本地的文件添加复制到容器中去，压缩包会解压，可以访问网络上的文件，会自动下载<br />- `ADD <src> <dest>`<br />- `ADD *.js /app` 添加`js`到容器内`app`文件中 |
| CPPY       | 功能和 `ADD` 一样，只是复制，不会解压或者下载文件            |
| WORKDIR    | - 设置工作目录，设置之后 ，`RUN、CMD、COPY、ADD` 的工作目录都会同步变更<br />- `WORKDIR <path>`<br />- 示例：`WORKDIR /app/test` |
| EXPOSE     | - 暴露对外的端口（容器内部程序的端口，虽然会和宿主机的一样，但是其实是两个端口）<br />- `EXPOSE <port>`<br />- 示例：`EXPOSE 80`<br />- 容器运行时，需要用 `-p` 映射外部端口才能访问到容器内的端口 |
| CMD        | - 启动容器后执行的命令，和 `RUN` 不一样，`RUN` 是在构建镜像是要运行的命令<br />- 当使用 `docker run` 运行容器的时候，这个可以在命令行被覆盖<br />- 示例：`CMD ["executable", "param1", "param2"]` |
| ENTRYPOINT | - 也是执行命令，和 `CMD` 一样，只是这个命令不会被命令行覆盖<br />- `ENTRYPOINT ["executable", "param1", "param2"]`<br />- 示例：`ENTRYPOINT ["donnet", "myapp.dll"]` |
| VOLUME     | - 指定数据持久化的目录，官方语言叫做挂载<br />- `VOLUME /var/log` 指定容器中需要被挂载的目录，会把这个目录映射到宿主机的一个随机目录上，实现数据的持久化和同步。<br />- `VOLUME ["/var/log","/var/test".....]` 指定容器中多个需要被挂载的目录，会把这些目录映射到宿主机的多个随机目录上，实现数据的持久化和同步<br />- `VOLUME /var/data var/log` 指定容器中的 `var/log` 目录挂载到宿主机上的 `/var/data` 目录，这种形式可以手动指定宿主机上的目录 |
| LABEL      | - 为镜像添加元数据，`key-value` 形式<br />- LABEL <key>=<value> <key>=<value> ...<br />- 示例：`LABEL version="1.0" description="这是一个web应用"` |
| USER       | - 指定运行命令时所使用的用户，为了安全和权限起见，根据要执行的命令选择不同用户`<br />- USER <user>:[<group>]<br />`- 示例：`USER test` |
| ARG        | - 设置构建镜像是要传递的参数<br />- `ARG <name>[=<value>]<br />`<br />- `ARG name=sss` |

## 安装

使用 homebrew 安装

```
brew install docker
```

安装完成之后，可以在终端看一下是否安装成功。

```
docker --versionDocker version 20.10.22, build 3a2c30b
```

## 使用镜像

我们使用 `docker pull` 来获取远端镜像， `docker pull --help`来查看具体获取方式  
下面我们以获取 `nginx` 为例子讲解

### 获取镜像

```
docker pull nginx
```

执行成功后控制台输出如下

```
Using default tag: latestlatest: Pulling from library/nginxe9995326b091: Pull complete71689475aec2: Pull completef88a23025338: Pull complete0df440342e26: Pull completeeef26ceb3309: Pull complete8e3ed6a9e43a: Pull completeDigest: sha256:47a8d86548c232e44625d813b45fd92e81d07c639092cd1f9a49d98e1fb5f737Status: Downloaded newer image for nginx:latestdocker.io/library/nginx:latest
```

默认下载的是 `latest` 版本，在下载日志中我们可以看到，镜像的分层存储概念，每一层都有自己的ID，下载也是一层一层去下载的。

### 查看镜像

下载成功后执行 `docker image ls` 可以看到 `nginx` 镜像的具体信息:  
**镜像名称、版本、镜像下载时间、镜像大小等等**

```
REPOSITORY                                 TAG       IMAGE ID       CREATED         SIZEnginx                                      latest    76c69feac34e   39 hours ago    142MB
```

### 删除镜像

使用 `docker image rm <镜像Id>/<仓库名>:<标签>` 来删除镜像，我们来删除上面下载的 `nginx` 镜像

**上面可以看到nginx镜像的ID: `76c69feac34e`**

```
docker image rm 76c69feac34e
```

批量删除使用，`docker image rm` 搭配 `docker image ls` 使用，我们来批量删除下所有 `nginx` 镜像

```
docker image rm $(docker image ls -q nginx)
```

### 制作镜像

镜像的制作实际上就是定制每一层所添加的配置、文件。我们可以把每一层修改、安装、构建、操作的命令都写入一个脚本，用这个脚本来构建、定制镜像。这个脚本就是 `Dockerfile`。

下面我们通过`Dockerfile`定制一个 `nginx` 镜像。

```
touch Dockerfile
```

将 Dockerfile 的内容修改为

```
FROM nginxRUN echo '<div>Hello World</div>' > /usr/share/nginx/html/index.html
```

其中`FROM`是继承基础镜像，`RUN` 是执行命令行命令。我们这里给页面中输出`Hello World`。

接下来就是构建镜像，让他能够跑起来，使用 `docker build [OPTIONS] 路径` 命令来构建镜像

```
docker build -t nginx:0.0.1 .
```

## 操作容器

### 启动容器

使用 `docker run [OPTIONS] IMAGE` 命令启动容器，例如我们启动上面的 `nginx` 镜像

-p 表示将容器80端口映射到宿主机8080端口

-d 表示后台运行这个容器

```
docker run -p 8080:80 -d nginx:0.0.1
```

我们来测试下是否启动成功

```
curl 127.0.0.1:8080
```

返回如下表示成功启动了 nginx 容器

```
<div>Hello World</div>
```

### 进入容器

首先要看下正在运行的容器ID

```
docker container lsCONTAINER ID   IMAGE          COMMAND                  CREATED              STATUS              PORTS                  bd075ecabbcf   nginx:v0.0.1   "/docker-entrypoint.…"   About a minute ago   Up About a minute   0.0.0.0:8080->80/tcp   
```

使用 `docker exec [OPTIONS]` 命令来进入容器，例如进入上面的 `nginx` 容器

```
docker exec -it bd07 bash
```

其中的`-i -t`，是打开 Linux 命令提示符的

### 导出容器

我们使用 `docker export [OPTIONS]` 导出容器，例如导出上面的 `nginx` 容器

```
docker export bd07 > nginx.tar
```

### 终止容器

使用 `docker container stop [OPTIONS]` 来终止容器

我们使用`CONTAINER ID`终止上面的`nginx`容器

```
docker container stop bd07
```

## 参考

[Docker技术入门与实战（第3版）](https://item.jd.com/12453318.html?cu=true&utm_source=yeasy.gitbook.io&utm_medium=tuiguang&utm_campaign=t_351954893_&utm_term=57d077a7968c4d8c9ebee1ab4efeb690)