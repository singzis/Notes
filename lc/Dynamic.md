

## details

### 397-整数替换

难度：中等

[地址](https://leetcode.cn/problems/integer-replacement/)

```ts
// 用BFS解答
function integerReplacement(n: number): number {
   const map = {}
   function d(n: number) {
     if (n === 1) {
       return 0
     }
     if (n === 2) {
       return 1
     }
     if (map[n]) {
       return map[n]
     }
     let r = 0
     if (n & 1) {
       r = Math.min(d(n - 1), d(n + 1)) + 1
     } else {
       r = d(n / 2) + 1
     }
     map[n] = r
     return r
   }
   return d(n)
}

// 用位运算解答
function integerReplacement(n: number): number {
  let count = 0
  while (n !== 1) {
    if (n & 1) {
      if (n !== 3 && n & 2) {
        // 次低位为1时，适合+1，这样能做能得到4的倍数，因为所有+1能成为4的倍数的数，综合下来变化次数最少
        // 比如1001111111，次低位是1，做+1后为1010000000，如果是-1，则为1001111110，会增加后续计算次数
        // 3例外，是一个边界条件
        n++
      } else {
        n--
      }
    } else {
	  // 注意边界 2^31 进行>>时会出现问题，这里用无符号>>>右移 
      n = n >>> 1
    }
    count++
  }
  return count
}
```