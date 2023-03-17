通过创建一个IntersectionObserver对象，其监听的目标元素的可见部分超过一个或者多个阙值时，会执行回调函数

```js
const callback = (entries, obverser) => {
	if(entries[0].isIntersecting) {
		// 越界
	}
}

const observer = new intersectionobserver(callback, options)

obverser.observe(node)
```

当目标元素node超过指定范围后就会触发callback，callback接受两个参数：
- entries：目标元素与根元素的交叉状态对象，可以用`entries[0].isIntersecting`来判断是否超出范围
- observer：被调用的Obserser实例

其中options可以用来配置实例对象，主要有：
- root：指定参考元素，默认是监听元素的祖先元素。目标在参考元素可见区域的任何不可见部分都被视为不可见
- rootMargin：扩大或缩小参考元素判定范围，值类型像css中的margin，默认是0，比如是10px的话，即表示距离参考元素10px内都属于不可见
- threshold：规定了一个监听目标与边界盒交叉区域的比例值，可以是一个具体的数值或是一组 0.0 到 1.0 之间的数组。若指定值为 0.0，则意味着监听元素即使与根有 1 像素交叉，此元素也会被视为可见。若指定值为 1.0，则意味着整个元素都在可见范围内时才算可见。可以参考[阈值](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API#thresholds)来深入了解阈值是如何使用的。阈值的默认值为 0.0。

用该属性来实现长列表触底加载：

```tsx
import { useEffect, useState, useRef, useCallback } from 'react'

// Fetch list function
async function fetchList() {
  const response = await fetch("长列表");
  const data = await response.json();
  return data;
}

function LongList() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const observer = useRef<IntersectionObserver | null>(null)
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setLoading(true)
          fetchList().then((newList) => {
            setList((prevList) => [...prevList, ...newList])
            setLoading(false)
          })
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading]
  )

  useEffect(() => {
    setLoading(true)
    fetchList().then((list) => {
      setList(list)
      setLoading(false)
    })
  }, [])

  return (
    <div>
      <h1>Long List</h1>
      <ul>
        {list.map((item, index) => (
          <li key={item.id} ref={index === list.length - 1 ? lastElementRef : null}>
            {item.name}
          </li>
        ))}
      </ul>
      {loading && <div>Loading...</div>}
    </div>
  )
}
```

