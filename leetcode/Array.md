[11-盛最多水的容器](#11-盛最多水的容器)
[16-最接近的三数之和](#16-最接近的三数之和)
[17-电话号码的字母组合](#17-电话号码的字母组合)
[18-四数之和](#18-四数之和)
[26-删除有序数组中的重复项](#26-删除有序数组中的重复项)
[27-移除元素](#27-移除元素)
[35-搜索插入位置](#35-搜索插入位置)
[39-数组总和](#39-数组总和)
[40-数组总和2](#40-数组总和2)
[88-合并两个有序数组](#88-合并两个有序数组)
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

### 26-删除有序数组中的重复项

难度：简单

[url](https://leetcode.cn/problems/remove-duplicates-from-sorted-array/)

```ts
// i标识有序无重复数组的最后一项
// 用j遍历数组，寻找不等于i指向的数值的项，则添加到i+1处
function removeDuplicates(nums: number[]): number {
  let i = 0
  let j = 1
  while (j < nums.length) {
    if (nums[i] !== nums[j]) {
      nums[i + 1] = nums[j]
      i++
    }
    j++
  }
  return i + 1
}
```

### 27-移除元素

难度：简单

[url](https://leetcode.cn/problems/remove-element/)

```ts
// 思路同26-删除有序数组中的重复项
function removeElement(nums: number[], val: number): number {
  let p1 = 0
  let p2 = 0
  while (p2 < nums.length) {
    if (nums[p2] === val) {
      p2++
    } else {
      const t = nums[p1]
      nums[p1] = nums[p2]
      nums[p2] = t
      p1++
      p2++
    }
  }
  return p1
}
```

#### 35-搜索插入位置

难度：简单

[url](https://leetcode.cn/problems/search-insert-position/)

```ts
function searchInsert(nums: number[], target: number): number {
  let left = 0
  let right = nums.length - 1
  while (left <= right) {
    const mid = (left + right) >>> 1
    if (nums[mid] === target) {
      return mid
    } else if (nums[mid] < target) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }
  return left
}
```

#### 39-数组总和

难度：中等

[url](https://leetcode.cn/problems/combination-sum/)

```ts
// 比如 candidates=[2,3,6,7] target=7
// 可以通过7减去2得到5，来寻找是否存在满足target=5的组合，以此类推
// 5又剪去2得到3，寻找是否存在满足target=3的组合
// 通过动态规划来解决
function combinationSum(candidates: number[], target: number): number[][] {
  const dp: number[][][] = []
  for (let k = 0; k < target + 1; k++) {
    dp[k] = []
  }
  candidates.forEach(i => {
    let j = i
    for (; j < target + 1; j++) {
      const t = j - i
      if (t === 0) {
        dp[j].push([i])
      } else if (dp[t]) {
        dp[t].forEach(d => {
          dp[j].push([i, ...d])
        })
      }
    }
  })
  return dp[target]
}
```

```python
class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        dp = [[] for k in range(target+1)]
        for i in range(len(candidates)):
            cur = candidates[i]

            for j in range(cur, target+1):
                t = j - cur
                if t == 0:
                    dp[j].append([cur])
                elif dp[t]:
                    for m in dp[t]:
                        _m = m.copy()
                        _m.append(cur)
                        dp[j].append(_m)

        return dp[target]
```

#### 40-数组总和2

难度：中等

[url](https://leetcode.cn/problems/combination-sum-ii/)

```ts
// 先降序排序，从左往右寻找满足的组合
// 1. 当前值大于目标值，不满足，需要循环过滤
// 2. 当前值等于目标值，满足，需要循环寻找
// 3. 当前值小于目标值，从当前值后面的数组中找寻满足【目标值-当前值】的组合，这里还需要处理之后值与当前值相同的情况，因为当前值已经组合过一次了，后面相同的值就无需再去组合一次，需要过滤
function quickSort(numbers: number[]) {
  function partition(numbers: number[], start: number, end: number) {
    const p = numbers[end]
    let i = start
    let j = start
    while (j < end) {
      if (numbers[j] > p) {
        const t = numbers[j]
        numbers[j] = numbers[i]
        numbers[i] = t
        i++
      }
      j++
    }
    numbers[end] = numbers[i]
    numbers[i] = p
    return i
  }
  function sort(numbers: number[], start: number, end: number) {
    if (start >= end) {
      return
    }
    const p = partition(numbers, start, end)
    sort(numbers, start, p - 1)
    sort(numbers, p + 1, end)
  }

  sort(numbers, 0, numbers.length - 1)
}

function combinationSum2(candidates: number[], target: number): number[][] {
  quickSort(candidates)

  function f(candidates: number[], target: number, start: number) {
    if (target === 0) {
      return []
    }
    let result: number[][] = []
    const end = candidates.length
    let i = start
    while (i < end && candidates[i] > target) {
      i++
    }

    if (candidates[i] === target) {
      result.push([candidates[i]])
      while (i < end && candidates[i] === target) {
        i++
      }
    }

    for (; i < end; i++) {
      const reset = f(candidates, target - candidates[i], i + 1)
      result = [
        ...result,
        ...reset.reduce(
          (acc, cur) => [...acc, [candidates[i], ...cur]],
          result
        ),
      ]
    }

    return result
  }

  return f(candidates, target, 0)
}
```

```ts
// 升序，递归加剪枝
function combinationSum2(candidates: number[], target: number): number[][] {
  const result: number[][] = []
  const len = candidates.length
  candidates.sort((a, b) => a - b)
  function dfs(start, p, target) {
    if (target === 0) {
      result.push(p.slice())
      return
    }
    let i = start
    for (; i < len; i++) {
      if (candidates[i] > target) {
        break
      }
      if (i > start && candidates[i - 1] === candidates[i]) {
        continue
      }
      p.push(candidates[i])
      dfs(i + 1, p, target - candidates[i])
      p.pop()
    }
  }

  dfs(0, [], target)

  return result
}
```

#### 88-合并两个有序数组

难度：简单

[url](https://leetcode.cn/problems/merge-sorted-array/)

```ts
// 倒着插入，谁大谁先进入末尾
function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  while (n > 0) {
    if (m > 0 && nums1[m - 1] > nums2[n - 1]) {
      nums1[m + n - 1] = nums1[m - 1]
      m--
    } else {
      nums1[m + n - 1] = nums2[n - 1]
      n--
    }
  }
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