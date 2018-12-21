/* eslint-disable */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const webpack = require('webpack');
const { CheckerPlugin } = require('awesome-typescript-loader');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = require('./paths');
const { NameEveryModulePlugin } = require('./helpers');

const {
  ProgressPlugin,
  HashedModuleIdsPlugin,
  NamedChunksPlugin,
  NoEmitOnErrorsPlugin
} = webpack;
const { CommonsChunkPlugin } = webpack.optimize;

const {
  baseDir,
  srcDir,
  outputDir,
} = PATHS;

const {
  HOST_STATIC = 'static-select.ridibooks.com',
  HOST_RIDISELECT = 'select.ridibooks.com'
} = (() => {
  try {
    return dotenv.parse(fs.readFileSync(path.resolve(__dirname, '../../.env')));
  } catch (err) {
    const hostRidiselect = process.env.HOST_RIDISELECT ? process.env.HOST_RIDISELECT : null;
    const hostStatic = process.env.HOST_STATIC ? process.env.HOST_STATIC : null;

    return {
      HOST_RIDISELECT: hostRidiselect,
      HOST_STATIC: hostStatic
    };
  }
})();

module.exports = {
  context: srcDir,
  entry: {
    polyfill: ['app/config/customEvent.polyfill.js', 'core-js/shim', 'whatwg-fetch', 'element-closest'],
    main: 'app/index.tsx',
    sentry: 'app/utils/sentry.js'
  },
  output: {
    path: outputDir,
    publicPath: `https://${HOST_STATIC}/dist/`,
    filename: '[name].min.js',
    chunkFilename: '[name].[chunkhash].min.js',
    hashDigestLength: 8,
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        include: srcDir,
        use: {
          loader: 'tslint-loader',
          options: {
            fix: true,
          },
        },
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'awesome-typescript-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: [
      srcDir,
      'node_modules',
      baseDir, // To resolve css imports in storybook files
    ],
    // Disable real path resolution for symlink paths
    // to apply right loaders to @ridi packages via test regex '/node_modules/'
    // You have to enable this option to watch @ridi or other symlinked node modules
    symlinks: false,
  },
  plugins: [
    new ProgressPlugin(),
    new DotenvPlugin({
      path: path.resolve(__dirname, '../../.env'),
      systemvars: true,
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: '../views/home_template.html',
      filename: '../views/home.html',
      staticHost: HOST_STATIC,
      locationHost: HOST_RIDISELECT,
      minify: {
        collapseWhitespace: true,
      },
    }),
    new NoEmitOnErrorsPlugin(),
    new CheckerPlugin(),
    new NamedChunksPlugin(chunk => {
      if (chunk.name) return chunk.name;
      return chunk.mapModules((m) => (
        path.relative(m.context, m.userRequest).replace(/.tsx?/, '').toLowerCase()
      )).join('_');
    }),
    new HashedModuleIdsPlugin({ hashDigestLength: 8 }),
    new NameEveryModulePlugin(),
    new CommonsChunkPlugin({
      name: 'vendors',
      minChunks: module => {
        return module.context && module.context.includes('node_modules') && !(/core-js|whatwg-fetch|element-closest/).test(module.context);
      },
    }),
    new CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
    }),
    new CopyWebpackPlugin([{
      from: path.join(srcDir, 'images/**/*'),
      to: path.join(outputDir),
    },{
      from: path.join(srcDir, 'css/extends/rui.css'),
      to: path.join(outputDir, 'css/extends/rui.css'),
    }]),
  ],
};
