var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  stylint = require('gulp-stylint'),
  stylus = require('gulp-stylus'),
  watch = require('gulp-watch'),
  gutil = require('gulp-util'),
  browsersync = require('browser-sync').create(),
  reload = browsersync.reload,
  plumber = require('gulp-plumber'),
  notify = require("gulp-notify"),
  htmlInjector = require("bs-html-injector");

var src = {
  stylus: 'src/static/stylus/*/*.styl',
  js: 'src/static/js/*/*.js',
  html: 'src/page/*/*.html'
};

var compile = {
  js: 'src/static/js',
  css: 'src/static/css'
};

gulp.task('hint-js', function() {
  return gulp.src(src.js)
    .pipe(plumber({errorHandler: notify.onError('Js hint error: <%= error.message %>')}))
    .pipe(jshint())
    .pipe(jshint.reporter());
});

gulp.task('lint-stylus', function () {
  return gulp.src(src.stylus)
    .pipe(plumber({errorHandler: notify.onError('Stylus lint error: <%= error.message %>')}))
    .pipe(stylint())
    .pipe(stylint.reporter());
});

gulp.task('js', function () {
  return gulp.src(src.js)
    .pipe(reload());
});

gulp.task('stylus', function () {
  return gulp.src(src.stylus)
    .pipe(plumber({errorHandler: notify.onError('Stylus compile error: <%= error.message %>')}))
    .pipe(stylus())
    .pipe(gulp.dest(compile.css))
    .pipe(reload({stream: true}));
});

gulp.task('watch', function () {
  gulp.watch(src.stylus, ['lint-stylus', 'stylus']);
  gulp.watch(src.js, ['hint-js', 'js']);
  gulp.watch(src.html).on("change", reload);
});

gulp.task('browser-sync', function () {
  browsersync.use(htmlInjector, {
    files: src.html
  });
  browsersync.init({server: './src'});
});

gulp.task('dev1', ['hint-js', 'lint-stylus', 'stylus', 'watch', 'browser-sync'], function () {
  console.log('started in dev mode.');
});

gulp.task('dev', ['lint-stylus', 'browser-sync'], function () {
  console.log('started in dev mode.');
});
