[58-最后一个单词的长度](#58-最后一个单词的长度)

## detail

### 58-最后一个单词的长度

难度：简单

[地址](https://leetcode.cn/problems/length-of-last-word/)

```ts
// 从右向左遍历开始不为空时计数，当为空时停止计数
function lengthOfLastWord(s: string): number {
  let count = 0
  for (let i = s.length - 1; i >= 0; i--) {
    if (s[i] !== ' ') {
      count++
    } else if (count > 0) {
      return count
    }
  }
  return count
}

// 'hello word   ' -> 4

// 双指针
function lengthOfLastWord(s: string): number {
    let end = s.length - 1
    while (end >= 0 && s[end] === ' ') {
        end--
    }
    if (end < 0) {
        return 0
    }
    let start = end
    while (start >= 0 && s[start] !== ' ') {
        start--
    }
    return end - start
}
```