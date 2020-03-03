# padding

> padding 属性设置一个元素的内边距，padding 区域指一个元素的内容和其边界之间的空间，该属性不能为负值。

该属性可以设置两种智

- 带单位的固定值，比如 10px
- 百分比值，比如 10%

其中固定值设置为多少，内边距就是多少；但如果设置为百分数，则会按照父级元素的宽度来取值，比如父级元素宽度为 100px，子级元素设置 padding 为 10%，则该值会被计算为 10px，但是在父级设置为 display:grid 并且有指明 grid-template-columns 属性的值的时候，padding 就会根据 grid-template-columns 计算出的值来按照百分数取值，同样举例父级宽度为 100px，grid-template-columns 的值为 25%，自己 padding 为 10%，则计算出来的 padding 为 100px*0.25*0.1=2.5px，margin 同理
