var webpackConfig = require('../webpack/dev/webpack.config');
var isTravis = !!process.env.TRAVIS
var webpack = require('webpack')

delete webpackConfig.entry

module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    singleRun: isTravis,
    frameworks: ['mocha', 'chai', 'sinon'],
    reporters: ['mocha'],
    // mochaReporter: {
    //   output: 'autowatch'
    // },
    files: [
        './index.js',
        '../node_modules/phantomjs-polyfill-object-assign/object-assign-polyfill.js',
        '../node_modules/phantomjs-polyfill-find/find-polyfill.js'
    ],
    client: {
      captureConsole: false
    },
    plugins: [
        'karma-phantomjs-launcher',
        'karma-chai',
        'karma-mocha',
        'karma-webpack',
        'karma-sinon',
        'karma-mocha-reporter',
        'karma-chrome-launcher',
        'karma-sourcemap-loader'
    ],
    preprocessors: {
        './index.js': ['webpack', 'sourcemap']
    },
    webpack: {
      devtool: 'inline-source-map',
      entry: './test/index.js',
      output: {
        path: __dirname,
        filename: 'test-bundle.js'
      },
      module: {
        rules: [
          {
            test: /sinon.js$/,
            loader: "imports?define=>false"
          },
          {
            test: /\.js$/,
            loader: 'babel-loader',
            query: {
              compact: false,
              presets: ['es2015', 'stage-2']
            },
            exclude: /node_modules/
          }
        ]
      }
    },
    webpackMiddleware: {
        noInfo: true
    }
  });
};
