/* eslint-disable */

const webpack = require('webpack');
const { EvalSourceMapDevToolPlugin } = webpack;

module.exports = {
  plugins: [
    new EvalSourceMapDevToolPlugin({
      module: true,
    }),
  ],
  watchOptions: {
    ignored: /node_modules/,
    poll: true,
  },
};
