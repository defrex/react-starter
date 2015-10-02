
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const precss = require('precss');
const argv = require('yargs').argv;
const nodemon = require('nodemon');


const defaultConfig = {
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader' },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
        ),
      },
      { test: /\.json$/, loader: 'json-loader' },
    ],
  },

  postcss: [autoprefixer, precss],

  plugins: [
    new ExtractTextPlugin('main.css', { allChunks: true }),
  ],
};

if (argv.dev) {
  defaultConfig.devtool = 'sourcemap';
  defaultConfig.debug = true;
}


const clientConfig = _.extend({}, defaultConfig, {
  entry: path.resolve(__dirname, 'client.js'),

  output: {
    path: path.join(__dirname, 'public'),
    filename: 'main.js',
  },

  resolve: {
    modulesDirectories: ['node_modules'],
  },
});

if (argv.dev) {
  clientConfig.module.loaders.push(
    { test: require.resolve('react'), loader: 'expose?React' }
  );
} else {
  clientConfig.plugins.push(new webpack.optimize.OccurenceOrderPlugin());
  clientConfig.plugins.push(new webpack.optimize.DedupePlugin());
  clientConfig.plugins.push(new webpack.optimize.UglifyJsPlugin());
}


const nodeModules = {};
fs.readdirSync('node_modules')
  .filter((x)=> ['.bin'].indexOf(x) === -1)
  .forEach((mod)=> nodeModules[mod] = 'commonjs ' + mod);

const serverConfig = _.extend({}, defaultConfig, {
  entry: path.resolve(__dirname, 'server.js'),

  output: {
    path: __dirname, filename: 'bin.js',
  },

  target: 'node',

  externals: nodeModules,

  node: {
    __dirname: true,
    __filename: true,
  },
});


const onBuild = function(done) {
  return function(err, stats) {
    if(err)
      console.log('Error', err);
    else if (argv.verbose)
      console.log(stats.toString());

    if (done) done();
  };
};


gulp.task('build-client', function(done) {
  webpack(clientConfig).run(onBuild(done));
});

gulp.task('watch-client', function() {
  webpack(clientConfig).watch(100, onBuild());
});

gulp.task('build-server', function(done) {
  webpack(serverConfig).run(onBuild(done));
});

gulp.task('watch-server', function() {
  webpack(serverConfig).watch(100, onBuild());
});

gulp.task('build', ['build-client', 'build-server']);
gulp.task('watch', ['watch-client', 'watch-server']);


if (argv.dev) {
  gulp.task('run', ['watch-client', 'watch-server'], function() {
    const script = path.join(__dirname, 'bin.js');

    nodemon({ script, watch: script });
    nodemon.on('restart', ()=> gutil.log(gutil.colors.magenta('Restarting Server')));
  });
} else {
  gulp.task('run', function() {
    gutil.log(gutil.colors.red('"gulp run" is only available in dev mode.'));
  });
}
