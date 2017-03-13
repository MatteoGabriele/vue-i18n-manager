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
          presets: [
            ["env", {
              "targets": {
                "browsers": ['last 3 iOS versions', 'last 3 versions', 'ie >= 9'],
                "uglify": true,
              },
              "modules": false,
              "useBuiltIns": true,
              "exclude": [
                "transform-regenerator",
                "es6.typed.data-view",
                "es6.typed.int8-array",
                "es6.typed.uint8-array",
                "es6.typed.uint8-clamped-array",
                "es6.typed.int16-array",
                "es6.typed.uint16-array",
                "es6.typed.int32-array",
                "es6.typed.uint32-array",
                "es6.typed.float32-array",
                "es6.typed.float64-array",
                "es6.reflect.apply",
                "es6.reflect.construct",
                "es6.reflect.define-property",
                "es6.reflect.delete-property",
                "es6.reflect.get",
                "es6.reflect.get-own-property-descriptor",
                "es6.reflect.get-prototype-of",
                "es6.reflect.has",
                "es6.reflect.is-extensible",
                "es6.reflect.own-keys",
                "es6.reflect.prevent-extensions",
                "es6.reflect.set",
                "es6.reflect.set-prototype-of",
                "es6.symbol",
                "transform-es2015-typeof-symbol",
                "es6.math.acosh",
                "es6.math.asinh",
                "es6.math.atanh",
                "es6.math.cbrt",
                "es6.math.clz32",
                "es6.math.cosh",
                "es6.math.expm1",
                "es6.math.fround",
                "es6.math.hypot",
                "es6.math.imul",
                "es6.math.log1p",
                "es6.math.log10",
                "es6.math.log2",
                "es6.math.sign",
                "es6.math.sinh",
                "es6.math.tanh",
                "es6.math.trunc",
                "es6.map",
                "es6.set",
                "es6.weak-map",
                "es6.weak-set"
              ]
            }],
            'stage-2'
          ]
        }
      }
    ]
  },
  plugins
}
