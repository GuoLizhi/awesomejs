const fs = require('fs');
const path = require('path');

const prefixUrl = 'https://github.com/GuoLizhi/awesomejs/blob/master'

const dirnameMap = {
  handwriting: '手写JavaScript代码系列',
  CSS: 'CSS相关',
  DesignPattern: '设计模式相关',
  HTTP: '网络相关',
  JavaScript: 'JavaScript知识备忘',
  NodeJS: 'NodeJS相关',
  React: 'React相关',
  Vue: 'Vue相关',
  Engineering: '工程化'
}

function getSingleDescription(path) {
  const content = fs.readFileSync(path, 'utf-8');
  content.match(/\/\*\*\r?\n\s\*\s(.+)\r?\n/);
  return RegExp.$1.trim();
}

function getAllDirs() {
  const dirs = fs.readdirSync('./')
  let content = ''
  dirs.forEach((dir) => {
    const isDirectory = fs.statSync(dir).isDirectory()
    if (!/(build|git|dist)/.test(dir) && isDirectory) {
      content += getDirReadme(dir)
    }
  })
  fs.writeFileSync(path.resolve(__dirname, '../README.md'), content);
  console.log('success!');
}
let count = 1
function getDirReadme(dir, i) {
  let result = `## ${count++}. ${dirnameMap[dir]}\n\n`
  let files = fs.readdirSync(dir)
  if (files.length === 0) return ''
  files.sort()
  files.map((file, index) => {
    const filePath = path.resolve(dir, file)
    const title = /\.js$/.test(file) ? getSingleDescription(filePath) : file.replace('.md', '')
    result += `${index+1}. [${title}](${prefixUrl}/${dir}/${file})\n`
  })
  result += '\n\n'
  return result
}

getAllDirs()

// genReadme()