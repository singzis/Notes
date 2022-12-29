
[21-合并两个有序链表](#21-合并两个有序链表)
[剑18-删除链表节点](#剑18-删除链表节点)

## details

### 21-合并两个有序链表

难度：简单

[地址](https://leetcode.cn/problems/merge-two-sorted-lists/)

```ts
class ListNode {
    val: number
    next: ListNode | null

    constructor(val?: number, next?: ListNode | null) {
        this.val = (val === undefined ? 0 : val)
        this.next = (next === undefined ? null : next)
    }
}

function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
    const temp = new ListNode(0)
    let cur = temp
    let p1 = list1
    let p2 = list2
    while (p1 !== null && p2 !== null) {
        if (p1.val > p2.val) {
            cur.next = p2
            p2 = p2.next
        } else {
            cur.next = p1
            p1 = p1.next
        }
        cur = cur.next
    }
    if (p1 !== null) {
        cur.next = p1
    }
    if (p2 !== null) {
        cur.next = p2
    }
    return temp.next
};
```

### 剑18-删除链表节点

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