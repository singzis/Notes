# background-position知识总结

> 为背景图片设置初始位置，由背景图片的原点相对于容器原点进行位置偏移

该属性可以接受多种类型的值：

- 长度单位值 px、em 等
- 特殊字段值：top、right、bottom 和 left 以及 center
- 百分比值（相对于容器的宽高）

该属性可以接收一组值：

当只有两个值的时候：

- 关键字 top, left, bottom, right 中的一个。 如果这里给出 left 或 right，那么这个值定义 x 轴位置，另一个值定义 y 轴位置。如果这里给出 top 或 bottom，那么这个值定义 y 轴位置，另一个值定义 x 轴位置。两个值，以表示相对于容器愿坐标对于 x 轴和 y 轴的位移：
- 非关键字，即 px 或者百分比等，则按照 background-position：x,y 的规矩来，依次表示背景图原点在 x 轴和 y 轴的位移

当只有一个值的时候：

- 此值为 top 或者 bottom 字段值，则表示相对于定义的是 y 轴的位置，如果是 left 或者 right，则定义的是 x 轴的位置，center 表示居中；其实此处默认给了另一个值为 center，也相当于两个值。

接收四个值：
形如 background-position：bottom 10px right 20px;
此处没做验证，但根据 MDN 的例子来看，第一个表示 bottom 属性值，而第二个可以理解为距离多少到达 bottom 还有 10px 距离，第三个表示 right 属性值，第四个则表示距离到达 right 还有 20px 的距离

在其中，你会发现一个问题，就是当取 center 时和取 50%时，达到的效果会一样，都是居中，为什么呢？

上面所有属性值，均表示背景图原点相对于容器原点的位置的偏移，但是只有`百分比`属性值，会造成背景图像原点自身的位置发生偏移。

例如 background-position：20%；

直观来看应该是图像原点在 x 轴上偏移容器宽度 20%的距离，y 轴上采用 center（50%）居中

但其实，在图像发生偏移之前，图像自身的原点会先做一次偏移，这次偏移是相对于自身宽高进行偏移，而后再相对于容器进行偏移，大概就是

> 如果是 14% 84%的这个值，那么就以图片的 14% 84%的坐标点，放置在容器的 14% 84%的位置

这就不难理解为什么 50%和 center 的效果相同了，因为原点在 x 或者 y 上都相对于自身发生了 50%的偏移，到达了自身的 x 轴或者 y 轴的中心，而之后再发生相对于容器的偏移，故图片原点刚好在容器某一轴的中心处

当然这一切只是在只有 background-position 这一个属性的基础上，如果结合其他一些属性，比如 background-size 或者 background-origin 等，又会有怎样的变化呢。其实，以上这些属性或多或少只会导致图像的宽高发生变化，并不会影响 background-position 的计算方式

[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-position)

[参考](http://linxz.github.io/blog/css%E5%B1%9E%E6%80%A7%E5%9F%BA%E7%A1%80/2015/09/talk-about-background-position-values.html)
