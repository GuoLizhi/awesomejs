const fs = require('fs');
const path = require('path');

function getSingleDescription(path) {
  const content = fs.readFileSync(path, 'utf-8');
  content.match(/\/\*\*\n\s\*\s(.+)\n/);
  return RegExp.$1.trim();
}

function getAllDirs() {
  const dirs = fs.readdirSync('./')
  let content = ''
  dirs.forEach((dir, index) => {
    const isDirectory = fs.statSync(dir).isDirectory()
    if (!/(build|git)/.test(dir) && isDirectory) {
      content += getDirReadme(dir, index)
    }
  })
  fs.writeFileSync(path.resolve(__dirname, '../README.md'), content);
  console.log('success!');
}

function getDirReadme(dir, i) {
  let result = `## ${i}. ${dir}\n\n| 索引 | 功能 | 地址 |\n|  ----  | ----  | ---- |\n`
  let files = fs.readdirSync(dir)
  if (files.length === 0) return ''
  files.sort()
  files.map((file, index) => {
    const filePath = path.resolve(dir, file)
    const title = /\.js$/.test(file) ? getSingleDescription(filePath) : file.replace('.md', '')
    result += `|${index+1}|${title}|[${file}](./${dir}/${file})|\n`
  })
  result += '\n\n'
  return result
}

getAllDirs()

// genReadme()