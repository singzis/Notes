# javascript 复制内容到贴板

需求描述：通过点击按钮复制变量内容到粘贴板。

## 1.使用原生 API：document.execCommand

根据 MDN 说明，该接口已被废弃，虽然依旧可以使用：

![img](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/951d36c8-20d9-4764-944f-7704c0d5a8b0/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20200622%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20200622T150329Z&X-Amz-Expires=86400&X-Amz-Signature=3bbaa204cf5774e9ab8a287e0fe5a60b0e6cc5af9c13c54c8788739fbcd10a1d&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22)

该 API 主要是可通过命令来操作可编辑区域，接收三个参数：

- aCommandName：一个 DOMString ，命令的名称
- aShowDefaultUI：一个 Boolean， 是否展示用户界面，一般为 false。Mozilla 没有实现
- aValueArgument：一些命令（例如 insertImage）需要额外的参数（insertImage 需要提供插入 image 的 url），默认为 null

这里主要使用命令**copy**：

```jsx
document.execCommand("copy");
```

根据描述我们仅能访问可编辑区域，比如**input**,**textarea**等标签。

所以我们需要手动创建一个可编辑区域，然后给赋值并选中：

```jsx
function copy(content) {
  const input = document.createElement("input");
  input.setAttribute("value", content);
  input.focus();
  input.setSelectionRange(0, 99999);
  document.body.appendChild(input);
  if (document.execCommand("copy")) {
    document.execCommand("copy");
  }
  document.body.removeChild(input);
}
```

然后就是把函数赋予需要点击触发的元素，比如**_react_**中：

```jsx
export default function CopyBtn({ content }) {
  return <a onClick={() => copy(content)}>点击复制</a>;
}
```

如果是直接从某个**input**中获取内容，就只需要找到元素并提取它的 value 即可

## 2.第三方库：clipboard.js

地址：[clipboard.js](https://clipboardjs.com/)
