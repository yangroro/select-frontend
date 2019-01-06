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
  entry: './src/app/index.tsx',
  output: {
    filename: 'app.[hash].js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
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
    new DotenvPlugin({
      systemvars: true,
      silent: true,
    }),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: 'src/index.html.hbs',
    }),
    new HotModuleReplacementPlugin(),
  ],
  devtool: 'inline-source-map',
  devServer: {
    compress: true,
    contentBase: __dirname,
    disableHostCheck: true,
    historyApiFallback: true,
    host: '0.0.0.0',
    hot: true,
    open: false,
    port: process.env.WDS_PORT,
    public: process.env.SELECT_URL,
  },
});
