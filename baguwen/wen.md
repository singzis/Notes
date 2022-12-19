- 闭包是什么? 闭包的用途?
-   简述事件循环原理
-   虚拟dom是什么? 原理? 优缺点?
-   vue 和 react 在虚拟dom的diff上，做了哪些改进使得速度很快?
-   vue 和 react 里的key的作用是什么? 为什么不能用Index？用了会怎样? 如果不加key会怎样?
-   vue 双向绑定的原理是什么?
-   vue 的keep-alive的作用是什么？怎么实现的？如何刷新的?
-   vue 是怎么解析template的? template会变成什么?
-   如何解析指令? 模板变量? html标签
-   用过vue 的render吗? render和template有什么关系
-   对前端工程化的理解
-   前端性能优化都做了哪些工作
-   Nodejs 异步IO模型
-   libuv
-   设计模式
-   微前端
-   节流和防抖
-   react有自己封装一些自定义hooks吗? vue有自己封装一些指令吗
-   vue 向 react迁移是怎么做的? 怎么保证兼容的
-   vue的双向绑定原理
-   Node的日志和负载均衡怎么做的
-   那前后端的分工是怎样的？哪些后端做哪些node做
-   给出代码的输出顺序
```js
async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}
async function async2() {
    console.log('async2');
}
console.log('script start');
setTimeout(function () {
    console.log('setTimeout');
}, 0)
async1();
new Promise(function (resolve) {
    console.log('promise1');
    resolve();
    console.log('promise2')
}).then(function () {
    console.log('promise3');
});
console.log('script end');
```
-   了解过vue3吗?
-   webscoket的连接原理
-   react生命周期
-   redux原理
-   vue 父子组件的通信方式
-   async await的原理是什么?
-   async/await, generator, promise这三者的关联和区别是什么?
-   虚拟列表怎么实现?
-   做过哪些性能优化?
-   react和vue在技术层面的区别
-   常用的hook都有哪些?
-   用hook都遇到过哪些坑?
-   了解useReducer吗
-   组件外侧let a 1 组件内侧点击事件更改a，渲染的a会发生改变吗？如果let a放在组件内部，有什么变化吗？和useState有什么区别？
-   了解过vue3吗?
-   Node是怎么部署的? pm2守护进程的原理?
-   Node开启子进程的方法有哪些?
-   进程间如何通信?
-   css 三列等宽布局如何实现? flex 1是代表什么意思？分别有哪些属性?
-   前端安全都了解哪些? xss csrf
    -   csp是为了解决什么问题的?
    -   https是如何安全通信的?
-   前端性能优化做了哪些工作?
-   js中的闭包
-   解决过的一些线上问题
-   线上监控 对于 crashed (崩溃) 这种怎么监控? 对于内存持续增长，比如用了15分钟之后才会出现问题怎么监控
-   对于linux熟吗? top命令的属性大概聊一下?
-   301 302 304的区别
-   输出什么? 为什么?
```js
var b = 10;
(function b(){
    b = 20;
    console.log(b);
})();
// 输出函数b
// 出自https://github.com/getify/You-Dont-Know-JS/issues/223
// 规定自执行函数在执行时其函数名具备不可变性质，无法被覆盖，其值永远指向该函数
```
 -   代码输出顺序题
```js
async function async1() {
  console.log('1');
  await async2();
  console.log('2');
}
 
async function async2() {
  console.log('3');
}
 
console.log('4');
 
setTimeout(function() {
    console.log('5');
}, 0);  
 
async1();
 
new Promise(function(resolve) {
    console.log('6');
    resolve();
  }).then(function() {
    console.log('7');
});
 
console.log('8'); 
```
  -   async await的原理是什么?
-   async/await, generator, promise这三者的关联和区别是什么?
-   BFC是什么? 哪些属性可以构成一个BFC呢?
-   postion属性大概讲一下, static是什么表现? static在文档流里吗?
-   Webpack的原理, plugin loader 热更新等等
-   Set和Map
-   vue的keep-alive原理以及生命周期
-   vuex
-   浏览器从输入url开始发生了什么
-   react生命周期
-   redux的原理
-   vue 父子组件的通信方式
-   vue的双向绑定原理
-   对vue3的了解? vue3是怎么做的双向绑定?
-   node.js如何调试
-   charles map local (当地) /map remote (远程)
-   chrome devtool 如何查看内存情况
-   koa洋葱模型
-   中间件的异常处理是怎么做的？
-   在没有async await 的时候, koa是怎么实现的洋葱模型?
-   body-parser 中间件了解过吗
-   如果浏览器端用 post (后) 接口上传图片和一些其他字段, header里会有什么? koa里如果不用body-parser，应该怎么解析?
-   webscoket的连接原理
-   https是如何保证安全的? 是如何保证不被中间人攻击的?
-   你觉得js里this的设计怎么样? 有没有什么缺点啥的
-   vue的响应式开发比命令式有什么好处
-   装饰器
-   vuex
-   generator 是如何做到中断和恢复的
-   function 和 箭头函数的定义有什么区别? 导致了在this指向这块表现不同
-   导致js里this指向混乱的原因是什么?
-   浏览器的事件循环
-   宏任务和微任务的区分是为了做什么? 优先级?
-   小程序的架构? 双线程分别做的什么事情?
-   为什么小程序里拿不到dom相关的api
-   代码输出题
```js
console.log(typeof typeof typeof null); 
console.log(typeof console.log(1));
```
-   this指向题
```js
var name = '123';

var obj = {
	name: '456',
	print: function() {
		function a() {
			console.log(this.name);
		}
		a();
	}
}

obj.print();
```
-   Promise then 第二个参数和catch的区别是什么?
-   Promise finally 怎么实现的
-   作用域链
-   Electron架构
-   微前端
-   webpack5 模块联邦
-   Webworker
-   Symbol 
-   useRef / ref / forwardsRef 的区别是什么?
-   useEffect的第二个参数, 传空数组和传依赖数组有什么区别?
    -   如果return 了一个函数, 传空数组的话是在什么时候执行? 传依赖数组的时候是在什么时候执行?
-   flex布局
-   ES5继承
-   ES6继承, 静态方法/属性和实例方法/属性 是什么时候挂载的
-   Promise各种api
-   各种css属性
-   各种缓存的优先级, memory disk (磁盘) http2 push?
-   小程序为什么会有两个线程? 怎么设计?
-   xss? 如何防范?
-   日志 如果大量日志堆在内存里怎么办?
-   错误捕捉
-   前端稳定性监控
-   前端内存处理
-   普通函数和箭头函数的this指向问题
```js
const obj = {
	fn1: () => console.log(this),
	fn2: function() {console.log(this)}
}

obj.fn1();
obj.fn2();

const x = new obj.fn1();
const y = new obj.fn2();
```
-   promise相关的特性
-   vue父子组件, 生命周期执行顺序 created mounted
-   vue3添加了哪些新特性?
-   xss 的特点以及如何防范?
-   Http 2.0和http3.0对比之前的版本, 分别做了哪些改进?
-   HTTP 3.0基于udp的话, 如何保证可靠的传输?
-   TCP和UDP最大的区别是什么?
-   CSP除了能防止加载外域脚本, 还能做什么?
-   typescript is这个关键字是做什么呢?
-   前端安全 xss之类的
-   Https中间人攻击
-   前端History路由配置 nginx
-   截图怎么实现
-   qps达到峰值了，怎么去优化
-   谷歌图片, 如果要实现一个类似的系统或者页面, 你会怎么做?
-   最小的k个数
-   节流防抖
-   sleep函数
-   js超过Number最大值的数怎么处理?
-   64个运动员, 8个跑道, 如果要选出前四名, 至少跑几次?
-   前端路由 a -> b -> c这样前进, 也可以返回 c -> b -> a, 用什么数据结构来存比较高效
-   node 服务治理

  

