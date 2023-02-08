

## details

### 4-寻找有序数组的中位数

难度：困难

[地址](https://leetcode.cn/problems/median-of-two-sorted-arrays/)

```ts
// 思路就是对于中位数而言，就是找第k小的数
// 比如[1,2,3,4]，中位数就是第2小和第3小的数，k=2和k=3，找到这两个数然后取和求平均值
// [1,2,3,4,5]，中位数就是第3小的数
// 在两个数组中分别找第k/2的数做比较
// 这里的关键点在于，数组是有序的，假设两个数组A和B的前k/2-1个数，都小于A和B中第k/2个数
// 那么是能立即找出（k/2-1）*2 =k-2个数，而我们知道第k个数是要寻找的中位数
// 所以A和B中第k/2个数，较小的那个就是k-1个数，较大的就是第k个数
function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  const len1 = nums1.length;
  const len2 = nums2.length;
  if (len1 + len2 === 0) {
    return 0;
  }
  if (len1 + len2 === 1) {
    return nums1.concat(nums2)[0];
  }
  if (len1 + len2 === 2) {
    const a = nums1.concat(nums2);
    return (a[0] + a[1]) * 0.5;
  }
  function f(
    nums1: number[],
    start1: number,
    end1: number,
    nums2: number[],
    start2: number,
    end2: number,
    k: number
  ) {
    const len1 = end1 - start1 + 1;
    const len2 = end2 - start2 + 1;
    if (len1 > len2) {
      return f(nums2, start2, end2, nums1, start1, end1, k);
    }
    if (len1 === 0) {
      return nums2[start2 + k - 1];
    }
    if (k === 1) {
      return Math.min(nums1[start1], nums2[start2]);
    }
    const halfK = k >>> 1;
    const i = start1 + Math.min(len1, halfK) - 1;
    const j = start2 + Math.min(len2, halfK) - 1;
    if (nums1[i] < nums2[j]) {
      return f(nums1, i + 1, end1, nums2, start2, end2, k - (i - start1 + 1));
    } else {
      return f(nums1, start1, end1, nums2, j + 1, end2, k - (j - start2 + 1));
    }
  }
  if ((len1 + len2) & 1) {
    return f(nums1, 0, len1 - 1, nums2, 0, len2 - 1, (len1 + len2 + 1) >>> 1);
  } else {
    return (
      (f(nums1, 0, len1 - 1, nums2, 0, len2 - 1, (len1 + len2 + 1) >>> 1) +
        f(nums1, 0, len1 - 1, nums2, 0, len2 - 1, (len1 + len2 + 2) >>> 1)) *
      0.5
    );
  }
}
```