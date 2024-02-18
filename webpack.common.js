const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'), // entry point
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: path.resolve(__dirname, 'src'),
        exclude: path.resolve(__dirname, 'node_modules'),

        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /.(ttf|woff|woff2)$/,
        type: 'asset/resource',
      },
      {
        test: /\.txt/,
        type: 'asset/source',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack setup',
      template: './src/index.html',
      filename: 'index.html',
      meta: {
        description: 'some description',
      },
    }),
    //terser plugin to reduce the js bundle size
    new TerserPlugin(),
    // Clean Webpack Plugin  cleans the dist folder before generating new bundles
    //its is same as providing clean: true on Output but give more features of removing any folder before generating bundles
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        '**/*',
        path.join(process.cwd(), 'build/**/*'),
      ],
    }),

    // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: 'assets/*.*',
    //     },
    //   ],
    // }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all', // include all types of chunks
      minSize: 3000, //create additional bundle for > min size
    },
  },
}
