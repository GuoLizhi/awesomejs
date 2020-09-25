const fs = require('fs');
const path = require('path');

function genReadme() {
  let result = '## 1.手写JavaScript系列\n\n| 索引 | 功能 | 地址 |\n|  ----  | ----  | ---- |\n';
  const dirPath = path.resolve(__dirname, '../handwriting')
  let files = fs.readdirSync(dirPath);
  files.sort()
  files.map((file, index) => {
    const filePath = path.resolve(dirPath, file);
    const title = getSingleDescription(filePath);
    result += `|${index+1}|${title}|[${file}](./handwriting/${file})|\n`;
  });
  fs.writeFileSync(path.resolve(__dirname, '../README.md'), result);
  console.log('success!');
}

function getSingleDescription(path) {
  const content = fs.readFileSync(path, 'utf-8');
  content.match(/\/\*\*\n\s\*\s(.+)\n/);
  return RegExp.$1.trim();
}

genReadme()