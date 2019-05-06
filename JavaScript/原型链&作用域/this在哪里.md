
this不是编写时绑定，而是运行时绑定，他依赖于函数调用的上下文。this绑定与函数声明的位置没有任何关系，而与函数调用的方式紧密相连。

判定this方法：

1.函数是通过new被调用的吗（new绑定）？

如果是，this就是新构建的实例对象，且无法改动。

```js
var bar = new foo(); //bar
```
    
2.函数是通过 call 或 apply 被调用的么（明确绑定），甚至是隐藏在bind硬绑定之中吗？

如果是，this就是那个被明确指定的对象。

```js
var bar = foo.call(obj2); //obj2
```
    
此刻this就是obj2
  
3.函数是通过环境对象（也称为拥有者或容器对象）被调用的吗（隐含绑定）？如果是，this就是那个环境对象。

```js
var bar = obj1.foo(); //obj1
```
    
4.否则，使用默认的this。如果在strict mode下，就是undefined，否则就是global对象。

```js
var bar = foo(); //window
```

5.箭头函数

箭头函数中使用的this由包裹该箭头函数所处的环境决定

```js
const func1 = function(){
  const func2 = () => {
    console.log(this.name);//FUNC
  }
  setTimeout(func2,1000);
}
func1.call({name:'FUNC'})
```

```js
const obj = {
    a: 'obj',
    f: () => {
        console.log(this)
    }
}
const func3 = obj.f;
func3();//window
```
