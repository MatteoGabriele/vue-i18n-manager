var path = require('path')

module.exports = [
  {
    test: /\.js$/,
    loader: 'eslint-loader',
    include: path.resolve(__dirname, '../src'),
    exclude: /node_modules/
  }
]
