const path = require('path');

const {
  ProgressPlugin,
  NoEmitOnErrorsPlugin,
  HotModuleReplacementPlugin,
} = require('webpack');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');

require('dotenv').config();

module.exports = (env = {}) => ({
  entry: {
    app: ['./src/app/index.tsx'],
  },
  output: {
    filename: '[name].[hash].js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/',
  },
  mode: 'development',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'tslint-loader',
        },
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules',
    ],
  },
  plugins: [
    new ProgressPlugin(),
    new NoEmitOnErrorsPlugin(),
    new HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: 'src/index.hbs',
    }),
    new DotenvPlugin({
      systemvars: true,
      silent: true,
    }),
  ],
  devtool: 'inline-source-map',
  devServer: {
    compress: true,
    contentBase: __dirname,
    disableHostCheck: true,
    historyApiFallback: {
      index: '/dist/index.html',
    },
    host: '0.0.0.0',
    hot: true,
    open: false,
    port: 9000,
    public: process.env.SELECT_URL,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /node_modules/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
});
