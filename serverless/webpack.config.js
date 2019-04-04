const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  target: 'node',
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'babel-loader' },
    ],
  },
  externals: [
    nodeExternals(),
  ],
  plugins: [
    new CopyPlugin([
      { from: 'views', to: 'views' },
    ]),
  ],
  optimization: {
    minimize: false,
  },
};
