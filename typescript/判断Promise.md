# TS判断Promise

TypeScript 本身提供了 `PromiseLike<T>` 类型。另外，TypeScript 语法中有类型断言函数语法。

如果只是想在 `T` 和 `PromiseLike<T>` 之间进行判断：

```typescript
function isPromiseLike<T>(it: T | PromiseLike<T>): it is PromiseLike<T>{
  return it instanceof Promise || typeof (it as any)?.then === "function"
}
```

如果是判断任意类型是不是 PromiseLike，那么只需要把参数类型改为 `unknown` 就可以了：

```typescript
function isPromise<T>(it: unknown): it is PromiseLike<T> {
  return it instanceof Promise || typeof (it as any)?.then === "function"
}
```

使用的时候，如果不带类型，resolve 数据的类型是 `unknown`。如果带了类型，就直接给你识别成那个类型了，比如

![preview](https://segmentfault.com/img/bVcVGY7/view)