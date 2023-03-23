```js
// 保存原始XMLHttpRequest对象
var realXHR = window.XMLHttpRequest;

// 重写XMLHttpRequest对象
function MyXHR() {
  var xhr = new realXHR();

  // 重写open方法，用于拦截请求
  var realOpen = xhr.open;
  xhr.open = function(method, url, async) {
    console.log("拦截请求:", method, url, async);

    // 调用原始open方法
    realOpen.apply(this, arguments);

    // 重写send方法，用于获取请求参数
    var realSend = this.send;
    this.send = function(body) {
      console.log("请求参数:", body);

      // 调用原始send方法
      realSend.apply(this, arguments);
    };
  };

  return xhr;
}

// 替换原始XMLHttpRequest对象
window.XMLHttpRequest = MyXHR;
```