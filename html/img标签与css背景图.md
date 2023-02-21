常用呈现图片的方式：

- `<img>`标签
- css背景图
- SVG`<image>`

## `<img>`

对于`<img>`必须含有src属性

```html
<img src="pic.png" alt="" width="100" height="100" />
```

### alt-可访问性

通过alt来设置图像描述，提升屏幕阅读器的体验，不要去掉该属性，在图像加载失败时，可以告诉用户图像是什么

该可以通过伪元素来替换显示的默认替代文本，方法是将伪元素放置在默认文本的顶部，将其隐藏起来

```css
img:after {   
  content: "伪元素呈现：：" attr(alt);  
  font-size: 16px;  
  color: rgb(100, 100, 100);  
  display: block;  
  position: absolute;  
  z-index: 1;  
  top: 0;  
  left: 0;  
  width: 100%;  
  height: 100%;  
  background-color: #fff;  
}
```

### img-可替换元素

可以通过css的`display:none`来隐藏标签元素，但是img被标识为可替换元素，所以img中的图像依旧会加载

在 CSS 中，可替换元素的展现效果不是由 CSS 来控制的。这些元素是一种外部对象，它们外观的渲染，是独立于 CSS 的。简单来说，它们的内容不受当前文档的样式的影响。CSS 可以影响可替换元素的位置，但不会影响到可替换元素自身的内容。某些可替换元素，例如 `<iframe>` 元素，可能具有自己的样式表，但它们不会继承父文档的样式

### 响应式

根据视口展现不同尺寸的图片：

1. srcset属性

```html
<img src="small.jpg" srcset="medium.jpg 500w, large.jpg 800w" alt="">
```

srcset 并不是根据屏幕宽度显示多个图像尺寸的完美解决方案。浏览器会选择合适的图像，我们无法控制

2. picture元素

```html
<picture>  
  <source srcset="large.jpg" media="(min-width: 800px)" />  
  <source srcset="medium.jpg" media="(min-width: 500px)" />  
  <img src="small.jpg" />  
</picture>
```

### 图像大小

可以直接通过width和height属性设置图像的大小（利用css设置也行），如果提前设置了图像的大小，在图像加载出来之前，图像需要占据的空间会优先保留，而不是在图像加载出来后再撑开布局（未设置width和height时）

配合css中的object-fit 和 object-position可以调整图像的大小和位置

> **`object-fit`** [CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS) 属性指定[可替换元素](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Replaced_element)（例如：[`<img>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img) 或 [`<video>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/video)）的内容应该如何适应到其使用高度和宽度确定的框
> **`object-fit`** 的可能值为：fill、contain、cover、none、scale-down

> **`object-position`** 规定了[可替换元素](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Replaced_element)的内容，在这里我们称其为对象（即 **`object-position`** 中的 **`object`）**，在其内容框中的位置。可替换元素的内容框中未被对象所覆盖的部分，则会显示该元素的背景（[`background`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background)）
>  **`object-position`** 的可能值为：使用 1 到 4 个值来定义该元素在它所处的二维平面中的定位。可以使用相对或绝对偏移

```css
img {  
  object-fit: cover;  
  object-position: 50% 50%;  
}
```

## css背景图

使用css对一个html标签元素设置背景图

```css
.element {  
  background: url('pic.jpg');  
}
```
<div class="element">content</div>

相较于img可以设置多个背景图

```css
.element {  
  background: url('pic.jpg') url('pic1.png');  
}
```

而且，对css设置隐藏`display:none`时，是不会加载图像的，仅显示时会加载图像

`background`设置的背景图无法通过右击下载，必须进入控制台通过链接访问，而img是可以直接右击下载图像的

### svg`<image>`

SVG 最大的优势是在不影响质量的情况下进行缩放。此外，借助 SVG，可以嵌入 JPG、PNG 或 SVG 图像

```html
<svg width="200" height="200">  
  <image href="pic.png" height="100%" width="100%" preserveAspectRatio="xMidYMid slice" />  
</svg>
```

svg通过`title`标签和`desc`标签提升自身的可访问性

```html
<svg width="200" height="200">
  <title>图片描述</title>
  <desc>图片描述</desc>
  <image href="pic.png" height="100%" width="100%" preserveAspectRatio="xMidYMid slice" />  
</svg>
```

同css背景图一样，无法进行右击下载

## 使用场景

针对三种展示图片的方式，分别用于何种场景

### 通过接口获取的可变的图

图片本身需要变化，则尽量使用img呈现，用css背景图也可以，则需要使用变量来变化，或者使用行间样式来进行控制

### logo

#### 静态logo

对于网站的 Logo，当一有很多细节或形状时，将其用作内联 SVG 可能不太好。建议使用`＜img＞`，图像文件类型可以是`png`、`jpg`或`svg`

```html
<a href="#"><img src="logo.svg" alt="Nature Food"></a>
```

#### 动态logo

带动画的简单logo，比如图像+文字的组合，建议使用内联svg

```html
<a href="#">  
    <svg class="logo" width="115" height="47" xmlns="http://www.w3.org/2000/svg">  
      <g transform="translate(-5 -5)" fill="none" fill-rule="evenodd">  
        <rect fill="#D8D8D8" transform="rotate(45 28.5 28.5)" x="9" y="9" width="39" height="39" rx="11" />  
        <text font-family="Rubik-Medium, Rubik" font-size="25" font-weight="400" fill="#6F6F6F">  
          <tspan x="63.923" y="36.923">Rect</tspan>  
        </text>  
      </g>  
    </svg>  
</a>
```

```css
.logo rect,  
.logo text {  
  transition: 0.3s ease-out;  
}  
  
.logo:hover rect,  
.logo:hover text {  
  fill: #4a7def;  
}
```

#### 响应式logo

所谓的响应式 Logo 就是在不同视口下，显示的 Logo 不一样

建议使用picture元素，可以针对不同视口，展示不同的图像

#### 渐变logo

建议svg

### 页面打印

如果用户需要打印页面，需要避免将图像作为CSS的背景，因为背景图不会被打印，而会显示一个空白区域

不过，我们可以通过强制浏览器显示图像来解决这个问题（不适用于 Firefox 和 IE）

```css
.element {  
    background: url('cheesecake.png') center/cover no-repeat;  
    -webkit-print-color-adjust: exact;  
}
```

对于这种情况，使用 HTML `<img>` 标签会更安全，因为它可以完美地打印出来