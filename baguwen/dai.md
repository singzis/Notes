- 实现一个节流函数? 如果想要最后一次必须执行的话怎么实现?
- 实现一个批量请求函数, 能够限制并发量?
- 数组转树结构
```js
const arr = [{
        id: 2,
        name: '部门B',
        parentId: 0
    },
    {
        id: 3,
        name: '部门C',
        parentId: 1
    },
    {
        id: 1,
        name: '部门A',
        parentId: 2
    },
    {
        id: 4,
        name: '部门D',
        parentId: 1
    },
    {
        id: 5,
        name: '部门E',
        parentId: 2
    },
    {
        id: 6,
        name: '部门F',
        parentId: 3
    },
    {
        id: 7,
        name: '部门G',
        parentId: 2
    },
    {
        id: 8,
        name: '部门H',
        parentId: 4
    }
]
```
- 去除字符串中出现次数最少的字符，不改变原字符串的顺序。
```js
“ababac” —— “ababa”
“aaabbbcceeff” —— “aaabbb”
```
- 写出一个函数trans，将数字转换成汉语的输出，输入为不超过10000亿的数字。
```js
trans(123456) —— 十二万三千四百五十六
trans（100010001）—— 一亿零一万零一
```
- 给几个数组, 可以通过数值找到对应的数组名称
```js
// 比如这个函数输入一个1，那么要求函数返回A
const A = [1,2,3];
const B = [4,5,6];
const C = [7,8,9];

function test(num) {

}	
```
- 数组转树, 写完后问如果要在树中新增节点或者删除节点, 函数应该怎么扩展
```js
const arr = [{
        id: 2,
        name: '部门B',
        parentId: 0
    },
    {
        id: 3,
        name: '部门C',
        parentId: 1
    },
    {
        id: 1,
        name: '部门A',
        parentId: 2
    },
    {
        id: 4,
        name: '部门D',
        parentId: 1
    },
    {
        id: 5,
        name: '部门E',
        parentId: 2
    },
    {
        id: 6,
        name: '部门F',
        parentId: 3
    },
    {
        id: 7,
        name: '部门G',
        parentId: 2
    },
    {
        id: 8,
        name: '部门H',
        parentId: 4
    }
]
```
- 不定长二维数组的全排列
```js
// 输入 [['A', 'B', ...], [1, 2], ['a', 'b'], ...]

// 输出 ['A1a', 'A1b', ....]
```
- 两个字符串对比, 得出结论都做了什么操作, 比如插入或者删除
```js
pre = 'abcde123'
now = '1abc123'

a前面插入了1, c后面删除了de
```
- sleep函数
- 节流防抖
- ES5和ES6的继承? 这两种方式除了写法, 还有其他区别吗?
- EventEmitter
- 使用Promise实现一个异步流量控制的函数, 比如一共10个请求, 每个请求的快慢不同, 最多同时3个请求发出, 快的一个请求返回后, 就从剩下的7个请求里再找一个放进请求池里, 如此循环。
- 给一个字符串, 找到第一个不重复的字符
```js
ababcbdsa abcdefg
// -   时间复杂度是多少?
//-   除了给的两个用例, 还能想到什么用例来测试一下?
```
- 实现 compose (撰写) 函数, 类似于koa的中间件洋葱模型
```js
// 题目需求

let middleware = []
middleware.push((next) => {
    console.log(1)
    next()
    console.log(1.1)
})
middleware.push((next) => {
    console.log(2)
    next()
    console.log(2.1)
})
middleware.push((next) => {
    console.log(3)
    next()
    console.log(3.1)
})

let fn = compose(middleware)
fn()


/*
1
2
3
3.1
2.1
1.1
*/

//实现compose函数
function compose(middlewares) {
    
}
```
- 遇到退格字符就删除前面的字符, 遇到两个退格就删除两个字符
```js
// 比较含有退格的字符串，"<-"代表退格键，"<"和"-"均为正常字符
// 输入："a<-b<-", "c<-d<-"，结果：true，解释：都为""
// 输入："<-<-ab<-", "<-<-<-<-a"，结果：true，解释：都为"a"
// 输入："<-<ab<-c", "<<-<a<-<-c"，结果：false，解释："<ac" !== "c"

function fn(str1, str2) {
    
}
```
- 实现一个函数, 可以间隔输出
```js
function createRepeat(fn, repeat, interval) {}

const fn = createRepeat(console.log, 3, 4);

fn('helloWorld'); // 每4秒输出一次helloWorld, 输出3次
```
- 删除链表的一个节点
```js
function (head, node) {}
```
- 实现LRU算法
```js
class LRU {
	get(key) {
	}

	set(key, value) {
	}
}
```
- 深拷贝
```js
const deepClone = (obj, m) => {

};

// 需要手写一个深拷贝函数deepClone，输入可以是任意JS数据类型
```
- 二叉树光照，输出能被光照到的节点, dfs能否解决?
```js
输入: [1,2,3,null,5,null,4]
输出: [1,3,4]

输入: []
输出: []

/**
 * @param {TreeNode} root
 * @return {number[]}
 */
function exposedElement(root) {
    
};
```
![[CleanShot 2022-12-05 at 23.19.10@2x.png]]
- 输出顺序题
```js
setTimeout(function () {
  console.log(1);
}, 100);

new Promise(function (resolve) {
  console.log(2);
  resolve();
  console.log(3);
}).then(function () {
  console.log(4);
  new Promise((resove, reject) => {
    console.log(5);
    setTimeout(() =>  {
      console.log(6);
    }, 10);
  })
});
console.log(7);
console.log(8);
```
- 作用域
```js
var a=3;
 function c(){
    alert(a);
 }
 (function(){
  var a=4;
  c();
 })();
```
- 输出题
```js
function Foo(){
    Foo.a = function(){
        console.log(1);
    }
    this.a = function(){
        console.log(2)
    }
}

Foo.prototype.a = function(){
    console.log(3);
}

Foo.a = function(){
    console.log(4);
}

Foo.a();
let obj = new Foo();
obj.a();
Foo.a();
```
- 好多请求, 耗时不同, 按照顺序输出, 尽可能保证快, 写一个函数.
```js
const promiseList = [
	new Promise((resolve) => {
		setTimeout(resolve, 1000)
	}),
	new Promise((resolve) => {
		setTimeout(resolve, 1000)
	}),
	new Promise((resolve) => {
		setTimeout(resolve, 1000)
	})
]

fn(promiseList);
```
- 一个数组的全排列
```js
输入一个数组 arr = [1,2,3]
输出全排列

[[1], [2], [3], [1, 2], [1, 3], ...., [1,2,3], [1,2,4] ....]
```
- 多叉树, 获取每一层的节点之和
```js
function layerSum(root) {
    
}

const res = layerSum({
    value: 2,
    children: [
        { value: 6, children: [ { value: 1 } ] },
        { value: 3, children: [ { value: 2 }, { value: 3 }, { value: 4 } ] },
        { value: 5, children: [ { value: 7 }, { value: 8 } ] }
    ]
});

console.log(res);
```
- 虚拟dom转真实dom
```js
const vnode = {
    tag: 'DIV',
    attrs: {
        id: 'app'
    },
    children: [{
            tag: 'SPAN',
            children: [{
                tag: 'A',
                children: []
            }]
        },
        {
            tag: 'SPAN',
            children: [{
                    tag: 'A',
                    children: []
                },
                {
                    tag: 'A',
                    children: []
                }
            ]
        }
    ]
}

function render(vnode) {

}
```
- 有序数组原地去重
- 二叉树层序遍历, 每层的节点放到一个数组里
```js
给定一个二叉树，返回该二叉树层序遍历的结果，（从左到右，一层一层地遍历）
例如：
给定的二叉树是{3,9,20,#,#,15,7},
该二叉树层序遍历的结果是 [ [3], [9,20], [15,7]
]
```
- 实现一个函数, fetchWithRetry 会自动重试3次，任意一次成功直接返回
- 链表中环的入口节点
```js
对于一个给定的链表，返回环的入口节点，如果没有环，返回null
```
- 多叉树指定层节点的个数
- 叠词的数量
```js
Input: 'abcdaaabbccccdddefgaaa'
Output: 4

1. 输出叠词的数量
2. 输出去重叠词的数量
3. 用正则实现
```