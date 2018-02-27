var path = require('path');
var webpack = require('webpack');
var WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = {
  entry: {
    app: __dirname + '/lib/public/src/App'
  },
  output: { 
    path: __dirname + '/lib/public/js', 
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.ts', '.tsx']
  },
  plugins: [
    new webpack.ProvidePlugin({
      'Promise': 'es6-promise'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
};