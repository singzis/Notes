# git 常用技巧

## 一般语法

`git init`: 初始化一个 git 仓库

`git add file`: 添加 file 文件到本地仓库

`git commit -m 提交说明`: 提交文件的说明

`git status`: 查看仓库当前状态

`git diff`: 查看修改痕迹

`git log`: 查看提交历史

`git reflog`: 查看命令历史

`git checkout -- file`: 丢弃 file 在工作区的修改

`git branch`: 查看所有分支

`git branch name`: 创建一个 name 分支

`git checkout name`: 切换到 name 分支

`git checkout -b name`: 创建并切换到 name 分支

`git merge name`: 合并 name 分支到当前分支

`git branch -d name`: 删除 name 分支

`git push origin --delete name`: 删除远程 name 分支

`git `

`git `

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
