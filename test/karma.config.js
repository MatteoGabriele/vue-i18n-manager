var webpackConfig = require('../webpack.config.js');
var isTravis = !!process.env.TRAVIS

delete webpackConfig.entry

module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    singleRun: isTravis,
    frameworks: ['mocha', 'chai'],
    reporters: ['mocha'],
    files: [
        './index.js',
    ],
    plugins: [
        'karma-phantomjs-launcher',
        'karma-chai',
        'karma-mocha',
        'karma-webpack',
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
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel',
            query: {
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
