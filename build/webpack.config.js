const join = require('path').join
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackBar = require('webpackbar')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const config = require('../config')

const cfg = config[process.env.PROD_ENV]

const assetsPath = (...relativePath) => join(__dirname, '..', ...relativePath)
const isFontFile = url => /\.(woff2?|eot|ttf|otf)(\?.*)?$/.test(url)

const isProd = process.env.BABEL_ENV === 'production'

const STATIC_HOST = cfg.staticHost
const publicPath = path => isProd ? STATIC_HOST : '/'

const entry = {
  vendor: ['react', 'react-dom', 'dva'],
  index: [assetsPath(`src/entry.js`)],
}

module.exports = {
  mode: process.env.BABEL_ENV,
  entry: Object.keys(entry).reduce((entry, key) => ({
    ...entry,
    [`${key}`]: isProd ? entry[`${key}`] : entry[`${key}`].concat(['webpack-hot-middleware/client'])
  }), entry),
  devtool: isProd ? false : 'source-map',
  output: Object.assign({}, {
    path: assetsPath('dist'),
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].chunk.js',
    publicPath: publicPath('./')
  }, isProd ? {
    filename: 'js/[name].[chunkhash:7].js',
    chunkFilename: 'js/[name].chunk.[chunkhash:7].js'
  } : {}),
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [
      assetsPath('src'),
      assetsPath('node_modules')
    ],
    alias: Object.assign({}, {
      'views': assetsPath('src/views'),
      '@': assetsPath('src/'),
    })
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'eslint-loader',
      enforce: 'pre',
      include: [assetsPath('src')],
      options: {
        formatter: require('eslint-friendly-formatter')
      }
    },
    {
      test: /\.jsx?$/,
      use: 'babel-loader',
      include: [assetsPath('src')]
    },
    {
      test: /\.(css|less)$/,
      use: [
        MiniCssExtractPlugin.loader,
        `css-loader?${isProd ? 'minimize=true' : ''}`,
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: isProd ? false : 'inline',
            plugins: [
              autoprefixer({
                browsers: ['last 2 versions', 'Android >= 4.0', 'iOS >= 7.0']
              })
            ],
          }
        }, {
          loader: 'less-loader',
          options: {
            javascriptEnabled: true,
            sourceMap: !isProd,
            includePaths: [assetsPath('src/assets/less')]
          }
        }
      ]
    },
    {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'img/[name].[hash:7].[ext]',
        publicPath: publicPath('../')
      }
    },
    {
      test: /\.(woff2?|eot|ttf|otf|mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: '[name].[hash:7].[ext]',
        outputPath: url => `${isFontFile(url) ? 'fonts' : 'media'}/${url}`,
      }
    }]
  },
  optimization: {
    ...(isProd ? {
      runtimeChunk: {
        name: 'manifest'
      }
    } : {}),
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all'
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.BABEL_ENV,
      PROD_ENV: process.env.PROD_ENV,
      DEBUG: !isProd
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash:7].css',
      chunkFilename: 'css/[name].[hash:7].chunk.css',
    }),
    new HtmlWebpackPlugin({
      minify: isProd ? {
        html5: false
      } : {},
      chunks: (isProd ? ['manifest'] : []).concat(['vendor', 'index']),
      // favicon: assetsPath('src/assets/images/favicon.ico'),
      filename: `index.html`,
      template: assetsPath('src/index.html')
    }),
    new WebpackBar()
  ].concat(isProd ? [
    new webpack.optimize.AggressiveSplittingPlugin({
      minSize: 50000,
      maxSize: 240000
    }),
    new webpack.optimize.AggressiveMergingPlugin({
      minSizeReduce: 1.001
    }),
  ] : [
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'server',
    //   analyzerHost: '127.0.0.1',
    //   analyzerPort: 8889,
    //   reportFilename: 'report.html',
    //   defaultSizes: 'parsed',
    //   openAnalyzer: true,
    //   generateStatsFile: false,
    //   statsFilename: 'stats.json',
    //   statsOptions: null,
    //   logLevel: 'info'
    // }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]),
  profile: true
}
