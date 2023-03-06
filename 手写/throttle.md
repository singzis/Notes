# 节流-throttle

> 触发事件后，在指定时间间隔内，该事件只会执行一次

- 懒加载要监听计算滚动条的位置，使用节流按一定时间的频率获取
- 提交按钮

Hooks 实现版本

```js
function useThrottle(fn, delay) {
  const [timer, setTimer] = useState(null)

  const fnc = function (...arg) {
    if (!timer) {
      setTimer(
        setTimeout(() => {
          setTimer(null)
        }, delay)
      )
      fn.apply(undefined, arg)
    }
  }

  return fnc
}
```

js 版本：

```js
function throttle(fn, delay) {
  let timer
  return function (...arg) {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null
      }, delay)
      fn.apply(undefined, arg)
    }
  }
}
```
