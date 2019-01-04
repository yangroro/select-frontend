const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');

const {
  ProgressPlugin,
  NoEmitOnErrorsPlugin,
} = webpack;

module.exports = (env = {}) => ({
  entry: './src/app/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.[hash].js',
  },
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
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, 'src/images/**/*'),
      to: path.resolve(__dirname, 'dist'),
    },{
      from: path.resolve(__dirname, 'src/css/extends/rui.css'),
      to: path.resolve(__dirname, 'dist/css/extends/rui.css'),
    }]),
  ],
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  watch: !env.production,
  watchOptions: {
    ignored: /node_modules/,
    poll: true,
  },
});
