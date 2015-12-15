var gulp = require('gulp'),
  fs = require('fs'),
  fsExtra = require('fs-extra'),
  path = require('path'),
  jshint = require('gulp-jshint'),
  stylint = require('gulp-stylint'),
  stylus = require('gulp-stylus'),
  browsersync = require('browser-sync').create(),
  reload = browsersync.reload,
  plumber = require('gulp-plumber');

// 源文件路径
var src = {
  appStylus: 'src/app/**/*.styl',
  assestStylus: 'src/assest/stylus/**/*.styl',
  js: ['src/**/*.js', '!src/**/*.min.js', '!src/assest/js/lib/**/*.js'],
  html: 'src/**/*.html'
};

// 编译后的文件路径
var compile = {
  appCss: 'src/app',
  assestCss: 'src/assest/css'
};

// js文件检查任务
gulp.task('js', function() {
  return gulp.src(src.js)
    .pipe(jshint())
    .pipe(jshint.reporter());
});

// stylus代码检查、自动编译、自动注入任务
gulp.task('stylus', function (done) {
  gulp.src(src.appStylus)
    .pipe(plumber())
    .pipe(stylint())
    .pipe(stylint.reporter())
    .pipe(stylus())
    .pipe(gulp.dest(compile.appCss))
    .pipe(reload({stream: true}));

  gulp.src(src.assestStylus)
    .pipe(plumber())
    .pipe(stylint())
    .pipe(stylint.reporter())
    .pipe(stylus())
    .pipe(gulp.dest(compile.assestCss))
    .pipe(reload({stream: true}));
  done();
});

// 监控任务，当删除源码时同时删除掉编译的对应文件
gulp.task('watch', function(done) {
  gulp.watch(src.js, gulp.series('js', reload));
  gulp.watch(src.html, reload);
  gulp.watch([src.appStylus, src.assestStylus], gulp.series('stylus'))
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
  browsersync.init({
    proxy: 'localhost:9200',
    port: 3111,
    ui: {
      port: 8181
    }
  });
});

// 开发任务集合
gulp.task('dev', gulp.series(gulp.parallel('stylus', 'js'), gulp.parallel('watch', 'browser-sync')));



// 复制NPM包到开发目录
gulp.task('copy-dependence', function(done) {
  var dependence = require('./dependence.json');
  var prefixDependence = './node_modules',
    prefixDest = './src';
  for (var d in dependence) {
    if (dependence.hasOwnProperty(d)) {
      // npm源文件的路径和要拷贝到到路径
      if (typeof dependence[d] === "string") {
        dependence[d] = {
          type: 'js',
          src: dependence[d]
        }
      }
      var srcPath = path.join(prefixDependence, dependence[d].src),
        destParentPath = path.join(prefixDest, '/assest', dependence[d].type),
        destPath = path.join(destParentPath, '/lib', d);
      // 检查源文件的读写权限
      var stat;
      try {
        stat = fs.statSync(srcPath);
        if (!stat.isFile()) {
          console.error('路径%s不是一个文件，请检查配置文件dependence.json。', dependence[d]);
          break;
        }
      } catch (e) {
        console.error('npm源文件%s读写错误，检查文件是否存在，配置文件dependence.json是否出错。', srcPath);
        break;
      }
      // 拷贝文件
      try {
        fsExtra.copySync(srcPath, destPath);
        console.info('已完成依赖复制。%s --> %s', srcPath, destPath);
      } catch (e) {
        console.error('文件拷贝错误，请检查文件和目录的读写权限。%s --> %s', srcPath, destPath);
      }
    }
  }
  done();
});
