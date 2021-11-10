# useSelector

// https://www.zhihu.com/question/332090851

// https://react-redux.js.org/api/hooks#useselector-examples

useSelector 不会产生新对象，只返回 state=>state.App.users 这种形式的内容，通过比较 users 来决定是否 re-render

useSelector 内部使用严格相等进行比较值前后差异，而 connect 使用的是浅比较，所以建议 useSelector 更细粒度的获取属性：

```js
// ✅
const users = useSelector(state => state.App.users)
// ❎
const { users } = useSelector(state => state.App)
```
