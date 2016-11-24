var path = require('path');
var name = require('../package.json').name;
var loaders = require('./loaders');
var preLoaders = require('./preLoaders');
var plugins = require('./plugins');

module.exports = {
  entry: [
    'whatwg-fetch',
    './src'
  ],
  output: {
    path: path.resolve(__dirname, './../dist'),
    filename: name + '.js',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['', '.js', '.json'],
    component: path.resolve(__dirname, '../src/component'),
    module: path.resolve(__dirname, '../src/store/module'),
    events: path.resolve(__dirname, '../src/store/module/events')
  },
  eslint: {
    configFile: './.eslintrc',
    formatter: require('eslint-friendly-formatter')
  },
  module: {
    preLoaders,
    loaders
  },
  plugins
}
