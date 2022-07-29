# 数字（Number）

现代JS中，数字有两种类型：

- 常规数字以64位存储，也被称为双精度浮点数，不能超过2的53次幂 或小于 -2的53次幂
- BigInt数字，用于表示任意长度的整数

## isFinite和isNaN

- Infinity（-Infinity）是特殊值，比任何数都大（小），属于number
- NaN代表一个error，属于number

isNaN(value)将参数转换为数字，然后测试是否为NaN

```js
isNaN(NaN) // true
isNaN('str') // true
```

单纯用`==NaN`无法判断，因为NaN是独一无二的，所以`NaN===NaN`为false

isFinite(value)将参数转换为数字，如果是常规数字，则返回true，而不是NaN/Infinity/-Infinity

```js
isFinite('15') // true
isFinite('str') // false 特殊值：NaN
isFinite(Infinity) // false 特殊值
```

## Object.is

类似`===`一样对值进行比较，但对于两种边缘情况更有用：

- 比较NaN：`Object.is(NaN, NaN) // true`
- 0和-0不同：`Object.is(0, -1) // false`，在内部，数字的符号位可能会不同，即使其他所有为均为零

## parseInt和parseFloat

通过`+`或者`Number()`转换数字是严格的，如果某个值不完全是数字，则会出错

```js
Number('12px') // NaN
```

从字符串中读取数字，直到无法读取为止，如果发生error，则返回收集到的数字。

parseInt返回一个整数，parseFloat返回一个浮点数

```js
parseInt('100px') // 100
parseFloat('12.5em') // 12.5

parseInt('12.3') // 12 只有整数部分返回
parseFloat('12.3.4') // 12.3 在第二个点停止了读取 
```

parseInt(str, radix)具备第二个可选的参数，指定数字系统的基数，可以解析十六进制、二进制的字符串

```js
parseInt('0xff', 16) // 255
parseInt('ff', 16) // 255
parseInt('2n9c', 36) // 123456
```

## 总结

要写有很多零的数字：

- 将 `"e"` 和 0 的数量附加到数字后。就像：`123e6` 与 `123` 后面接 6 个 0 相同。
- `"e"` 后面的负数将使数字除以 1 后面接着给定数量的零的数字。例如 `123e-6` 表示 `0.000123`（`123` 的百万分之一）。

对于不同的数字系统：

- 可以直接在十六进制（`0x`），八进制（`0o`）和二进制（`0b`）系统中写入数字。
- `parseInt(str，base)` 将字符串 `str` 解析为在给定的 `base` 数字系统中的整数，`2 ≤ base ≤ 36`。
- `num.toString(base)` 将数字转换为在给定的 `base` 数字系统中的字符串。

要将 `12pt` 和 `100px` 之类的值转换为数字：

- 使用 `parseInt/parseFloat` 进行“软”转换，它从字符串中读取数字，然后返回在发生 error 前可以读取到的值。

小数：

- 使用 `Math.floor`，`Math.ceil`，`Math.trunc`，`Math.round` 或 `num.toFixed(precision)` 进行舍入。
- 请确保记住使用小数时会损失精度。

更多数学函数：

- 需要时请查看 [Math](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Math) 对象。这个库很小，但是可以满足基本的需求。

