
require('babel/register');

const webpack = require('webpack');
const gulp = require('gulp');
const sass = require('gulp-sass');
const prefix = require('gulp-autoprefixer');
const argv = require('yargs').argv;


const webpackHandler = function(err) {
  if (err) console.error(err);
};

const webpackCompiler = webpack(require('./webpack.config'));

gulp.task('webpack', ()=> webpackCompiler.run(webpackHandler));


const sassArgs = { errLogToConsole: true, outputStyle: 'compressed' };

if (argv.debug) {
  sassArgs.outputStyle = 'expanded';
  sassArgs.sourceComments = 'normal';
}

gulp.task('css', function() {
  return gulp
    .src('client/sass/main.scss')
    .pipe(sass(sassArgs).on('error', sass.logError))
    .pipe(prefix('last 3 version'))
    .pipe(gulp.dest('./public/'));
});

gulp.task('watch', function() {
  gulp.watch(['client/sass/**/*.scss', 'client/sass/*.scss'], ['css']);
  webpackCompiler.watch(100, webpackHandler);
});

gulp.task('default', ['webpack', 'css']);
