
[6-z字形变换](#6-z字形变换)
[7-整数反转](# 7-整数反转)
[8-字符串转换整数](#8-字符串转换整数)
[10-正则表达式匹配](#10-正则表达式匹配)
[12-罗马数字转整数](#12-罗马数字转整数)
[13-罗马数字转整数](#13-罗马数字转整数)
[14-最长公共前缀](#14-最长公共前缀)
[22-括号生成](#22-括号生成)
[58-最后一个单词的长度](#58-最后一个单词的长度)
[1750-删除字符串两端相同字符后的最短长度](#1750-删除字符串两端相同字符后的最短长度)
[2027-转换字符串的最少操作次数](#2027-转换字符串的最少操作次数)

## details

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

### 7-整数反转

难度：中等

[地址](https://leetcode.cn/problems/reverse-integer/)

```ts
// 思路，对数字取模
// 有正负数关系，x变为0则跳出循环
// 其他边界条件就是防止益处，提前判断是否会超出边界
function reverse(x: number): number {
    let res = 0
    while (x !== 0) {
        const temp = x % 10

        if (res > 214748364 || (res === 214748364 && temp > 7)) {
            return 0
        }
        if (res < -214748364 || (res === -214748364 && temp < -8)) {
            return 0
        }
        
        res = res * 10 + temp
        x = Math.trunc(x / 10)
    }
    return res
}
```

### 8-字符串转换整数

难度：中等

[地址](https://leetcode.cn/problems/string-to-integer-atoi/)

```ts
function myAtoi(s: string): number {
  let str = s.trim()
  let flag = 1
  if (str[0] === '-') {
    flag = -1
    str = str.slice(1)
  } else if (str[0] === '+') {
    str = str.slice(1)
  }
  let res = 0
  let i = 0
  while (i <= str.length - 1) {
    const temp = str[i]
    if (temp === ' ' || isNaN(Number(temp))) {
      return res * flag
    }
    res = res * 10 + Number(temp)
    if (flag === 1 && res > Math.pow(2, 31) - 1) {
      return Math.pow(2, 31) - 1
    } else if (flag === -1 && res * flag < -Math.pow(2, 31)) {
      return -Math.pow(2, 31)
    }
    i++
  }

  return res * flag
}
```

### 10-正则表达式匹配

难度：困难

[地址](https://leetcode.cn/problems/regular-expression-matching/)

```ts
// 思路，感觉过一段时间还是会忘记
// s:aab p:c*a*b
// m->s当前长度，n->p当前长度
// d(m)(n) => 只会有两种结果 1.true 2.false，为true的话，就要看前面的字符是否匹配，为false的话，则整体无法匹配了
// 1. s(m-1) === p(n-1) || p(n-1) === '.'  ===>  当前字符结果为匹配，那么d(m)(n) = d(m-1)(n-1)
// 2. s(m-1) !== p(n-1) 还不能说明结果为false，需要考虑几种情况
// 2.1 p(n-1)为一个固定字符，s(m-1) !== p(n-1) ===> 一定不匹配，d(m)(n) = false
// 2.2 p(n-1) === '*'  ===> 特殊情况，由前面的字符来决定，即p(n-2)
// 2.2.1 s(m-1) === p(n-2) || p(n-2) === '.'
// 2.2.1.1 利用*消除前面的字符，即使相等也消除，可次看s(m-1)与p(n-3)是否相等了，则d(m)(n) = d(m)(n-2)
// 2.2.1.2 利用*重复前面的字符，但是具备多次重复的能力，即存在s(m-2)、s(m-3)等等也等于p(n-2)，所以d(m)(n) = d(m-1)(n)
// 2.2.2 s(m-1) !== p(n-2)，此刻利用*消除的能力，可以将p(n-2)清除掉，然后观察p(n-3) ===> d(m)(n) = d(m)(n-2)
// 特殊情况
// s不为空，p为空，一定不匹配
// s为空，p为空，一定匹配
// s为空，p不为空，看情况：
// 1. p长度为奇数，一定不匹配
// 2. 为偶数，以步长为2遍历p，每次字符都为*，则一定匹配
//
//         c  *  a  *  b
//      p0 p1 p2 p3 p4 p5
//   m0 1  0  1  0  1  0
// a m1 0  0  0  1  1  0
// a m2 0  0  0  1  1  0
// b m3 0  0  0  0  0  1

function isMatch(s: string, p: string): boolean {
  const lenS = s.length + 1
  const lenP = p.length + 1
  const res: boolean[][] = []
  for (let i = 0; i < lenS; i++) {
    res[i] = new Array(lenP).fill(false)
  }
  res[0][0] = true
  for (let j = 2; j < lenP && p[j - 1] === '*'; j += 2) {
    res[0][j] = true
  }
  for (let m = 1; m < lenS; m++) {
    for (let n = 1; n < lenP; n++) {
      const a = s[m - 1]
      const b = p[n - 1]
      if (a === b || b === '.') {
        res[m][n] = res[m - 1][n - 1]
      } else if (b === '*') {
        res[m][n] =
          a === p[n - 2] || p[n - 2] === '.'
            ? res[m][n - 2] || res[m - 1][n]
            : res[m][n - 2]
      }
    }
  }
  return res[lenS - 1][lenP - 1]
}
```

### 12-罗马数字转整数

难度：中等

[地址](https://leetcode.cn/problems/integer-to-roman/)

```ts
function intToRoman(num: number): string {
    const common = {
        1: 'I',
        5: 'V',
        10: 'X',
        50: 'L',
        100: 'C',
        500: 'D',
        1000: 'M',
        4: 'IV',
        9: 'IX',
        40: 'XL',
        90: 'XC',
        400: 'CD',
        900: 'CM',
    };
    if (common[num]) {
        return common[num];
    }

    const str = num + '';
    let res = '';
    for (let i = 0; i < str.length; i++) {
        const pow = Math.pow(10, str.length - i - 1);
        let temp = Number(str[i]);
        if (pow < 1000 && (temp === 4 || temp === 9 || temp === 5)) {
            res = res + common[temp * pow];
        } else if (temp < 5) {
            // 1 2 3 4
            while (temp > 0) {
                res = res + common[pow];
                temp--;
            }
        } else {
            res = res + common[5 * pow];
            // 6 7 8 9
            while (temp > 5) {
                res = res + common[pow];
                temp--;
            }
        }
    }
    return res;
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

### 14-最长公共前缀

难度：简单

[地址](https://leetcode.cn/problems/longest-common-prefix/)

```ts
function longestCommonPrefix(strs: string[]): string {
    if (strs.length === 0) {
        return '';
    }
    strs.sort((a, b) => a.length - b.length);
    let maxStr = strs[0];
    for (let i = 1; i < strs.length; i++) {
        const temp = strs[i];
        let j = 0;
        while (maxStr[j] === temp[j] && j < maxStr.length) {
            j++
        }
        maxStr = maxStr.slice(0, j);
        if (maxStr === '') {
            return '';
        }
    }
    return maxStr;
};
```

### 22-括号生成

难度：中等

[url](https://leetcode.cn/problems/generate-parentheses/)

```ts
// 思路：n组括号可以看成在()上增加n-1组括号，这n-1组括号分布在()中间，和其右边
// '(' + p组括号 + ')' + q组括号
// p + q = n-1
// p从0增加到n-1，q从n-1减少到0，实现排列组合
// 举例 n=2 -> ()() (())
// n=3时
// p=0 -> ()+()() ()+(())
// p=1 -> (())+()
// p=2 -> (()()) ((()))
// n=3 -> ()()() ()(()) (())() (()()) ((()))
function generateParenthesis(n: number): string[] {
  if (n === 1) {
    return ['()']
  }

  const res: string[] = []
  let p1 = 0
  while (p1 < n) {
    let p2 = n - 1 - p1
    const r1 = p1 > 0 ? generateParenthesis(p1) : []
    const r2 = p2 > 0 ? generateParenthesis(p2) : []
    if (r1.length === 0) {
      for (let outer of r2) {
        res.push(`()${outer}`)
      }
    } else if (r2.length === 0) {
      for (let inner of r1) {
        res.push(`(${inner})`)
      }
    } else {
      for (let inner of r1) {
        for (let outer of r2) {
          res.push(`(${inner})${outer}`)
        }
      }
    }
    p1++
  }

  return res
}
```

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

### 1750-删除字符串两端相同字符后的最短长度

难度：中等

[地址](https://leetcode.cn/problems/minimum-length-of-string-after-deleting-similar-ends/)

```ts
function minimumLength(s: string): number {
  let left = 0;
  let right = s.length - 1;
  while (s[left] === s[right] && left < right) {
    left++;
    while (s[left] === s[left - 1]) {
      left++;
    }
    right--
    while (s[right] === s[right + 1]) {
      right--;
    }
  }
  return Math.max(0,right - left + 1);
};

// 方法2，多了一个中间字符串做操作
function minimumLength(s: string): number {
    let str = s;
  while (str[0] === str[str.length - 1] && str.length > 1) {
    let start = 1;
    let end = str.length - 2;
    while (str[start] === str[0] && start < str.length - 1) {
      start++;
    }
    while (str[end] === str[str.length - 1] && end > start) {
      end--;
    }
    str = str.slice(start, end + 1);
  }

  return str.length;
};
```

### 2027-转换字符串的最少操作次数

难度：简单

[地址](https://leetcode.cn/problems/minimum-moves-to-convert-string/)

```ts
function minimumMoves(s: string): number {
    let count = 0
    let i = 0
    while (i < s.length) {
        if (s[i] === 'X') {
            count++
            i += 3
        } else {
            i++
        }
    }
    return count
};
```

