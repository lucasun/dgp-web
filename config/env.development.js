const devBaseUrl = 'http://10.96.80.17';
const congfaUrl = 'http://55.11.32.243:8080';

module.exports = {
  NODE_ENV: 'development',
  hosturls: [
    {
      path: '/matrix',
      target: devBaseUrl,
    },
    {
      path: '/data_market',
      target: congfaUrl,
    },
  ],
}