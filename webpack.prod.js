const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const glob = require('glob')
const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common')

const purgePath = {
  src: path.join(__dirname, 'src'),
}

module.exports = merge(commonConfig, {
  mode: 'production',
  output: {
    filename: 'js/[name].[contenthash].js', // contenthash added for browser caching when name changes
    path: path.resolve(__dirname, 'dist'),
    // publicPath: 'dist/', // use to serve static files for Image i.e URL/...
    clean: true, // clean dist folder before generating new bundles
  },
  devtool: 'source-map', // for debugging takes user reference to particular js or css file. easier for debugging
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
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
        test: /\.css$/,
        include: /\.module\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[hash:base64]',
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
      {
        test: /\.(png|jpeg|jpg|gif)$/,
        type: 'asset',
        parser: {
          //condition to choose  asset/resource or asset/inline
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
        generator: {
          filename: 'images/[name].[contenthash:12][ext]',
        },
      },
    ],
  },
  plugins: [
    // purgecss-webpack-plugin to remove unused css or dead css
    new PurgeCSSPlugin({
      paths: glob.sync(`${purgePath.src}/**/*`, { nodir: true }),
      safelist: ['dummy-css'],
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      `...`,
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better result for you
            plugins: [
              ['imagemin-mozjpeg', { quality: 40 }],
              [
                'imagemin-pngquant',
                {
                  quality: [0.65, 0.9],
                  speed: 4,
                },
              ],
              ['imagemin-gifsicle', { interlaced: true }],
              [
                'imagemin-svgo',
                {
                  plugins: [
                    {
                      name: 'preset-default',
                      params: {
                        overrides: {
                          removeViewBox: false,
                          addAttributesToSVGElement: {
                            params: {
                              attributes: [
                                { xmlns: 'http://www.w3.org/2000/svg' },
                              ],
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
      maxSize: Infinity,
      minSize: 0,
      cacheGroups: {
        node_modules: {
          //separating nodemodules bundle and other bundle
          test: /[\\/]node_modules[\\/]/,
          name: 'node_modules',

          //Another way by spearating each by its own backgroundBlendMode:
          // test: /[\\/]node_modules[\\/]/,
          // name(module) {
          //   const packageName = module.context.match(
          //     /[\\/]node_modules[\\/](.*?)([\\/]|$)/
          //   )[1]
          //   return packageName
          // },
        },
      },
    },
  },
})
