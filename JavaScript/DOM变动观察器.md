`MutationObserver` 是一个内建对象，它观察 DOM 元素，并在检测到更改时触发回调
`MutationObserver` 可以对 DOM 的变化作出反应 —— 特性（attribute），文本内容，添加/删除元素。

我们可以用它来跟踪代码其他部分引入的更改，以及与第三方脚本集成。

`MutationObserver` 可以跟踪任何更改。`config` “要观察的内容”选项用于优化，避免不必要的回调调用以节省资源

## 语法
`MutationObserver` 使用简单。

首先，我们创建一个带有回调函数的观察器：

```js
let observer = new MutationObserver(callback);
```

然后将其附加到一个 DOM 节点：

```js
observer.observe(node, config);
```

`config` 是一个具有布尔选项的对象，该布尔选项表示“将对哪些更改做出反应”：

- `childList` —— `node` 的直接子节点的更改，

- `subtree` —— `node` 的所有后代的更改，

- `attributes` —— `node` 的特性（attribute），

- `attributeFilter` —— 特性名称数组，只观察选定的特性。

- `characterData` —— 是否观察 `node.data`（文本内容），

其他几个选项：

- `attributeOldValue` —— 如果为 `true`，则将特性的旧值和新值都传递给回调（参见下文），否则只传新值（需要 `attributes` 选项），

- `characterDataOldValue` —— 如果为 `true`，则将 `node.data` 的旧值和新值都传递给回调（参见下文），否则只传新值（需要` characterData`选项）。

然后，在发生任何更改后，将执行“回调”：更改被作为一个 [MutationRecord](https://dom.spec.whatwg.org/#mutationrecord) 对象列表传入第一个参数，而观察器自身作为第二个参数。

[MutationRecord](https://dom.spec.whatwg.org/#mutationrecord) 对象具有以下属性：

- `type` —— 变动类型，以下类型之一：

- `"attributes"`：特性被修改了，

- `"characterData"`：数据被修改了，用于文本节点，

- `"childList"`：添加/删除了子元素。

- `target` —— 更改发生在何处：`"attributes"` 所在的元素，或 `"characterData" `所在的文本节点，或 "childList" 变动所在的元素，

- `addedNodes/removedNodes` —— 添加/删除的节点，

- `previousSibling/nextSibling` —— 添加/删除的节点的上一个/下一个兄弟节点，

- `attributeName/attributeNamespace` —— 被更改的特性的名称/命名空间（用于 XML），

- `oldValue` —— 之前的值，仅适用于特性或文本更改，如果设置了相应选项 `attributeOldValue/characterDataOldValue`。