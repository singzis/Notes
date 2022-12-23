[58-最后一个单词的长度](#58-最后一个单词的长度)
[6-z字形变换](#6-z字形变换)
[13-罗马数字转整数](#13-罗马数字转整数)

## details

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

### 6-z字形变换

难度：中等

[地址](https://leetcode.cn/problems/zigzag-conversion/)

```ts
// 思路：往一个属方向的数组中填充字符，遇到边界则反向，直到遍历完字符串s
// 假设s为PAYPA，numRows为3
// [P] -> [P,  -> [P,  -> [P,  ->  [PA,
//         A]      A,      AP,      AP,
//                 Y]      Y]       Y]
function convert(s: string, numRows: number): string {
  if (s.length <= numRows || numRows === 1) {
    return s
  }
  let flag = -1
  let y = 0
  const res: string[] = []
  for (let i = 0; i < s.length; i++) {
    res[y] = (res[y] || '') + s[i]
    if (y === 0 || y === numRows - 1) {
      flag = -flag
    }
    y += flag
  }
  return res.reduce((acc: string, cur: string) => acc + cur, '')
}
```

### 13-罗马数字转整数

难度：简单

[地址](https://leetcode.cn/problems/roman-to-integer/)

```ts
// 思路：针对特殊情况是，一个数比右边的数小则减掉这个小数，否则是加上这个数
// IV 就是 -1+5
// VI 就是 5+1
function romanToInt(s: string): number {
  const common = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  }
  let count = 0
  let pre = common[s[0]]
  for (let i = 1; i < s.length; i++) {
    const cur = common[s[i]]
    if (pre < cur) {
      count -= pre
    } else {
      count += pre
    }
    pre = cur
  }
  count += pre
  return count
}
```