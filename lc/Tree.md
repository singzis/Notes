[102-二叉树的层序遍历](#102-二叉树的层序遍历)

## details

### 102-二叉树的层序遍历

难度：中等

要点：区分二叉树的层级

解决思路：用队列实现广度优先遍历时，一次性把当前层级的节点遍历完，再入队新的一层的队列，就实现层级的区分

[地址](https://leetcode.cn/problems/binary-tree-level-order-traversal/)

```ts
function levelOrder(root: TreeNode | null): number[][] {
  if (root === null) {
    return []
  }
  if (root.left === null && root.right === null) {
    return [[root.val]]
  }
  const result: number[][] = []
  const queue: (TreeNode | null)[] = [root]
  let cur: TreeNode | null = null

  while (queue.length !== 0) {
    const len = queue.length
    const level: number[] = []
    for (let i = 0; i < len; i++) {
      cur = queue.shift() as TreeNode
      level.push(cur.val)
      if(cur.left !== null) {
        queue.push(cur.left)
      }
      if(cur.right !== null) {
        queue.push(cur.right)
      }
    }
    result.push(level)
  }

  return result
}
// 树 -> [1,2,3,4,5,6,7]
// 入队出队方式
// 入：[1]
// 出：[1] 入：[2,3] -> [2,3]
// 出：[2] 入：[4,5]，出：[3] 入：[6,7] -> [4,5,6,7]
// 出：[4,5,6,7] -> []
```