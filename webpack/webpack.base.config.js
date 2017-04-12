var path = require('path');
var name = require('../package.json').name;
var plugins = require('./plugins');

module.exports = {
  entry: {
    'vue-i18n-manager': [
      './src'
    ]
  },
  output: {
    path: path.resolve(__dirname, './../dist'),
    filename: '[name].js',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      module: path.resolve(__dirname, '../src/store/module'),
      events: path.resolve(__dirname, '../src/store/module/events')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['blue']
        }
      }
    ]
  },
  plugins
}
