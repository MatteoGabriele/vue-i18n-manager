var path = require('path');
var _ = require('lodash');
var webpack = require('webpack');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

var plugins = [
  new ProgressBarPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      drop_console: false
    },
    comments: false,
    minimize: false
  }),
  new LodashModuleReplacementPlugin()
];

module.exports = _.compact(plugins);
