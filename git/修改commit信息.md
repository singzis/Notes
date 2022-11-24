修改最后一次commit信息

```shell
# 修改最近提交的 commit 信息
$ git commit --amend --message="modify message by daodaotest" --author="xxx@163.com>"

# 仅修改 message 信息
$ git commit --amend --message="modify message by daodaotest"

# 仅修改 author 信息
$ git commit --amend --author="jiangliheng <xxx@163.com>"
```

## 修改历史commit信息

同[git合并commit](https://docs.craft.do/editor/d/860cdede-e7b6-6fd3-6028-3a0f9eec01cb/59B8A867-E9A8-46F5-892A-94CD737308ED)，中的一样操作步骤：
- `git rebase -i` 列出 commit 列表
- 找到需要修改的 commit 记录，把 `pick` 修改为 `edit` 或 `e`，`:wq` 保存退出
- 之后会提示修改 commit 的具体信息`git commit --amend`，保存并继续下一条`git rebase --continue`，直到全部完成
- 中间也可跳过或退出`git rebase (--skip | --abort)`

```shell
# 列出 rebase 的 commit 列表，不包含 <commit id>
$ git rebase -i <commit id>
# 最近 3 条
$ git rebase -i HEAD~3
# 本地仓库没 push 到远程仓库的 commit 信息
$ git rebase -i

# vi 下，找到需要修改的 commit 记录，```pick``` 修改为 ```edit``` 或 ```e```，```:wq``` 保存退出
# 重复执行如下命令直到完成
$ git commit --amend --message="modify message by daodaotest" --author="xxx <xxx@163.com>"
$ git rebase --continue

# 中间也可跳过或退出 rebase 模式
$ git rebase --skip
$ git rebase --abort
```
