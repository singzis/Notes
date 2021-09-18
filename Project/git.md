# git 常用技巧

## 一般语法

### 仓库

初始化一个 git 仓库

`git init name`

关联仓库

把本地仓库和远程仓库关联起来， 如果不执行这个命令的话，每次 push 的时候都需要指定远程服务器的地址

`git remote add origin git@github.com:UserName/xxx.git`

克隆仓库

`git clone https://github.com/xxx/xxx.git`

### 修改和提交

添加文件到暂存区

`git add file`

`git add file1 file2 ...`

添加当前目录的所有文件到暂存区

`git add -A`

`git add .`

添加每个变化前，都会要求确认，对于同一个文件的多处变化，可以实现分次提交

`git add -p`

丢弃 file 在工作区的修改

`git reset HEAD -- file`

`git checkout -- file`

把当前仓库暂存区中的内容提交到仓库的 HEAD 里面

`git commit -m 提交信息`

提交工作区自上次 commit 之后的变化，直接到仓库区

`git commit -a`

提交时显示所有 diff 信息

`git commit -v`

使用一次新的 commit，替代上一次提交，如果代码没有任何新变化，则用来改写上一次 commit 的提交信息

`git commit --amend -m 提交信息`

重做上一次 commit，并包括指定文件的新变化

`git commit --amend file1 file2 ...`

提交（推送）修改

`git push origin 分支`

强制推送

`git push -f`（回到指定版本 再强推 有风险 须谨慎）

[参考](https://blog.csdn.net/QH_JAVA/article/details/77979622)

### 标签（tag）

创建标签

`git tag v1.0`

针对某次提交补打标签，首先得到那次提交的id（例如471fd27）

`git tag v0.9 471fd27`

查看仓库所有标签

`git tag`

标签不是按照时间顺序列出，而是按照字母排序，查看标签信息

`git show v0.9`

创建自带说明的标签，`-a`指定标签名，`-m`指定文字说明

`git tag -a v1.0.1 -m 'fix：xxx'`

提交（推送）标签

`git push origin v1.0.1`

提交所有标签

`git push origin --tags`

### 状态

查看仓库当前状态

`git status`

查看修改痕迹

`git diff`

查看提交历史

`git log`

显示 commit 历史，以及每次 commit 发生变更的文件

`git log --stat`

查看命令历史

`git reflog`

返回历史版本

`git reset --hard commit_id`

回到上一版本

`git reset --hard HEAD^`

### 分支

查看所有分支

`git branch`

查看远程所有分支

`git branch -r`

查看本地和远程所有分支

`git branch -a`

创建一个 name 分支

`git branch name`

切换到 name 分支

`git checkout name`

`git switch name`

创建并切换到 name 分支

`git checkout -b name`

合并 name 分支到当前分支

`git merge name`

新建一个分支，与指定的远程分支建立追踪关系

`git branch --track branch remote-branch`

重命名分支 使用-M 则表示强制重命名

`git branch -m oldBranchName newBranchName`

删除 name 分支

`git branch -D name`

删除远程 name 分支

`git push origin --delete name`

切换到远程 remote_branch_name 分支

`git fetch origin`

`git checkout -t origin/remote_branch_name`

拉取仓库代码

`git pull origin 分支`

### git配置

查看配置列表

`git config --list`

配置用户名，上传本地 repository 到服务器上的时候，在 Github 上会显示这里配置的上传者信息，只配置当前文件夹的话，去掉`--global`

`git config --global user.name 'xxx'`

`git config --global user.email 'xxx.com'`

## git commit 规范

其中 header 部分的 commit 说明：

- feat: 新增 feature
- fix: 修复 bug
- docs: 仅仅修改了文档，如 readme.md
- style: 仅仅是对格式进行修改，如逗号、缩进、空格等。不改变代码逻辑。
- refactor: 代码重构，没有新增功能或修复 bug
- perf: 优化相关，如提升性能、用户体验等。
- test: 测试用例，包括单元测试、集成测试。
- chore: 改变构建流程、或者增加依赖库、工具等。
- revert: 版本回滚
