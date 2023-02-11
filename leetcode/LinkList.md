[2-两数相加](#2-两数相加)
[19-删除链表倒数第N个节点](#19-删除链表倒数第N个节点)
[21-合并两个有序链表](#21-合并两个有序链表)
[24-两两交换链表中的节点](#24-两两交换链表中的节点)
[剑18-删除链表节点](#剑18-删除链表节点)

## details

### 2-两数相加

难度：中

[url](https://leetcode.cn/problems/add-two-numbers/)

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
  let p1 = l1
  let p2 = l2
  let c = 0
  const result = new ListNode(0)
  let r = result
  while (p1 || p2) {
    let pv1 = 0
    let pv2 = 0
    if (p1) {
      pv1 = p1.val
      p1 = p1.next
    }
    if (p2) {
      pv2 = p2.val
      p2 = p2.next
    }

    let sum = pv1 + pv2 + c
    c = sum > 9 ? 1 : 0
    sum = sum % 10
    r.next = new ListNode(sum)
    r = r.next
  }
  if (c > 0) {
    r.next = new ListNode(c)
  }
  return result.next
};
```

### 19-删除链表倒数第N个节点

难度：中等

[地址](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/)

```ts
function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  if (head === null || n === 0) {
    return head
  }
  const sentry = new ListNode(0)
  sentry.next = head
  let p1: ListNode | null = sentry.next
  let p2: ListNode = p1
  let count = 0
  while (count !== n && p1 !== null) {
    p1 = p1?.next
    count++
  }
  if (p1 === null) {
    return head.next
  }
  while (p1.next !== null) {
    p1 = p1?.next
    p2 = p2?.next as ListNode
  }
  p2.next = (p2?.next as ListNode).next
  return sentry.next
}
```

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

### 24-两两交换链表中的节点

难度：中等

[url](https://leetcode.cn/problems/swap-nodes-in-pairs/)

```ts
function swapPairs(head: ListNode | null): ListNode | null {
  if (head === null || head.next === null) {
    return head
  }
  const dummy = new ListNode(0)
  dummy.next = head
  let p1: ListNode | null = dummy
  let p2: ListNode | null = dummy.next.next
  while (p2 !== null) {
    const temp = p1.next as ListNode
    p1.next = p2
    temp.next = p2?.next
    p2.next = temp

    p2 = p1.next
    if (p2 !== null) {
      p2 = p2.next
    }
  }
  return dummy.next
}

// 递归思想
function swapPairs(head: ListNode | null): ListNode | null {
  if (head === null || head.next === null) {
    return head
  }
  const rest = head.next.next
  const next = head.next
  const dummy = new ListNode(0)
  dummy.next = next
  next.next = head
  head.next = swapPairs(rest)
  return dummy.next
}
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