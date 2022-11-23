# CSS — BEM 命名规范

## 什么是 BEM 命名规范

- Bem 是块（block）、元素（element）、修饰符（modifier）的简写，由 Yandex 团队提出的一种前端 CSS 命名方法论。

>  \-  中划线 ：仅作为连字符使用，表示某个块或者某个子元素的多单词之间的连接记号。 
>
>  __  双下划线：双下划线用来连接块和块的子元素 
>
>  _   单下划线：单下划线用来描述一个块或者块的子元素的一种状态 

- BEM 是一个简单又非常有用的命名约定。让你的前端代码更容易阅读和理解，更容易协作，更容易控制，更加健壮和明确，而且更加严密。

### BEM 命名模式

BEM 命名约定的模式是：

```css
.block {}

.block__element {}

.block--modifier {}
```

- 每一个块(block)名应该有一个命名空间（前缀） 
  - `block` 代表了更高级别的抽象或组件。
  - `block__element` 代表 .block 的后代，用于形成一个完整的 .block 的整体。
  - `block--modifier` 代表 .block 的不同状态或不同版本。

使用两个连字符和下划线而不是一个，是为了让你自己的块可以用单个连字符来界定。如：

```css
.sub-block__element {}

.sub-block--modifier {}
```

### BEM 命名法的好处

BEM的关键是，可以获得更多的描述和更加清晰的结构，从其名字可以知道某个标记的含义。于是，通过查看 HTML 代码中的 class 属性，就能知道元素之间的关联。

常规的命名法示例：

```html
<div class="article">
    <div class="body">
        <button class="button-primary"><button>
        <button class="button-success"><button>
    </div>
</div>
```

- 这种写法从 DOM 结构和类命名上可以了解每个元素的意义，但无法明确其真实的层级关系。在 css 定义时，也必须依靠层级选择器来限定约束作用域，以避免跨组件的样式污染。

使用了 BEM 命名方法的示例：

```html
<div class="article">
    <div class="article__body">
      <div class="tag"></div>
      <button class="article__button--primary"></button>
      <button class="article__button--success"></button>
    </div>
</div>
```

- 通过 BEM 命名方式，模块层级关系简单清晰，而且 css 书写上也不必作过多的层级选择。

## 如何使用 BEM 命名法

### 什么时候应该用 BEM 格式

-  使用 BEM 的诀窍是，你要知道什么时候哪些东西是应该写成 BEM 格式的。 
-  并不是每个地方都应该使用 BEM 命名方式。当需要明确关联性的模块关系时，应当使用 BEM 格式。 
-  比如只是一条公共的单独的样式，就没有使用 BEM 格式的意义： 

```css
.hide {
    display: none !important;
}
```

### 在 CSS 预处理器中使用 BEM 格式

- BEM 的一个槽点是，命名方式长而难看，书写不雅。相比 BEM 格式带来的便利来说，我们应客观看待。 
-  而且，一般来说会使用通过 LESS/SASS 等预处理器语言来编写 CSS，利用其语言特性书写起来要简单很多。 

>  以 LESS 为例： 

```css
.article {
    max-width: 1200px;
    &__body {
        padding: 20px;
    }
    &__button {
        padding: 5px 8px;
        &--primary {background: blue;}
        &--success {background: green;}
    }
}
```

### 在流行框架的组件中使用 BEM 格式

-  在当前流行的 `Vue.js` / `React` / `Angular` 等前端框架中，都有 CSS 组件级作用域的编译实现，其基本原理均为利用 CSS 属性选择器特性，为不同的组件生成不同的属性选择器。 
-  当你选择了这种局部作用域的写法时，在较小的组件中，BEM 格式可能显得没那么重要。但对于公共的、全局性的模块样式定义，还是推荐使用 BEM 格式。 
-  另外，对于对外发布的公共组件来说，一般为了风格的可定制性，都不会使用这种局部作用域方式来定义组件样式。此时使用 BEM 格式也会大显其彩。

### 避免 .block__el1__el2 的格式

- 在深层次嵌套的 DOM
- 结构下，应避免过长的样式名称定义。
- 层级最后不要超过 4 级，不然增加阅读的理解难度

## 总结

- BEM 最难的部分之一是明确作用域是从哪开始和到哪结束的，以及什么时候使用或不使用它。随着不断使用的经验积累，你慢慢就会知道怎么用，这些问题也不再是问题。技术无好坏，合适方最好。

## 推荐写法和风格

```html
<style>
  .form { }
	.form--theme-xmas { }
	.form--simple { }
	.form__input { }
	.form__submit { }
	.form__submit--disabled { }
</style>

//对应的HTML结构如下：
<div class="form form--theme-xmas form--simple">
  <input class="form__input" type="text" />
  <input
    class="form__submit form__submit--disabled"
    type="submit"
   />
</div>
```

## 参考

- [⒛ [规范] CSS BEM 书写规范](https://github.com/Tencent/tmt-workflow/wiki/%E2%92%9B-%5B%E8%A7%84%E8%8C%83%5D--CSS-BEM-%E4%B9%A6%E5%86%99%E8%A7%84%E8%8C%83)
- [getbem](https://getbem.com/)

