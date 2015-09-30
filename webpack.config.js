
const webpack = require('webpack');
const { argv } = require('yargs');
const path = require('path');


const config = {
  entry: path.resolve(__dirname, 'client', 'main.js'),
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'main.js',
  },
  plugins: [],
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader' },
      { test: /\.scss$/, loader: 'style!css!sass' },
    ],
  },
};

if (argv.debug) {
  config.devtool = 'sourcemap';
  config.debug = true;
  config.module.loaders.push(
    { test: require.resolve('react'), loader: 'expose?React' }
  );
} else {
  config.plugins.push(new webpack.optimize.OccurenceOrderPlugin());
  config.plugins.push(new webpack.optimize.DedupePlugin());
  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = config;
