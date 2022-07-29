# Map 与 Set 知识总结

## Set

Set 是一个构造函数，通过 new 生成的实例，可以允许存储任意类型的唯一值，无论是原始值还是引用，并且能够按照值的存储顺序被迭代

```js
const newSet = new Set([1, 2, 1]);
alert(newSet); // Set(2) {1, 2}
```

### Set 的特性

- 任意类型的值
- 唯一性
- 接受可迭代对象、null 和空值作为初始值
- 值按存储顺序排列
- 可迭代

### Set 实例常用方法和属性

假设 set 为一个 Set 实例，set 可以调用 Set.prototype 上的一些方法

`set.size`

返回 set 中值的个数

`set.add(value)`

往 set 中新增一个值 value

`set.delete(value)`

删除 set 中的 value

`set.clear()`

清空 set

`set.has(value)`

set 中是否存在 value，是返回 true，否则返回 false

`set.keys()`

按存储顺序返回包含 set 中所有 key 值的一个迭代器

`set.values()`

按存储顺序返回包含 set 中所有 value 值的一个迭代器

`set.forEach(callback,thisArg)`

对 set 中的每个值调用一次 callback。如果指定了 thisArg，callback 中的 this 值就是 thisArg 指定的对象

## Map

Map 是一个构造函数，通过 new 生成的实例，可以允许存储任意类型的健值对`[key,value]`，无论是原始值还是引用，并且能够按照值的存储顺序被迭代

```js
const map = new Map([
  ["k", "v"],
  [{ key: "key" }, "value"],
]);
alert(map); // Map(2) {"k" => "v", {…} => "value"}
```

### Map 的特性

- 任意类型的值
- 健值对中 key 具有唯一性
- 值按存储顺序排列
- 可迭代

### Map 实例常用方法和属性

假设 map 为一个 Map map 可以调用 Map.prototype 上的一些方法

`map.size`

返回 map 中健值对的数量

`map.set(key,value)`

设置 map 对象中键的值。返回该 map 对象。

`map.get(key)`

返回 map 中健对应的值，不存在就返回 undefined

`map.delete(key)`

删除 map 中的对应的 key，成功删除则返回 true，否则返回 false

`map.clear()`

清空 map

`map.has(key)`

map 中是否存在 key 对应的值，存在则返回 true，否则返回 false

`map.keys()`

按存储顺序返回一个包含 map 中所有 key 值的迭代器

`set.values()`

按存储顺序返回一个包含 map 中所有 value 值的迭代器

`set.forEach(callback,thisArg)`

对 map 中的每个值调用一次 callback。如果指定了 thisArg，callback 中的 this 值就是 thisArg 指定的对象

## Map、Set 与 Object、Array 的比较

### 值的类型

1. Map 的健和值与 Set 的值为任意类型，且无重复值
2. Object 的健为字符串，且无重复值
3. Array 的值为任意类型，但可以存在重复值

### 值的操作

```js
const map = new Map();
const set = new Set();
const obj = new Object();
const arr = new Array();

// 新增
map.set("a", 1);
set.add(1);
obj.a = 1;
arr.push(1);

// 查询
map.has("a"); // true
set.has(1); // true
obj.hasOwnProperty("a"); // true
arr.includes(1); // true

// 获取
map.get("a"); // 1
obj.a; // 1
arr[0]; // 1

// 删除
map.delete("a"); // true
set.delete(1); // true
delete obj.a; // true
arr.pop(); // 1
```

## Object/Map何为最佳实践

- 当插入顺序是你解决问题时需要考虑的，并且当前需要使用除 String 和 Symbol 以外的键名时，那么 **「Map」** 就是个最佳解决方案
- 如果需要遍历键值对（并且需要考虑顺序）,那我觉得还是需要优先考虑 **「Map」**。
- **Map**是一个纯哈希结构，而**Object**不是（它拥有自己的内部逻辑）。**Map** 在频繁增删键值对的场景下表现更好，性能更高。因此当你需要频繁操作数据的时候也可以优先考虑 **Map**
- 再举一个实际的例子，比如有一个自定义字段的用户操作功能，用户可以通过表单自定义字段，那么这时候最好是使用 Map，因为很有可能会破坏原有的对象

```js
const userCustomFields = {
  'color':    'blue',
  'size':     'medium',
  'toString': 'A blue box' // 与原有方法重名
};
```

此时用户自定义的 toString 就会破坏到原有的对象 而 「Map」 键名接受任何类型，没有影响

```js
function isMap(value) {
  return value.toString() === '[object Map]';
}

const actorMap = new Map();

actorMap.set('name', 'Harrison Ford');
actorMap.set('toString', 'Actor: Harrison Ford');

// Works!
isMap(actorMap); // => true
```

- 当你需要处理一些属性，那么 **「Object」** 是完全受用的，尤其是需要处理 JSON 数据的时候。由于 **「Map」** 可以是任意类型，因此没有可以将其转化为 JSON 的原生方法。

```js
var map = new Map()
map.set('key','value')
JSON.stringify(map)  //"{}"
```

- 当你需要通正则表达式判断去处理一些业务逻辑时，**「Map」**将是你的最佳解决方案

```js
const actions = ()=>{
  const functionA = ()=>{/*do sth*/}
  const functionB = ()=>{/*do sth*/}
  const functionC = ()=>{/*send log*/}
  returnnewMap([
    [/^guest_[1-4]$/,functionA],
    [/^guest_5$/,functionB],
    [/^guest_.*$/,functionC],
    //...
  ])
}

const onButtonClick = (identity,status)=>{
  let action = [...actions()].filter(([key,value])=>(key.test(`${identity}_${status}`)))
  action.forEach(([key,value])=>value.call(this))
}
```
