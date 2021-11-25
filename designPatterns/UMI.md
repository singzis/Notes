# UMI

![类关系图](https://raw.githubusercontent.com/singzis/Notes/master/images/umi1.png)

- 依赖:对类 B 进行修改会影响到类 A
- 关联:对象 A 知道对象 B。类 A 依赖于类 B
- 聚合:对象 A 知道对象 B 且由 B 构成。类 A 依赖于类 B
- 组合:对象 A 知道对象 B、由 B 构成而且管理着 B 的生命周 期。类 A 依赖于类 B
- 实现: 类 A 定义的方法由接口 B 声明。 对象 A 可被视为对象 B。类 A 依赖于类 B
- 继承: 类 A 继承类 B 的接口和实现， 但是可以对其进行扩 展。对象 A 可被视为对象 B。类 A 依赖于类 B
