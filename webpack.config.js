var path = require('path')
var name = require('./package.json').name

module.exports = {
  devtool: 'source-map',
  entry: './src',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: name + '.js',
    libraryTarget: 'umd'
  },
  eslint: {
    configFile: './.eslintrc',
    formatter: require('eslint-friendly-formatter')
  },
  resolve: {
    extensions: ['', '.js', '.json']
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          retainLines: true,
          plugins: ['transform-runtime'],
          presets: ['es2015', 'stage-2']
        },
        exclude: /node_modules/
      }
    ]
  }
}
