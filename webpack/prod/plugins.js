var path = require('path');
var _ = require('lodash');
var webpack = require('webpack');
var webpackAutoInjectVersion = require('webpack-auto-inject-version')

var plugins = [
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      drop_console: false
    },
    comments: false,
    minimize: false
  }),
  new webpackAutoInjectVersion()
];

module.exports = _.compact(plugins);
