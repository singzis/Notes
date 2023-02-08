关于next的一些说明
这个算法本质是找相等的最长匹配前缀和最长匹配后缀。
b为模版串，有两种情况
1. 如果b[i-1]的最长前缀下一个字符与b[i]相等，则next[i]=next[i-1]+1
2. 如果不相等，则我们假设找到b[i-1]的最长前缀里有b[0,y]与后缀的子串b[z,i-1]（z=i-1-y）相等，然后只要b[y+1]与b[i]相等，那么b[0,y+1]就是最长匹配前缀。这个y可以不断的通过迭代缩小就可以找到

k = next[k] 因为前一个的最长串的下一个字符不与最后一个相等，需要找前一个的次长串，问题就变成了求0到next(k)的最长串，如果下个字符与最后一个不等，继续求次长串，也就是下一个next(k)，直到找到，或者完全没有

![[ds_kmp_1.png]]

直接上代码
```ts
// 构建next
function buildNext(pat: string) {
  const len = pat.length;
  // next数组：next[i]表示在模式字符串（pat）中pat[0]～pat[i]这段子字符串的k-前缀和k-后缀相同的最大字符数k
  // 比如pat为aabaa，前后缀相同的最大字符数k为2，即aa
  const next = new Array(len).fill(0);
  let i = 1; // 遍历全字符串
  let now = 0; // 遍历前缀

  while (i < len) {
    if (pat[i] === pat[now]) {
      // 字符相同，向右继续匹配，记录当前位置的最大相同前后缀字符数
      now++;
      next[i] = now;
      i++;
    } else if (now) {
      // 不为0时，则缩小now，把now变成next[now-1]，直到P[now]=P[x]为止
      now = next[now - 1];
      // 回溯 -- now = next[now-1]
      // 因为前一个的最长串的下一个字符不与最后一个相等，需要找前一个的次长串，问题就变成了求0到next(now-1)的最长串，如果下个字符与最后一个不等，继续求次长串，也就是下一个next(now-1)，直到找到，或者完全没有
    } else {
      // 无法缩小，即该位置对应的子字符串无相同的前后缀，继续向右进行匹配
      i++;
    }
  }

  return next;
}

function KMP(txt: string, pat: string) {
  const next = buildNext(pat);
  // t：始终是主串的下标
  // p：始终是模式串的下标
  // 关键点是，在匹配过程中的任何时候，主串下标为 t 的字符永远和模式串下标为 p 的字符对齐。 例如，从初始状态开始，t 一直在增加，而 p 保持为0 （没有任何字符匹配上），那么它的含义就是模式串向后移动了 t 位。同时因为p=0，所以此时模式串首和主串 t 下标对齐。
  let t = 0;
  let p = 0;
  let result = []; // 存储命中时在txt中的起始下标

  while (t < txt.length) {
    if (txt[t] === pat[p]) {
      // 字符命中，继续匹配下一个，进行比较
      t++;
      p++;
    } else if (p) {
      // 当前p未命中，通过next找到p-1时的子字符串拥有的最大相等前后缀字符长度k，取k位置的字符继续比较
      p = next[p - 1];
    } else {
      // p为0时依旧没有命中，则向右移动文本下标，匹配下一个字符进行比较
      t++;
    }

    if (p === pat.length) {
      // 匹配完pat表示在txt中找到了对应的子字符串
      result.push(t - p);
      // 移动标尺，原理同上
      p = next[p - 1];
    }
  }

  return result;
}
```

知识点分析
- [从头到尾彻底理解KMP](https://blog.csdn.net/v_july_v/article/details/7041827)
- [如何更好地理解和掌握 KMP 算法?](https://www.zhihu.com/question/21923021)
- [通过DFA理解KMP 算法?](https://www.zhihu.com/question/21923021/answer/2719375462)
