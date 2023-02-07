基本命令：

-   `brew update`：更新 Homebrew 的软件包数据库。
-   `brew upgrade`：升级已安装的软件包到最新版本。
-   `brew install <package-name>`：安装指定的软件包。
-   `brew search <query>`：搜索软件包数据库以查找与查询匹配的软件包。
-   `brew info <package-name>`：查看指定软件包的信息，例如版本、安装路径等。
-   `brew list`：列出已安装的软件包。
-   `brew uninstall <package-name>`：卸载指定的软件包。
-   `brew cleanup`：删除无用的软件包文件，以释放磁盘空间。
-   `brew doctor`：检查 Homebrew 环境并报告可能的问题。

Homebrew Services 是 Homebrew 的一个插件，可以方便地管理系统服务

-   `brew services list`：列出所有当前启动的服务。
-   `brew services start <formula>`：启动指定的服务。
-   `brew services stop <formula>`：停止指定的服务。
-   `brew services restart <formula>`：重启指定的服务。
-   `brew services cleanup`：清理所有已停止的服务的进程