const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin')
const glob = require('glob')
const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common')

const purgePath = {
  src: path.join(__dirname, 'src'),
}

module.exports = merge(commonConfig, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['postcss-preset-env', {}]],
              },
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['postcss-preset-env', {}]],
              },
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    // purgecss-webpack-plugin to remove unused css or dead css
    new PurgeCSSPlugin({
      paths: glob.sync(`${purgePath.src}/**/*`, { nodir: true }),
      safelist: ['dummy-css'],
    }),
    new MiniCssExtractPlugin(),
  ],
})
