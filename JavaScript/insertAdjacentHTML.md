# insertAdjacentHTML

`elem.insertAdjacentHTML(where, html)`

将内容“作为 HTML 代码插入”，让内容中的所有标签和其他东西都像使用 `elem.innerHTML` 所表现的效果一样

该方法的第一个参数是代码字（code word），指定相对于 `elem` 的插入位置。必须为以下之一：

- `"beforebegin"` —— 将 `html` 插入到 `elem` 之前
- `"afterbegin"` —— 将 `html` 插入到 `elem` 开头
- `"beforeend"` —— 将 `html` 插入到 `elem` 末尾
- `"afterend"` —— 将 `html` 插入到 `elem` 之后

第二个参数是 HTML 字符串，该字符串会被“作为 HTML” 插入

例如：

```html
<div id="div"></div>
<script>
  div.insertAdjacentHTML('beforebegin', '<p>Hello</p>');
  div.insertAdjacentHTML('afterend', '<p>Bye</p>');
</script>
```

得到

```html
<p>Hello</p>
<div id="div"></div>
<p>Bye</p>
```

类似方法：

- `elem.insertAdjacentText(where, text)` —— 语法一样，但是将 `text` 字符串“作为文本”插入而不是作为 HTML，

- `elem.insertAdjacentElement(where, elem)` —— 语法一样，但是插入的是一个元素

对于元素和文本，我们有 `append/prepend/before/after` 方法 —— 它们也可以用于插入节点/文本片段，但写起来更短