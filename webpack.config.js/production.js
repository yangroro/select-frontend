/* eslint-disable */

const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const { DefinePlugin, SourceMapDevToolPlugin } = webpack;
const { ModuleConcatenationPlugin } = webpack.optimize;

module.exports = {
  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
    new ModuleConcatenationPlugin(),
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: true,
      uglifyOptions: {
        safari10: true,
        compress: {
          warnings: false,
          drop_console: false,
        },
        comments: false,
      },
    }),
    new SourceMapDevToolPlugin({
      filename: '[file].map',
      moduleFilenameTemplate: 'webpack:///[id]',
      append: '\n//# sourceMappingURL=[url]',
    }),
  ],
};
