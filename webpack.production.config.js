var path = require('path');
var webpack = require('webpack');
module.exports = {
  devtool: 'hidden-source-map',
  entry: {
    app: __dirname + '/lib/public/src/App'
  },
  output: { 
    path: __dirname + '/lib/public/js', 
    filename: '[name].js' 
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.ProvidePlugin({
      'Promise': 'es6-promise'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    /*new webpack.optimize.UglifyJsPlugin({
      compress: { 
        warnings: false,
        unused: true,
        loops: true,
        evaluate: true,
        dead_code: true,
        comparisons: true
      },
      mangle: {
        toplevel: true,
        sort: true,
        eval: true,
        properties: true
      },
      output: {
        comments: false
      }
    }),*/
    new webpack.optimize.AggressiveMergingPlugin()
  ],
  module: {
    preLoaders: [
      { test: /\.js$/, loader: "source-map-loader" }
    ],
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  }
};