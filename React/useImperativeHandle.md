# useImperativeHandle

React官网对`useImperativeHandle`介绍也比较简短。总结一句话就是：**子组件利用`useImperativeHandle`可以让父组件输出任意数据**

```react
// FancyInput组件作为子组件
const FancyInput = React.forwardRef(function FancyInput(props, ref) {
  const inputRef = useRef();

  // 命令式的给`ref.current`赋值个对象
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus()
    }
  }));
  
  return <input ref={inputRef} ... />
})

// Example组件作为父组件
function Example() {
  const fancyInputRef = useRef()

  const focus = () => {
    fancyInputRef.current.focus()
  }

  return (
    <>
      <FancyInput ref={fancyInputRef} />
    </>
  )
}
```

## 语法

```react
useImperativeHandle(ref, createHandle, [deps])
```

1. `ref`
   需要被赋值的`ref`对象。
2. `createHandle`：
   `createHandle`函数的返回值作为`ref.current`的值。
3. `[deps]`
   依赖数组，依赖发生变化会重新执行`createHandle`函数。

## 什么时候执行`createHandle`函数？

测试发现和`useLayoutEffect`执行时机一致。
修改下组件`FancyInput`内容

```react
const FancyInput = React.forwardRef(function FancyInput(props, ref) {
    const inputRef = useRef();
    console.log('render 1')

    useLayoutEffect(() => {        
        console.log('useEffect1', ref)
    })

    useImperativeHandle(ref, function() {        
        debugger
        console.log('useImperativeHandle')
        return {
            focus: () => {
                inputRef.current.focus();
            }
        }
    })    

    useLayoutEffect(() => {        
        console.log('useEffect2', ref);
    })

    console.log('render 2')
    return <input ref={inputRef}  placeholder="FancyInput"/>;
})
```

控制台打印：

```
render 1
render 2
useEffect1 {current: undefined}
useImperativeHandle
useEffect2 {current: {...}}
```

看看控制台输出发现`createHandle`函数的执行时机和`useLayoutEffect`一致，这样就**保证了在任意位置的`useEffect`里都能拿到最新的`ref.current`的值**。

**注意：**执行`createHandle`函数的还有个前提条件，即`useImperativeHandle`的第一个实参`ref`必须有值（否则执行`createHandle`函数也没意义啊）

## 应用场景

目前项目已经有多处使用场景了，主要是解决父组件获取子组件的数据或者调用子组件里声明的函数。
如[formik库](https://link.segmentfault.com/?enc=vSPY%2F46ise5OtyR%2FiaQhzA%3D%3D.oIgYEkxg7upa28zg3uD4PbLKENHoIyslYNNF2eFbKy08gVc2MRAhoqFRt9V7RXINXp5b73tw4%2BN8I52vq9JYbJTDnGpP6dD3BShWZPy%2B9QPCBDGTCL4FxU8v3PvDyIZtvLnER4Udd1IUPNtD2GgYtVEqkCLARLaMGe%2FxId8VlXY%3D)的一处使用：

```re
React.useImperativeHandle(innerRef, () => formikbag);
```

## 最佳实践

React官网里给出了几点使用建议：

1. 尽量避免命令式地给`ref.current`赋值，尽量采用声明式的（即让React内部处理）；
2. 和`forwardRef`搭配使用
   这个不一定，比如上面fomik库就没有这样做。

## 原理

先回顾下是如何使用`ref`的：

1. 初期利用`ref`访问子组件的实例或DOM元素
2. 后来`useRef`出现了，我们在函数组件里利用`useRef`还可以存储一些类似成员变量的数据

再回顾下React如何处理[声明式ref](https://link.segmentfault.com/?enc=ZZCUTr1nQMhgVuM0m4GDkA%3D%3D.hb25XDkKIQxQVdA9troZY7jkKbDJ8RWyEkcELZ4kws5Wb2YZTkqMjRJOkIXjGef5)的:

> React will assign the current property with the DOM element when the component mounts, and assign it back to null when it unmounts.

通过之前的知识我们可以达成几点共识：

1. 给`ref.current`赋值是个副作用，所以一般在`Did`函数或者事件处理函数里给`ref.current`赋值；
2. 组件在卸载时要清理`ref.current`的值

本质上`useImperativeHandle`就是在帮我们做这些事情。

## 为什么需要`useImperativeHandle`

我们都知道父组件可以利用`ref`可以访问子组件实例或者DOM元素，这其实相当于子组件向父组件输出本身实例或者DOM元素。而利用`useImperativeHandle`子组件可以向父组件输出任意数据