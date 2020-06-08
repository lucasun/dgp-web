/**
 * 根据路径读取JSON文件并且返回JSON内容
 */
const fs = require('fs');
const path = require('path');

module.exports = {
  // 遍历data目录下的JSON文件，并且映射为API路径
  walk(dirPath = `.${path.sep}data`) {
    const result = [];
    function walkDir(dir) {
      const list = fs.readdirSync(path.resolve(__dirname, dir));
      list.forEach((file) => {
        const fPath = path.join(path.resolve(__dirname, dir), file);
        const stat = fs.statSync(fPath);
        if (stat.isDirectory()) {
          walkDir(fPath);
        } else {
          result.push({
            url: fPath.split(`mock${path.sep}data`)[1].split('.json')[0].split(path.sep).join('/'),
            path: fPath,
            relativePath: `.${fPath.split(__dirname)[1].split(path.sep).join('/')}`,
          });
        }
      });
    }
    walkDir(dirPath);
    return result;
  },
  // 读取json文件
  getJsonFile(filePath) {
    const json = fs.readFileSync(path.resolve(__dirname, filePath), 'utf-8');
    return JSON.parse(json);
  },
};
