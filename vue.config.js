const glob = require('glob')
const path = require('path')
const OS = require('os')
// gzip压缩
const CompressionPlugin = require('compression-webpack-plugin')
// const StyleLintPlugin = require('stylelint-webpack-plugin')
// const CodeframeFormatter = require('stylelint-codeframe-formatter')
// 打包分析
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

function resolve(dir) {
  return path.join(__dirname, dir)
}
// 查找pages下的所有页面入口
const pages = {}
const entry = 'main.js'
const excludePages = []
glob.sync(`./src/pages/**/${entry}`).forEach(page => {
  const chunk = page.split('./src/pages/')[1].split(`/${entry}`)[0]
  // 如当前系统部分页面不需打包，则排除在外
  if (excludePages.includes(page)) {
    return
  }
  pages[chunk] = {
    entry: page.slice(2),
    template: 'public/index.html',
    title: `${chunk}`,
    filename: `${chunk}.html`,
  }
  if (process.env.NODE_ENV !== 'development') {
    pages[chunk].chunks = ['runtime', 'chunk-commons', 'chunk-libs', 'chunk-vue', chunk]
  }
})

// 代理配置
const proEnv = require('./config/env.production') // 生产环境
const devEnv = require('./config/env.development')
// 本地环境
const isMock = !!process.env.USE_MOCK // 本地环境mock

const env = process.env.NODE_ENV
const dev = env === devEnv.NODE_ENV
let proxys = []

// 默认是本地环境
if (dev) {
  proxys = devEnv.hosturls
  proxys.forEach(proxy => {
    console.log(proxy.path, '已经代理到', proxy.target)
  })
} else if (isMock) {
  console.log('已启用mock')
} else {
  proxys = proEnv.hosturls
}
// 生成代理配置对象
const proxyObj = {}
proxys.forEach(proxy => {
  proxyObj[proxy.path] = {
    target: proxy.target,
    changeOrigin: true,
    ws: true,
    secure: false,
    pathRewrite: {
      [`^${proxy.path}`]: proxy.path,
    },
  }
})

const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

const webpackConfig = {
  pages,
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: !IS_PROD, // 生产环境的 source map
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
    extract: true,
    // 开启 CSS source maps?
    sourceMap: !IS_PROD,
    // 启用 CSS modules for all css / pre-processor files.
    requireModuleExtension: true,
  },
  devServer: {
    host: '0.0.0.0',
    port: 7777,
    https: false,
    open: true,
    hotOnly: false,
    disableHostCheck: true,
    proxy: isMock ? '' : proxyObj,
    // eslint-disable-next-line global-require
    // before: isMock ? require('./mock-manual') : () => { },
    before: require('./mock/mock-server.js'),
  },

  // 构建时开启多进程处理 babel 编译
  parallel: OS.cpus().length > 1,
  // 生产构建时禁用 eslint-loader
  lintOnSave: process.env.NODE_ENV !== 'production',
  // 只使用运行时版本的vue
  runtimeCompiler: false,

  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        new CompressionPlugin({
          test: /\.js$|\.html$|\.css/, // 匹配文件名
          threshold: 10240, // 对超过10k的数据进行压缩
          deleteOriginalAssets: false, // 是否删除原文件
        }),
      )
      if (process.env.npm_config_report) {
        // 打包后模块大小分析//npm run build --report
        config.plugins.push(new BundleAnalyzerPlugin())
      }
    }
  },
  chainWebpack(config) {
    // 防止多页面打包卡顿
    config.plugins.delete('named-chunks')
    // 禁用 prefetch
    Object.keys(pages).forEach(page => {
      config.plugins.delete(`preload-${page}`)
      config.plugins.delete(`prefetch-${page}`)
    })
    // alias
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('api', resolve('src/api'))
      .set('views', resolve('src/views'))
      .set('components', resolve('src/components'))
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development', config => config.devtool('cheap-source-map'))

    // config
    //   .plugin('stylelint')
    //   .use(StyleLintPlugin, [
    //     {
    //       failOnError: false,
    //       files: ['**/*.less'],
    //       formatter: CodeframeFormatter,
    //       fix: true,
    //       syntax: 'less',
    //     },
    //   ])
    //   .end()

    config.when(process.env.NODE_ENV !== 'development', config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/,
          },
        ])
        .end()

      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          commons: {
            name: 'chunk-commons',
            test: /src[\\/]components/, // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
          libs: {
            name: 'chunk-libs',
            chunks: 'initial',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
          },
          vue: {
            name: 'chunk-vue',
            chunks: 'initial',
            test: /[^.]vue|flexible/,
            priority: 15,
          },
        },
      })
      config.optimization.runtimeChunk('single')
    })
  },
}
module.exports = webpackConfig
