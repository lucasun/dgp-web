
/**
 *
 */
const util = require('./util');

module.exports = function mock(app) {
  // 监听http请求
  util.walk().forEach((item) => {
    app.all(item.url, (rep, res) => {
      // 每次响应请求时读取mock/data的json文件
      /* eslint-disable-next-line */
      const mockData = require(item.relativePath);
      res.json(mockData);
    });
  });
};
