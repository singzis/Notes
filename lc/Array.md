

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