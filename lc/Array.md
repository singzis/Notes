[11-盛最多水的容器](#11-盛最多水的容器)
[16-最接近的三数之和](#16-最接近的三数之和)
[17-电话号码的字母组合](#17-电话号码的字母组合)
[18-四数之和](#18-四数之和)
[2032-至少在两个数组中出现的值](#2032-至少在两个数组中出现的值)

## details

### 11-盛最多水的容器

难度：中等

[地址](https://leetcode.cn/problems/container-with-most-water)

```ts
// 思路关键点
// 两个板子往中间移动，p2-p1的值都会少1
// 移动短板，出现的情况是1.新版子变长，则面积有可能变大，2.新板子小于或者等于原板子，则面积一定变小
// 移动长板，出现的情况是1.新板子变长，则面积还是变小，2.新板子等于或者小于原短板，面积还是变小
// 所以每次移动短板，才有可能获得新的大面积
function maxArea(height: number[]): number {
  if (height.length === 2) {
    return Math.min(height[0], height[1])
  }
  let max: number = 0
  let p1 = 0
  let p2 = height.length - 1
  while (p1 < p2) {
    const minH = Math.min(height[p1], height[p2])
    max = Math.max(max, (p2 - p1) * minH)
    while (height[p1] <= minH && p1 < p2) {
      p1++
    }
    while (height[p2] <= minH && p1 < p2) {
      p2--
    }
  }

  return max
}
```

### 16-最接近的三数之和

难度：中等

[地址](https://leetcode.cn/problems/3sum-closest/)

```ts
// 双指针法
function threeSumClosest(nums, target) {
  nums.sort((a, b) => a - b) // 先将数组排序
  let closestSum = Infinity // 用来记录最接近的和
  for (let i = 0; i < nums.length-2; i++) {
    let left = i + 1 // 初始化左指针
    let right = nums.length - 1 // 初始化右指针
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right] // 计算三元组的和
      if (Math.abs(target - sum) < Math.abs(target - closestSum)) {
        // 如果更接近，则更新最接近的和
        closestSum = sum
      }
      if (sum < target) {
        left++ // 左指针右移
      } else if (sum > target) {
        right-- // 右指针左移
      } else {
        // 如果恰好等于目标值，直接返回
        return sum
      }
    }
  }
  return closestSum
}
```

### 17-电话号码的字母组合

难度：中等

[url](https://leetcode.cn/problems/letter-combinations-of-a-phone-number/)

```ts
// 递归的思想，后一个字母需要与前面的所有组合再组合一次
 function letterCombinations(digits: string): string[] {
   if (digits === '') {
     return []
   }
   const obj = {
     2: 'abc',
     3: 'def',
     4: 'ghi',
     5: 'jkl',
     6: 'mno',
     7: 'pqrs',
     8: 'tuv',
     9: 'wxyz',
   }

   function f(str: string, idx: number): string[] {
     const cur = obj[str[idx]]
     if (idx === 0) {
       return cur.split('')
     }
     const r: string[] = []
     const prev = f(str, idx - 1)
     for (let i = 0; i < prev.length; i++) {
       for (let j = 0; j < cur.length; j++) {
         r.push(prev[i] + cur[j])
       }
     }
     return r
   }

   return f(digits, digits.length - 1)
 }
 // 队列思想
 // 23
 // queue = [a,b,c]
 // a出队 [b,c,ad,ae,af]
 // b出队 [c,ad,ae,af,bd,be,bf]
 // c出队 [ad,ae,af,bd,be,bf,cd,ce,cf]
 function letterCombinations(digits: string): string[] {
  if (digits === '') {
    return []
  }
  const obj = {
    2: 'abc',
    3: 'def',
    4: 'ghi',
    5: 'jkl',
    6: 'mno',
    7: 'pqrs',
    8: 'tuv',
    9: 'wxyz',
  }

  const queue: string[] = obj[digits[0]].split('')
  for (let i = 1; i < digits.length; i++) {
    const queueLen = queue.length
    const cur = obj[digits[i]].split('')
    for (let _ = 0; _ < queueLen; _++) {
      const temp = queue.pop()
      for (let j = 0; j < cur.length; j++) {
        queue.push(temp + cur[j])
      }
    }
  }
  return queue
}
```

### 18-四数之和

难度：中等

[url](https://leetcode.cn/problems/4sum/)

```ts
// 三数之和的基础上多一次循环
function fourSum(nums: number[], target: number): number[][] {
  if (nums.length < 4) {
    return []
  }
  nums.sort((a, b) => a - b)

  function twoSum(
    nums: number[],
    target: number,
    start: number,
    end: number
  ): number[][] {
    const res: number[][] = []
    let left = start
    let right = end
    while (left < right) {
      const sum = nums[left] + nums[right]
      if (sum === target) {
        res.push([nums[left], nums[right]])
        left++
        while (nums[left] === nums[left - 1] && left < right) {
          left++
        }
        right--
        while (nums[right] === nums[right + 1] && left < right) {
          right--
        }
      } else if (sum < target) {
        left++
      } else {
        right--
      }
    }
    return res
  }

  function threeSum(
    nums: number[],
    target: number,
    start: number,
    end: number
  ): number[][] {
    const res: number[][] = []
    let i = start
    while (i <= end - 2) {
      const r = twoSum(nums, target - nums[i], i + 1, end)
      if (r.length > 0) {
        for (let a of r) {
          res.push([nums[i], ...a])
        }
        while (nums[i] === nums[i + 1] && i <= end - 2) {
          i++
        }
      }
      i++
    }
    return res
  }

  const res: number[][] = []
  let i = 0
  while (i < nums.length - 3) {
    const r = threeSum(nums, target - nums[i], i + 1, nums.length - 1)
    if (r.length > 0) {
      for (let a of r) {
        res.push([nums[i], ...a])
      }
      while (nums[i] === nums[i + 1] && i < nums.length - 3) {
        i++
      }
    }
    i++
  }

  return res
}
```

### 2032-至少在两个数组中出现的值

难度：简单

[地址](https://leetcode.cn/problems/two-out-of-three/)

```ts
// 用三个数组中的值作为ans的下标
// num1中的数，在ans指定位置上为1
// num2中数，如果在ans对应下表处存在值为1，就将对应值改为-1，如果存在值为0，表示nums1中没有该值，则赋值为2，表示nums2中有这个值
// 对于nums3，仅需要检验对应位置的值是否为1或者2，存在则改为-1
function twoOutOfThree(
  nums1: number[],
  nums2: number[],
  nums3: number[]
): number[] {
  const ans = new Array(101).fill(0)
  const res: number[] = []

  for (let x of nums1) {
    ans[x] = 1
  }

  for (let y of nums2) {
    if (ans[y] === 1) {
      ans[y] = -1
      res.push(y)
    } else if (ans[y] === 0) {
      ans[y] = 2
    }
  }

  for (let z of nums3) {
    if (ans[z] === 1 || ans[z] === 2) {
      ans[z] = -1
      res.push(z)
    }
  }

  return res
}
```