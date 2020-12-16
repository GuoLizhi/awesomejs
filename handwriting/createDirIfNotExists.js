/**
 * 创建一个文件夹
 * @param dir {String} 文件夹的名称
 */
function createDirIfNotExists(dir) {
  const fs = require("fs");
  !fs.existsSync(dir) ? fs.mkdirSync(dir) : undefined;
}
