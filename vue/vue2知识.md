# vue2基础知识

整理一下 vue2 会用到的相关知识

## mapState

mapState 函数的可以接受一个对象 Object<string | function>。对象中可以包含字符串或函数。mapState 函数的返回结果是一个对象

```js
computed: {
    ...mapState({
        count: 'count', // string，映射 this.count 到 store.state.count
        name: state => state.name, // 箭头函数，映射 this.name 到 store.state.name
        nameAlias: 'name', // string，映射 this.name 到 store.state.name
        countplustempcount: function(state) {
            // 通过使用普通函数正确获取 this 即当前 vue 实例，箭头函数内使用 this 指向不对 
            return this.tempcount + state.count
        },
        countplustempcount2(state){
            // 作用同上
            return this.tempcount + state.count
        }
    }),
    ...mapState(['address', 'books']) // 映射的计算属性名同 state 中节点名时 
}
```

其返回值可以理解为：

```js
computed: {
    count(state) {
        return this.$store.state.count
    },
    name(state) {
        return this.$store.state.name
    },
    nameAlias(state) {
        return this.$store.state.name
    },
    countplustempcount(state) {
        return this.tempcount + this.$store.state.count
    },
    countplustempcount2(state) {
        return this.tempcount + this.$store.state.count
    },
    address(state) {
        return this.$store.state.address
    },
    books(state) {
        return this.$store.state.books
    },
}
```

## mapGetters

mapGetters将 store 中的getter 映射到局部计算属性中

```js
computed: {
    ...mapGetters(['getCount', 'getAddress']), // 数组形式
    ...mapGetters({
        getCount: 'getCount' // 对象形式
    }),
    ...mapGetters({
        getCountplus: 'getCount' // 重命名
    }),
    ...mapGetters('user', ['getUserCount', 'getUserAddress']), // 获取节点 store 的 getter，数组形式
    ...mapGetters('user', {
        getUserCount: 'getUserCount' // 对象形式
    }),
    ...mapGetters('user', {
        getUserCountplus: 'getUserCount' // 重命名
    })
}
```

mapGetters其返回值可以理解为：

```js
computed: {
    getCount() {
        this.$store.getters.getCount
    },
    getCountplus(){
        this.$store.getters.getCount
    },
    getUserCount(){
        this.$store.getters['user/getUserCount']
    },
    getUserCountplus(){
        this.$store.getters['user/getUserCount']
    }
}
```
