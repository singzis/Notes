# 一些有意思 hooks

1. usePrevProps

利用 useEffect 在渲染后执行的特性，让你在每次渲染都能访问到你传入的这个变量（对象）的上一个值

```js
const usePrevProps = (props) => {
  const prev = useRef();
  useEffect(() => {
    prev.current = props;
  });
  return prev.current;
};
```
