var gulp = require('gulp'),
  fs = require('fs'),
  fsExtra = require('fs-extra'),
  path = require('path'),
  jshint = require('gulp-jshint'),
  stylint = require('gulp-stylint'),
  stylus = require('gulp-stylus'),
  watch = require('gulp-watch'),
  browsersync = require('browser-sync').create(),
  reload = browsersync.reload,
  plumber = require('gulp-plumber');

// 源文件路径
var src = {
  stylus: 'src/static/stylus/**/*.styl',
  js: 'src/static/js/**/*.js',
  html: 'src/view/**/*.html'
};

// 编译后的文件路径
var compile = {
  js: 'src/static/js',
  css: 'src/static/css'
};

// js文件检查任务
gulp.task('js', function() {
  return gulp.src(src.js)
    .pipe(jshint())
    .pipe(jshint.reporter());
});

// stylus代码检查、自动编译、自动注入任务
gulp.task('stylus', function () {
  return gulp.src(src.stylus)
    .pipe(plumber())
    .pipe(stylint())
    .pipe(stylint.reporter())
    .pipe(stylus())
    .pipe(gulp.dest(compile.css))
    .pipe(reload({stream: true}));
});

// 监控任务，当删除源码时同时删除掉编译的对应文件
gulp.task('watch', function(done) {
  gulp.watch(src.js, gulp.series('js'));
  gulp.watch(src.stylus, gulp.series('stylus'))
    .on('unlink', function(filepath) {
      console.log('path: %', filepath);
      var toRemoveFilePath = path.resolve(filepath.replace('stylus', 'css').replace('.styl', '.css'));
      fs.exists(toRemoveFilePath, function (exists) {
        if (exists) {
          fs.unlink(toRemoveFilePath, function() {
            done();
          });
        }
      });
    })
    .on('unlinkDir', function(filedir) {
      console.log('dir: %s', filedir);
      fsExtra.remove(filedir.replace('stylus', 'css'), function() {
        done();
      });
    });
});

// 浏览器自动刷新
gulp.task('browser-sync', function () {
  browsersync.init({server: './src'});
});

// 开发任务集合
gulp.task('dev', gulp.series(gulp.parallel('stylus', 'js'), gulp.parallel('watch', 'browser-sync')));
