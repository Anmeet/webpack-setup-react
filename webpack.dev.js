const path = require('path')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common')

module.exports = merge(commonConfig, {
  mode: 'development',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    // publicPath: 'dist/', // use to serve static files for Image i.e URL/...
    clean: true, // clean dist folder before generating new bundles  //disabling it as clean webpack plugin enabled on webpack common.js
  },
  devtool: 'eval-source-map', // for debugging reference to particular file
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    devMiddleware: {
      writeToDisk: true,
    },
    port: 9000,
    open: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.css$/,
        include: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]--[md4:hash:7]',
              },
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpeg|jpg|gif)$/,
        type: 'asset',
        generator: {
          filename: 'images/[name][ext]',
        },
        parser: {
          //condition to choose  asset/resource or asset/inline
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
    ],
  },
  plugins: [new BundleAnalyzerPlugin({})],
})
