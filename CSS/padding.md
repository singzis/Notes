# padding

> padding属性设置一个元素的内边距，padding 区域指一个元素的内容和其边界之间的空间，该属性不能为负值。

该属性可以设置两种智

+ 带单位的固定值，比如 10px
+ 百分比值，比如10%

其中固定值设置为多少，内边距就是多少；但如果设置为百分数，则会按照父级元素的宽度来取值，比如父级元素宽度为100px，子级元素设置padding为10%，则该值会被计算为10px，但是在父级设置为display:grid并且有指明grid-template-columns属性的值的时候，padding就会根据grid-template-columns计算出的值来按照百分数取值，同样举例父级宽度为100px，grid-template-columns的值为25%，自己padding为10%，则计算出来的padding为100px*0.25*0.1=2.5px，margin同理
