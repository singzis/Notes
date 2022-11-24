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
    } else {
      // 无法缩小，即该位置对应的子字符串无相同的前后缀，继续向右进行匹配
      i++;
    }
  }

  return next;
}

function KMP(txt: string, pat: string) {
  const next = buildNext(pat);
  let t = 0; // 文本中的下标
  let p = 0; // 模式字符串中的下标
  let result = []; // 存储命中时在txt中的起始下标

  while (t < txt.length) {
    if (txt[t] === pat[p]) {
      // 字符命中，继续匹配下一个，进行比较
      t++;
      p++;
    } else if (p) {
      // 当前pInPat未命中，通过next找到pInPat-1时的子字符串拥有的最大相等前后缀字符长度k，取k位置的字符继续比较
      p = next[p - 1];
    } else {
      // pInPat为0时依旧没有命中，则向右移动文本下标，匹配下一个字符进行比较
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
