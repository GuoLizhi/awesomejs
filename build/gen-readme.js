const fs = require('fs');
const path = require('path');

function genReadme() {
  let result = '## 1.手写JavaScript系列\n\n| 索引 | 功能 |\n|  ----  | ----  |\n';
  const dirPath = path.resolve(__dirname, '../handwriting')
  const files = fs.readdirSync(dirPath);
  files.map((file, index) => {
    const filePath = path.resolve(dirPath, file);
    const title = getSingleDescription(filePath);
    result += `|${index+1}|[${title}](./handwriting/${file})|\n`;
  });
  fs.writeFileSync(path.resolve(__dirname, '../README.md'), result);
  console.log('success!');
}

function getSingleDescription(path) {
  const content = fs.readFileSync(path, 'utf-8');
  const result = content.match(/\/\*\*\n\s\*\s(.+)\n/g);
  return RegExp.$1.trim();
}

genReadme()