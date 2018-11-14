const { resolve } = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader')
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');
const PATHS = require('../webpack.config.js/paths');

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig, env);

  config.module.rules.push({
    test: /\.tsx?$/,
    exclude: /node_modules/,
    include: /src\/app/,
    loader: 'awesome-typescript-loader',
    options: {
      configFileName: resolve(__dirname, '../tsconfig.json'),
      rootDir: '..',
      // jsx: 'react',
    }
  });

  config.module.rules.push({
    test: /\.js$/,
    loader: 'source-map-loader',
    enforce: 'pre',
  });

  config.resolve.extensions.push('.tsx');
  config.resolve.extensions.push('.ts');
  config.resolve.modules.push(PATHS.srcDir);
  config.resolve.modules.push(PATHS.baseDir); // To resolve css imports in storybook files

  config.plugins.push(
    new CheckerPlugin()
  )

  if (!config.watchOptions) config.watchOptions = {}
  config.watchOptions.aggregateTimeout = 1500;
  config.watchOptions.ignored = /node_modules/;

  return config;
};
