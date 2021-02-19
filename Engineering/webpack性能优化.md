1. 可以通过`speed-measure-webpack-plugin`来查看当前打包的性能瓶颈，90%的情况下性能瓶颈都在loader和plugin两个阶段

2. babel-loader可以使用`cacheDirectory`来开启缓存，开启之后每次的编译结果都会写入硬盘文件。如果有loader不支持缓存，可以使用`cache-loader`，这个loader所做的事情类似于babel-loader的cacheDirectory功能，将`loader`的编译结果写入硬盘，再次构建如果没有文件没有发生变化，则直接使用缓存文件。

```js
// babel-loader添加cacheDirectory示例
rules: [{
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader?cacheDirectory=true'
  }
}]
// 使用cache-loader示例
// loaders表示那些耗时比较长的loader
rules: [{
  test: /\.js$/,
  use: ['cache-loader', ...loaders],
  include: path.resolve('src')
}]
```

3. 代码压缩阶段的瓶颈，可以使用`uglifyjs-webpack-plugin`，parallel开启多进程，充分利用多核进行编译

```js
optimization: {
  minimizer: [
    new UglifyJsPlugin({
      cache: true,
      parallel: true
    })
  ]
}
```

4. 利用多核，happypack

```js
const HappyPack = require('happypack')
const os = require('os')

const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
})

module.exports = {
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: 'happypack/loader?id=js'
    }]
  },
  plugins: [
    new HappyPack({
      id: 'js',
      threadPool: happyThreadPool,
      loaders: [{
        loader: 'babel-loader'
      }]
    })
  ]
}
```

> 踩坑：MinCssExtractPlugin无法与happypack共存

5. 常用的静态依赖做抽离，比如常见的React全家桶，Vue全家桶等。目前有两种常用的方案，一种是`dll`，另外一种是`externals`，将不需要打包的静态资源从构建逻辑中剔除，使用CDN的方式

目前推荐使用CDN的方式，主要原因如下

- CDN可以将依赖拆分，然后充分利用HTTP2的多路复用的特性
- 无法支持浏览器的新特性`script type=module`

优雅的使用externals

```js
module.exports = {
  // key是我们import的包名，value是CDN为我们提供的全局变量名
  // 最后webpack会编译成如下：module.export.react = window.React
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    redux: 'redux',
    'react-router-dom': 'ReactRouterDOM'
  }
}
```

6. 体验方面的提升

- progress-bar-webpack-plugin
- webpack-build-notifier
- webpack-dashboard

> webpack构建效率优化的两大措施缓存和多核。缓存是为了二次构建不需要去做重复工作；多核是为了充分利用硬件本身的优势