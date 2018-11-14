/* eslint-disable */
const path = require('path');

module.exports = (ctx) => {
  const production = ctx.env === 'production';
  return {
    map: !production && 'inline',
    plugins: [
      require('postcss-import')({
        root: ctx.file.dirname,
      }),
      require('postcss-nesting')(),
      require('postcss-base64')({
        extensions: ['.png', '.gif'],
        root: 'src/images',
      }),
      require('postcss-cssnext')({ features: { nesting: false } }),
      require('postcss-reporter')({
        clearReportedMessages: true,
      }),
    ].concat(production && [
      require('cssnano')({
        safe: true,
        autoprefixer: false,
        discardComments: { removeAll: true },
      }),
    ]),
  };
};
