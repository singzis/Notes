一个简易版的webpack构建原理，主要是用于理解webpack构建过程

## 基本步骤

1. 构建，读取配置参数（webpack.config.js）
2. 用配置参数初始化`Compiler`对象
3. 挂载参数配置中的所有插件（plugins）
4. 执行`Compiler.run`，开始编译
	每次编译会生成一个`Compilation`对象，代表每次编译的结果
5. 通过entry找到入口文件
6. 通过loader对入口文件编译，生成浏览器认识的js或json文本
	1. 读取入口文件源码
	2. 创建入口文件module
	3. 找到适配的loader，从右向左对module进行编译
7. 对入口模块依赖的模块进行编译
	1. 生成AST
		AST，抽象语法树，一种中间表示，用于表示源码结构。在webpack中，一般使用babel将源码转换成AST，然后对AST处理，最后又转换为源码
	2. 在AST中找require语句，获得依赖模块的地址和名称
	3. 对依赖模块进行编译，即重复第6步
8. 所有模块编译完成后，根据入口文件名称，组装chunk
	在不考虑代码分割的情况下，一个入口文件对应一个chunk
9. 把chunk转换成文件
10. 把文件写入到output指定的地址中

## 基础代码

手写的基础版webpack代码，功能一般

```js
// webpack.js
const { SyncHook } = require('tapable') //这是一个同步钩子
const path = require('path')
const fs = require('fs')
const parser = require('@babel/parser')
const types = require('@babel/types')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default

function toUnixPath(filePath) {
  return filePath.replace(/\\/g, '/')
}

const baseDir = toUnixPath(process.cwd()) //获取工作目录，在哪里执行命令就获取哪里的目录，这里获取的也是跟操作系统有关系，要替换成/

// 获取文件路径
function tryExtensions(modulePath, extensions) {
  if (fs.existsSync(modulePath)) {
    return modulePath
  }
  for (let i = 0; i < extensions.length; i++) {
    const filePath = modulePath + extensions[i]
    if (fs.existsSync(filePath)) {
      return filePath
    }
  }
  throw new Error(`无法找到${modulePath}`)
}

// 生成运行时代码
function getSource(chunk) {
  const o = chunk.modules.map(
    module => `
            "${module.id}": (module) => {
              ${module._source}
            }
          `
  )
  return `
    (() => {
      var modules = {
        ${o}
      }
      var cache = {}
      function require(moduleId) {
        var cacheModule= cache(moduleId)
        if(cacheModule !== undefined) {
          return cacheModule.exports
        }
        var module = (cache[moduleId] = {
          exports: {}
        })
        modules[moduleId](module, module.exports, require)
        return module.exports
      }
      var exports = {}
      ${chunk.entryModule._source}
    })()
  `
}

class Compilation {
  constructor(options) {
    this.options = options
    this.modules = [] // 本次编译所有生成出来的模块
    this.chunks = [] // 本次编译产出的所有代码块，入口模块和依赖的模块打包在一起为代码块
    this.assets = [] // 本次编译产出的资源文件
    this.fileDependencies = [] // 本次打包涉及到的文件，这里主要是为了实现watch模式下监听文件的变化，文件发生变化后会重新编译
  }

  // 编译模块
  // name：这个模块属于哪个代码块chunk的
  // modulePath：模块绝对路径
  buildModule(name, modulePath) {
    // 6.2.1 读取模块内容，获取源代码
    let sourceCode = fs.readFileSync(modulePath, 'utf8')
    // buildModule最终会返回一个模块对象，每个模块对象都会有一个id，id是相对于根目录的相对路径
    // 模块id，从根目录出发，找到与该模块的相对路径 ‘./src/index.js’
    const moduleId = '/' + path.posix.relative(baseDir, modulePath)
    // 6.2.2 创建模块对象
    const module = {
      id: moduleId,
      _source: '', // 该模块的代码信息
      dependencies: [], // 依赖的模块
      names: [name], // names设计成数组是因为代表的是此模块属于哪个代码块，可能属于多个代码块
    }

    const loaders = []
    const { rules } = this.options.module
    rules.forEach(rule => {
      const { test } = rule
      // 寻找当前模块适用的loader
      if (modulePath.match(test)) {
        loaders.push(...rule.use)
      }
    })

    // 从右向左对模块编译
    sourceCode = loaders.reduceRight((code, loader) => loader(code), sourceCode)

    // 通过loader翻译后的内容一定得是js，因为最后需要babel-parser，只有js才能编译成AST
    // 第7步，找出此模块依赖的模块，再对依赖的模块进行编译
    // 7.1 先把源代码编译成AST
    const ast = parser.parse(sourceCode, { sourceType: 'module' })
    traverse(ast, {
      CallExpression: nodePath => {
        const { node } = nodePath
        // 7.2 在AST中查找require语句，找出依赖的模块名称和绝对路径
        if (node.callee.name === 'require') {
          const depModuleName = node.arguments[0].value // 获取依赖的模块
          const dirName = path.posix.dirname(modulePath) // 获取当前正在编译的模块的目录
          let depModulePath = path.posix.join(dirName, depModuleName) // 获取依赖的模块的地址
          const extensions = this.options.resolve?.extensions || ['.js'] // 获取配置中的extensions
          depModulePath = tryExtensions(depModulePath, extensions) // 尝试添加后缀，找到一个真实在硬盘上存在的文件
          // 7.3 将依赖模块的绝对路径添加到this.fileDependencies
          this.fileDependencies.push(depModulePath)
          // 7.4 生成依赖模块的模块id
          const depModuleId = './' + path.posix.relative(baseDir, depModulePath)
          // 7.5 修改语法结构，把依赖的模块改为依赖模块id，`require('./name') => require('./name.js)`
          node.arguments = [types.stringLiteral(depModuleId)]
          // 7.6 将依赖模块的信息 push 到该模块的 `dependencies` 属性中
          module.dependencies.push({ depModuleId, depModulePath })
        }
      },
    })

    // 7.7 生成新代码，并把转译后的代码放入module._source
    const { code } = generator(ast)
    module._source = code

    // 7.8 对依赖模块进行编译，即对module.dependencies递归执行buildModule
    module.dependencies.forEach(({ depModuleId, depModulePath }) => {
      // 考虑到多入口，一个模块被多个模块引用，不需要重复build
      const existModule = this.modules.find(module => module.id === depModuleId)
      // 如果modules里已经存在这个将要编译的依赖模块了，就不需要编译了，直接把代码块的名称添加到对应模块的names即可
      if (existModule) {
        //names指的是它属于哪个代码块chunk
        existModule.names.push(name)
      } else {
        // 7.9 对依赖模块编译完成后得到依赖模块的module对象，加入到this.modules中
        const depModule = this.buildModule(name, depModulePath)
        this.modules.push(depModule)
      }
    })

    // 7.10 等待依赖模块全部编译完成后，返回该module对象
    return module
  }

  build(callback) {
    // 第5步，根据配置文件中的entry找到所有的入口
    let entry = {}
    if (typeof this.options.entry === 'string') {
      // 如果是单入口，配置成{main: ''}，做兼容
      entry.main = this.options.entry
    } else {
      entry = this.options.entry
    }

    // 第6步，从入口文件出发，调用配置的“loader”，对模块进行编译
    for (let entryName in entry) {
      // entryName="main" entryName就是entry的属性名，也将会成为代码块的名称
      // path.posix为了解决不同操作系统的路径分隔符,这里拿到的就是入口文件的绝对路径
      const entryFilePath = path.posix.join(baseDir, entry[entryName])
      // 6.1 把入口文件的绝对路径添加到“this.fileDependencies”，记录此次编译的模块
      this.fileDependencies.push(entryFilePath)
      // 6.2 得到入口的模块对象（模块路径、源代码、依赖模块）
      const entryModule = this.buildModule(entryName, entryFilePath)
      // 6.3 将生成的入口文件模块对象，加入到this.modules中
      this.modules.push(entryModule)

      // 第8步 等待所有模块编译完后，根据模块之间的依赖关系，组装代码块“chunk”
      // 一般来说，每个入口文件对应一个代码块“chunk”，每个代码块“chunk”里面放着本入口模块和它依赖的模块
      const chunk = {
        name: entryName,
        entryModule,
        modules: this.modules.filter(module =>
          module.names.includes(entryName)
        ),
      }
      this.chunks.push(chunk)
    }

    // 第9步 把各个chunk转换成一个个文件加入到输出列表
    this.chunks.forEach(chunk => {
      const filename = this.options.output.filename.replace(
        '[name]',
        chunk.name
      )
      this.assets[filename] = getSource(chunk)
    })

    // 编译成功执行callback
    callback(
      null,
      {
        chunks: this.chunks,
        modules: this.modules,
        assets: this.assets,
      },
      this.fileDependencies
    )
  }
}

class Compiler {
  constructor(webpackOptions) {
    this.options = webpackOptions
    this.hooks = {
      run: new SyncHook(),
      done: new SyncHook(),
    }
  }

  compile(callback) {
    //虽然webpack只有一个Compiler，但是每次编译都会产出一个新的Compilation，
    //这里主要是为了考虑到watch模式，它会在启动时先编译一次，然后监听文件变化，如果发生变化会重新开始编译
    //每次编译都会产出一个新的Compilation，代表每次的编译结果
    const compilation = new Compilation(this.options)
    compilation.build(callback)
  }

  // 第4步，执行run，开始编译
  run(callback) {
    this.hooks.run.call()

    const onCompiled = (err, stats, fileDependencies) => {
      // 第10步 确定好输出内容后，根据配置的输出路径和文件，将文件写入到文件系统
      for (let filename in stats.assets) {
        const filePath = path.join(this.options.output.path, filename)
        fs.writeFileSync(filePath, stats.assets[filename], 'utf8')
      }
      callback(err, {
        toJson: () => stats,
      })

      fileDependencies.forEach(fileDependency =>
        fs.watch(fileDependency, () => this.compile(onCompiled))
      )

      this.hooks.done.call() //当编译成功后会触发done这个钩子执行
    }

    this.compile(onCompiled) //开始编译，成功之后调用onCompiled
  }
}

// 第1步，搭建结构，读取配置参数，即webpack.config.js中的参数
function webpack(webpackOptions) {
  // 第2步，用配置参数初始化“Compiler”对象
  const compiler = new Compiler(webpackOptions)

  // 第3步，挂载配置参数中的所有插件
  const { plugins } = webpackOptions
  for (let plugin of plugins) {
    plugin.apply(compiler)
  }

  return compiler
}

// 模拟的插件
class WebpackRunPlugin {
  apply(compiler) {
    compiler.hooks.run.tap('webpackRunPlugin', () => {
      console.log('开始编译')
    })
  }
}

class WebpackDonePlugin {
  apply(compiler) {
    compiler.hooks.done.tap('webpackDonePlugin', () => {
      console.log('结束编译')
    })
  }
}

// 模拟的loader
const loader1 = source => {
  return source + '//给你的代码加点注释：loader1'
}

const loader2 = source => {
  return source + '//给你的代码加点注释：loader2'
}

module.exports = {
  webpack,
  loader1,
  loader2,
  WebpackDonePlugin,
  WebpackRunPlugin,
}
```

```js
// webpack.config.js
const path = require('path')
const { WebpackRunPlugin, WebpackDonePlugin, loader1, loader2 } = require('./webpack')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [loader1, loader2],
      },
    ],
  },
  plugins: [new WebpackRunPlugin(), new WebpackDonePlugin()],
}

```

通过debugger.js调用

```js
// debugger.js
const {webpack} = require('./webpack')
const webpackConfig = require('./webpack.config')
const compiler = webpack(webpackConfig)

compiler.run((err, stats) => {
  console.log('err:', err)
  console.log(
    stats.toJson({
      assets: true,
      chunks: true,
      modules: true,
    })
  )
})
```