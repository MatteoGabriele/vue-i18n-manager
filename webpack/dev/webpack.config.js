var webpack = require('webpack');
var merge = require('webpack-merge');
var plugins = require('./plugins');
var baseWebpackConfig = require('./../webpack.base.config');

const config = merge(baseWebpackConfig, {
  devtool: 'eval-source-map',
  plugins
});

module.exports = config;
