# 防抖-debounce

> 频繁触发事件时，仅在事件触发间隔超过规定间隔时，事件才会有效执行

- 输入框中搜索内容时，为了减少服务器压力，只需相应用户的最后一次输入，无需相应用户的中间输入值
- 频繁改变窗口大小时，在用户停止改变一定时间后再触发相应事件（如果需要实时响应，得用 throttle）

hooks 实现版本：

```js
// 通过触发函数重置
function useDebounce(fn, delay) {
  const { current } = useRef({})

  const fnc = function (...arg) {
    if (current.timer) clearTimeout(current.timer)
    current.timer = setTimeout(() => {
      fn.apply(undefined, arg)
      current.timer = null
    }, delay)
  }

  return fnc
}
```

useDebounce：

```js
// 通过值或者时间限制的改变重置
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
```

js 版本：

```js
/**
 * @param {Function} 需要防抖处理的函数
 * @param {number} 时间间隔
 * @return {Function} 被防抖处理的函数
 */
function debounce(fn, delay) {
  let timer
  return function (...arg) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(undefined, arg)
      timer = null
    }, delay)
  }
}
```

js 进阶版：

```js
/**
 * @param {Function} 需要防抖处理的函数
 * @param {number} 时间间隔
 * @param {boolean} 若为 true，表示计时器开始计时时立即执行；若为false，默认值，表示计时器计时结束时执行
 * @return {Function} 被防抖处理的函数
 */
function debounce(fn, delay, immediate = false) {
  let timer
  return function (...arg) {
    let context = this
    if (timer) clearTimeout(timer)
    if (immediate) {
      const callNow = !timer
      timer = setTimeout(() => {
        timer = null
      }, delay)
      if (callNow) fn.apply(context, arg)
    } else {
      timer = setTimeout(() => {
        fn.apply(context, arg)
        timer = null
      }, delay)
    }
  }
}
```
