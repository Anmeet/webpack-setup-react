const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'), // entry point
  output: {
    filename: '[name].[contenthash].js', // name of output file
    path: path.resolve(__dirname, 'dist'),
    // publicPath: 'dist/', // use to serve static files for Image i.e URL/...
    clean: true, // clean dist folder before build
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, 'src'),
        exclude: path.resolve(__dirname, 'node_modules'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: 'defaults',
                  },
                ],
                '@babel/preset-react',
              ],
            },
          },
        ],
      },
      {
        test: /\.(png|jpeg|jpg|gif)$/,
        type: 'asset',
        parser: {
          //condition to choose  asset/resource or asset/inline
          dataUrlCondition: {
            maxSize: 3 * 1024,
          },
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
      template: './src/index.html',
      filename: 'index.html',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all', // include all types of chunks
    },
  },
}
