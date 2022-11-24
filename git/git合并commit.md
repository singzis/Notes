`git log`查看历史，选择将`commit<messag:2.6.17,id:67574e8a>`以上的commit合并为一个commit，但是要除开两个commit，因为这两个是中间合进来的，与该分支的修改无关，需要排除的分支是：`commit<message: feat:更新iconfont,id:a1512a9>`与`commit<message:修改错别字,id:258d482>`，将剩余的合并入`commit<message:编辑器图片预览更新交互方式,id:d0e819c>`

![[git_1.png]]

`git rebase -i commitId`，其中`-i`的参数commidId为不需要合并的commit的id，即需要操作的所有commit的前一个commit的id，就是`commit<messag:2.6.17,id:67574e8>`

```shell
git rebase -i 67574e8aee4eb5139a1269fbd9cddb29f1b059ef
```

进入vim编辑界面

![[git_2.png]]

在这里面可以操作commit提交：
- 排序由上到下，表示提交时间由远到近
- pick：会执行该条commit
- squash：当前commit会被合并入上一条commit
- 可以更改所有commit的位置

现在可以通过执行几个操作达到所需的目的：
1. 移动`a1512a9`和`258d482`两个commit，防止被错误合并，这里选择移动到最下面
2. 对需要修改commit前面改为`squash`，被归入的commit保留`pick`

![[git_3.png]]

之后`:wq`保存退出，然后会进入第二阶段，需要修改合并后的commit的提交信息

![[git_4.png]]

这里将信息修改为`编辑器图片预览更新交互方式(合并commit)`

![[git_5.png]]

当提示Successfully时即更改成功

![[git_6.png]]

`git log`查看历史，发现已经成功修改

![[git_7.png]]
