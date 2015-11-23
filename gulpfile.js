var gulp = require('gulp'),
  stylus = require('gulp-stylus'),
  watch = require('gulp-watch'),
  coffee = require('gulp-coffee'),
  gutil = require('gulp-util'),
  browsersync = require('browser-sync').create(),
  reload = browsersync.reload,
  plumber = require('gulp-plumber');

var path = {
  coffee: './src/static/coffee/*/*.coffee',
  stylus: './src/static/stylus/*/*.styl',
  html: './src/page/*/*.html',
  dist: './dist'
};

gulp.task('coffee', function () {
  gulp.src(path.coffee)
    .pipe(plumber())
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest(path.dist))
    .pipe(reload());
});

gulp.task('stylus', function () {
  return gulp.src(path.stylus)
    .pipe(plumber())
    .pipe(stylus())
    .pipe(gulp.dest(path.dist))
    .pipe(reload({stream: true}));
});

gulp.task('watch', function () {
  gulp.watch(path.stylus, ['stylus']);
  gulp.watch(path.coffee, ['coffee']);
  gulp.watch(path.html).on("change", reload);
});

gulp.task('browser-sync', function () {
  browsersync.init({server: './src'});
});

gulp.task('dev', ['stylus', 'coffee', 'watch', 'browser-sync'], function () {
  console.log('started in dev mode.');
});
