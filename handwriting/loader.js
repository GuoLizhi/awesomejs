/**
 * 手写一个简单的webpack loader
 * 实现功能：可以编译简单地字符串模板
 * 比如 <p>{{ name }}</p><p>{{ age }}</p>
 */
 function tplReplace(options, source) {
  return source.replace(/\{\{(.+?)\}\}/g, (matcher, name) => {
    return options[name] || ''
  })
}

// 对于一个webpack的loader而言，source就是我们获取到的字符串形式的源代码
// 我们所做的主要功能就是对这个字符串进行处理，然后生成我们所需要的的字符串
// 比如：这个模板loader，核心的功能就是使用正则表达式匹配到其中的变量，然后使用用户传入的数据来替换

// 另外需要注意：如果我们使用loader时，还利用options传入了数据，我们可以使用`loader-utils`这个库

function tplLoader(source) {
  source = source.replace(/\s/g, '')
  return `
    export default (options) => {
      ${tplReplace.toString()}
      return tplReplace(options, '${source}')
    }
  `
}

module.exports = tplLoader
