webpack5重大更新：

### 1. 优化持久缓存

利用缓存实现增量编译，从而提升构建性能

webpack4中可以使用`cache-loader`或者部分loader的自带缓存功能。比如`babel-loader`可以配置参数`cacheDirectory`使用缓存

```js
// webpack缓存配置
cache: {
    type: 'filesystem',
    cacheDirectory: path.resolve(__dirname, '.temp_cache')
}
```

### 2. 优化长期缓存

webpack5针对`moduleId`和`chunkId`的计算方式进行了优化，增加确定性的moduleId和chunkId生成策略。实现长期缓存，生产环境下默认开启。

webpack4的moduleId和chunkId的默认值都是自增id，容易导致文件缓存失效。但可以通过`HashedModuleIdsPlugin`和`NamedChunksPlugin`两个来生成稳定的moduleId和chunkId

### 3. NodeJS的polyfill脚本被移除

对于V4以前的版本，Node模块会自动添加polyfill脚本，polyfill会自动加入到bundle中，其实通常情况下是没有必要的。

### 4. 更好的TreeShaking

在 v5 中会分析模块 export 与 import 之间的依赖关系，最终的代码生成非常简洁：

```js
// inner.js
export const a = 'aaaaaaaaaa';
export const b = 'bbbbbbbbbb';

// module.js
import * as inner from "./inner";
export { inner };

// index.js
import * as module from "./module";
console.log(module.inner.a);
```

编译之后的代码

```js
!function(){"use strict;"console.log("aaaaaaaaaa")}
```

### 5. 联邦模块`Federation Module`

这个通常应用在微前端中。让 Webpack 达到了线上 runtime 的效果，让代码直接在独立应用间利用 CDN 直接共享，不再需要本地安装 NPM 包、构建再发布了！