[删除链表节点](#删除链表节点)

## detail

### 删除链表节点

难度：简单

[地址](https://leetcode.cn/problems/shan-chu-lian-biao-de-jie-dian-lcof/)

```ts
function deleteNode(head: ListNode | null, val: number): ListNode | null {
    if (head === null) {
        return null
    }
    if (head.val === val) {
        return head.next
    }
    let cur: ListNode | null = head

    while (cur.next !== null && cur.next.val !== val) {
        cur = cur.next
    }
    if (cur.next !== null) {
        cur.next = cur.next.next
    }
    return head
}
```