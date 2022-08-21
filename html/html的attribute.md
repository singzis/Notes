# html的attribute

attribute分标准的非标准的，标准的包括`<input />`的`value`，`<a />`的`href`等，以及一些非标准的，即程序员自定义的

## 标准attribute

对于html的attribute来说，值永远都是字符串，即使像`checked`和`style`这种attribute，值也是以字符串的形式存在的

标准属性不会区分大小写，对于html来说，`id`和`ID`是一样的，最后都会转变成小写的

一般来说，标准的attribute在html生成DOM后可以通过DOM属性访问到，通过DOM访问时要注意大小写

```html
<Input id="elem" checked />
```

```js
elem.checked // true
elem.getAttribute(checked) // undefined
```

## 非标准attribute

对于非标准的attribute，通用术语为dataset

非标准属性无法通过DOM属性访问到，但是可以通过`getAttribute`访问到，包括其他的一些方法：

- `elem.hasAttribute(name)` —— 检查是否存在这个特性
- `elem.getAttribute(name)` —— 获取这个特性值
- `elem.setAttribute(name, value)` —— 设置这个特性值
- `elem.removeAttribute(name)` —— 移除这个特性
- `elem.attributes` —— 所有特性的集合

对于非标准属性的作用，有时会用于js中传值使用

```html
<!-- 标记这个 div 以在这显示 "name" -->
<div show-info="name"></div>
<!-- 标记这个 div 以在这显示 "age" -->
<div show-info="age"></div>

<script>
  // 这段代码找到带有标记的元素，并显示需要的内容
  let user = {
    name: "Pete",
    age: 25
  };

  for(let div of document.querySelectorAll('[show-info]')) {
    // 在字段中插入相应的信息
    console.log(div.showInfo) // undefined
    let field = div.getAttribute('show-info');
    div.innerHTML = user[field]; // 首先 "name" 变为 Pete，然后 "age" 变为 25
  }
</script>
```

还有就是用于css选择器

```html
<style>
  /* 样式依赖于自定义特性 "order-state" */
  .order[order-state="new"] {
    color: green;
  }

  .order[order-state="pending"] {
    color: blue;
  }

  .order[order-state="canceled"] {
    color: red;
  }
</style>

<div class="order" order-state="new">
  A new order.
</div>

<div class="order" order-state="pending">
  A pending order.
</div>

<div class="order" order-state="canceled">
  A canceled order.
</div>
```

如果需要更换状态，可以不用更换类名的方式：

```js
// 比删除旧的或者添加一个新的类要简单一些
div.setAttribute('order-state', 'canceled');
```

针对自定义的attribute，为了防止可能在以后会成为标准属性，规定以`data-`开头的属性供程序员自由使用，并且可以通过`dataset`访问

```html
<body data-about="Elephants" data-about-home="Home">
<script>
  console.log(document.body.dataset.about); // Elephants
  console.log(document.body.dataset.aboutHome); // Home（注意需要改写成驼峰式）
  document.body.dataset.aboutHome = 'no home'; // 还可以修改值
</script>
```