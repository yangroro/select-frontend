/* eslint-disable */

const webpack = require('webpack');
const { DefinePlugin } = webpack;

module.exports = (env) => {
 return {
  plugins: [
    new DefinePlugin({
        USE_MOCK_RESPONSES: !!env.mock,
        DELAY_RESPONSE: env.delayResponse || 2000,
    }),
  ],
 }
};
