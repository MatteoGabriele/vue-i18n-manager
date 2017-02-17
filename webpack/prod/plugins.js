var path = require('path');
var _ = require('lodash');
var webpack = require('webpack');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

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
  new webpack.optimize.DedupePlugin(),
  new BundleAnalyzerPlugin()
];

module.exports = _.compact(plugins);
