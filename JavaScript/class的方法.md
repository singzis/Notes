# class 的公有方法和私有方法

## 公有方法分(static)静态公有方法和公有实例方法

静态公有方法和实例公有方法都是可编辑的，不可遍历的，可配置的。它们是类在构造时通过`Object.defineProperty`添加到类上的，因为类的本质就是基于原型链的语法糖，所以它们参与原型的继承（公有属性的规则同方法，但是属性是可遍历的）。

### static 静态公有方法

> 类 class 可以通过 static 关键字创建静态方法，且该方法只适用于类本身和类的子类，类构造的实例是无法获得该方法。

创建一个拥有静态方法的类：

```js
class Person {
  static eat() {
    return "开始了吃的行为";
  }
}

class Jack extends Person {}
const Tom = new Person();

Person.eat(); // 开始了吃的行为
Jack.eat(); //  开始了吃的行为
Tom.eat(); // TypeError: Tom.eat is not a function
```

同一个类中的静态方法可以通过 this 关键字互相调用：

```js
class Person {
  static eat() {
    return "开始了吃的行为";
  }
  static sleep() {
    const r = this.eat();
    return `${r}，吃完就睡`;
  }
}

Person.eat(); //开始了吃的行为
Person.sleep(); //开始了吃的行为，吃完就睡
```

但是同一个类中的非静态方法，想要调用静态方法的话，就需要通过`类名.方法`或者`this.constructor.方法`的方式来调用：

```js
class Person {
  constructor() {
    const r_eat = Person.eat();
    const r_sleep = this.constructor.sleep();
    console.log(r_eat); //开始了吃的行为
    console.log(r_sleep); //开始了吃的行为，吃完就睡
  }
  static eat() {
    return "开始了吃的行为";
  }
  static sleep() {
    const r = this.eat();
    return `${r}，吃完就睡`;
  }
}
new Person();
```

子类在继承父类的静态方法时，可以通过`static 相同类名`的方式复写父类的静态方法：

```js
class Person {
  static eat() {
    return "开始了吃的行为";
  }
}

class Jack extends Person {
  static eat() {
    return "多吃有营养的食物";
  }
}
Person.eat(); //开始了吃的行为
Jack.eat(); // 多吃有营养的食物
```

### 公有实例方法

类中定义的实例方法可以在创建的实例中使用：

```js
class Person {
  eat() {
    return "开始了吃的行为";
  }
}

const Tom = new Person();
Tom.eat(); // 开始了吃的行为
```

## 私有方法分为静态私有方法和私有实例方法

静态私有方法和私有实例方法是类在构造时添加到类上的。

### static 静态私有方法

静态私有方法仅能在类中的静态方法中，通过`类名.静态私有方法`或者`this.constructor.方法`被访问：

```js
class Person {
  static #eatText() {
    return "开始了吃的行为";
  }
  static eat() {
    return Person.#eatText();
  }
}
Person.eat(); // 开始了吃的行为
```

### 私有实例方法

私有实例方法仅可以通过公有方法，以`私有实例方法`的形式被实例调用，或者在构造函数中使用`this`来访问：

```js
class Person {
  #eatText() {
    return "开始了吃的行为";
  }
  constructor() {
    this.#eatText(); // 开始了吃的行为
  }
  eat() {
    return Person.#eatText();
  }
}
const Tom = new Person();
Tom.eat(); // 开始了吃的行为
```
