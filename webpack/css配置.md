如果要模仿umi引入样式的方式，比如
```
import styles from './index.less'
```
需要配置css-lodaer来模仿：
```js
{
	loader: 'css-loader',
	options: {
		modules: {
			localIdentName: '[path][name]-[local]'
		},
		importLoaders: 1
	}
}
```